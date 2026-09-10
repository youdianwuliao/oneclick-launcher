// ============ 一键直达 Launcher ============
// 点一下图标 → 打开默认链接
// 右键图标 → 菜单列出所有链接 + 设置

const DEFAULT_LINKS = [
  { id: "ds", name: "DeepSeek Harness", url: "http://127.0.0.1:3080/", icon: "🤖" },
  { id: "gzh", name: "公众号后台", url: "https://mp.weixin.qq.com/", icon: "📝" },
  { id: "feishu", name: "飞书", url: "https://www.feishu.cn/", icon: "💼" }
];

const DEFAULT_SETTINGS = { defaultLinkId: "ds" };

// ---------- 工具函数 ----------
async function getLinks() {
  const data = await chrome.storage.local.get("links");
  return data.links || DEFAULT_LINKS;
}

async function getSettings() {
  const data = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
}

async function openUrl(url) {
  const tabs = await chrome.tabs.query({});
  const existing = tabs.find(t => t.url && t.url.startsWith(url.replace(/\/$/, "")));
  if (existing) {
    await chrome.tabs.update(existing.id, { active: true });
    await chrome.windows.update(existing.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url });
  }
}

// ---------- 单击图标：打开默认链接 ----------
chrome.action.onClicked.addListener(async () => {
  const [links, settings] = await Promise.all([getLinks(), getSettings()]);
  const link = links.find(l => l.id === settings.defaultLinkId) || links[0];
  if (link) openUrl(link.url);
});

// ---------- 右键菜单 ----------
function buildContextMenu(links) {
  chrome.contextMenus.removeAll(() => {
    links.forEach(link => {
      chrome.contextMenus.create({
        id: "open_" + link.id,
        title: `${link.icon} ${link.name}`,
        contexts: ["action"]
      });
    });
    chrome.contextMenus.create({
      id: "sep",
      type: "separator",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "options",
      title: "⚙️ 设置链接和图标",
      contexts: ["action"]
    });
  });
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "options") {
    chrome.runtime.openOptionsPage();
  } else if (typeof info.menuItemId === "string" && info.menuItemId.startsWith("open_")) {
    const id = info.menuItemId.slice(5);
    getLinks().then(links => {
      const link = links.find(l => l.id === id);
      if (link) openUrl(link.url);
    });
  }
});

// 初始化菜单
chrome.runtime.onInstalled.addListener(async () => {
  const links = await getLinks();
  buildContextMenu(links);
});

// 存储变化时刷新菜单
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.links) {
    buildContextMenu(changes.links.newValue);
  }
});
