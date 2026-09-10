// ===== 一键直达 Launcher 设置页逻辑 (options.js) =====
// MV3 CSP 禁止内联脚本，所有 JS 放这里

const EMOJIS = ["🤖","📝","💼","🌐","🔍","⚽","📰","🎬","🎵","🛒","💰","📊","🏠","☁️","📧","🗂️","📅","🧭","🔧","⭐"];
const DEFAULT_LINKS = [
  { id: "ds", name: "DeepSeek Harness", url: "http://127.0.0.1:3080/", icon: "🤖" },
  { id: "gzh", name: "公众号后台", url: "https://mp.weixin.qq.com/", icon: "📝" },
  { id: "feishu", name: "飞书", url: "https://www.feishu.cn/", icon: "💼" }
];

let links = [];
let settings = { defaultLinkId: "ds" };
let editingId = null; // 当前正在编辑图标的行

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function load() {
  const data = await chrome.storage.local.get(["links", "settings"]);
  links = (data.links && data.links.length) ? data.links : DEFAULT_LINKS;
  settings = { defaultLinkId: "ds", ...(data.settings || {}) };
  render();
}

function render() {
  const list = document.getElementById("linkList");
  list.innerHTML = "";
  links.forEach((link, idx) => {
    const row = document.createElement("div");
    row.className = "link-row";
    row.innerHTML = `
      <input class="icon-input" value="${escapeHtml(link.icon)}" data-idx="${idx}" data-field="icon" placeholder="图标">
      <input value="${escapeHtml(link.name)}" data-idx="${idx}" data-field="name" placeholder="名称">
      <input value="${escapeHtml(link.url)}" data-idx="${idx}" data-field="url" placeholder="https://...">
      <span class="default-mark ${settings.defaultLinkId === link.id ? 'active' : ''}" data-action="default" data-id="${link.id}">${settings.defaultLinkId === link.id ? '✓ 默认' : '设默认'}</span>
      <button class="btn-up" data-action="move" data-idx="${idx}" data-dir="-1">↑</button>
      <button class="btn-up" data-action="move" data-idx="${idx}" data-dir="1">↓</button>
      <button class="btn-del" data-action="del" data-idx="${idx}">✕</button>
    `;
    list.appendChild(row);
  });

  // Emoji 选择器
  const picker = document.getElementById("emojiPicker");
  picker.innerHTML = "";
  EMOJIS.forEach(e => {
    const span = document.createElement("span");
    span.textContent = e;
    span.title = "填入图标";
    span.setAttribute("data-emoji", e);
    picker.appendChild(span);
  });
}

// ===== 事件绑定（全部用 addEventListener，不用内联 onclick）=====

// 添加链接
document.getElementById("btnAdd").addEventListener("click", () => {
  links.push({ id: "l" + Date.now(), name: "新链接", url: "https://", icon: "🔗" });
  render();
  const rows = document.querySelectorAll('.link-row');
  const last = rows[rows.length - 1];
  if (last) last.querySelector('input[data-field="name"]').focus();
});

// 保存
document.getElementById("btnSave").addEventListener("click", async () => {
  await chrome.storage.local.set({ links, settings });
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
});

// 链接列表内的事件（委托）
document.getElementById("linkList").addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (action === "default") {
    settings.defaultLinkId = el.dataset.id;
    render();
  } else if (action === "del") {
    const idx = parseInt(el.dataset.idx);
    const id = links[idx].id;
    links.splice(idx, 1);
    if (settings.defaultLinkId === id) settings.defaultLinkId = (links[0] || {}).id || "";
    render();
  } else if (action === "move") {
    const idx = parseInt(el.dataset.idx);
    const dir = parseInt(el.dataset.dir);
    const target = idx + dir;
    if (target < 0 || target >= links.length) return;
    [links[idx], links[target]] = [links[target], links[idx]];
    render();
  }
});

// Emoji 选择
document.getElementById("emojiPicker").addEventListener("click", (e) => {
  const span = e.target.closest("[data-emoji]");
  if (!span) return;
  const idx = (editingId !== null) ? editingId : 0;
  const input = document.querySelector(`.icon-input[data-idx="${idx}"]`);
  if (input) {
    input.value = span.dataset.emoji;
    links[idx].icon = span.dataset.emoji;
  }
});

// 图标框聚焦时记录正在编辑的行
document.getElementById("linkList").addEventListener("focusin", (e) => {
  const input = e.target.closest("input.icon-input");
  if (input) editingId = parseInt(input.dataset.idx);
});

// 输入实时写入 links
document.getElementById("linkList").addEventListener("input", (e) => {
  const input = e.target.closest("input[data-idx]");
  if (!input) return;
  const idx = parseInt(input.dataset.idx);
  const field = input.dataset.field;
  if (links[idx]) links[idx][field] = input.value;
});

load();
