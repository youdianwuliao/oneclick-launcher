# 一键直达 Launcher (OneClick Launcher)

Chrome / Edge 浏览器扩展：**点一下工具栏图标，直接打开你设置的链接**。支持自定义多个链接和 Emoji 图标。

## 功能

- 🖱️ **单击图标** → 打开默认链接（可在设置页指定）
- 📚 **多个链接** → 右键图标弹出菜单，任选打开
- 😀 **Emoji 图标** → 每个链接可配任意 Emoji
- ⚙️ **可视化设置页** → 增删链接、改名称/URL/图标、上下排序、设默认

## 安装（开发者模式）

1. 下载本仓库 ZIP 并解压（或 `git clone`）
2. 打开浏览器：Chrome 访问 `chrome://extensions`，Edge 访问 `edge://extensions`
3. 右上角开启 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择解压后的 `oneclick-launcher` 文件夹
5. 点击工具栏图标即可打开默认链接；右键图标可切换链接或进入设置

## 设置方法

右键扩展图标 → **⚙️ 设置链接和图标** → 打开设置页：

- 修改/添加链接（名称、URL、Emoji 图标）
- 点击「设默认」指定单击图标打开的链接
- 点击「保存设置」生效

## 发布到 Edge 应用商店

1. 将 `oneclick-launcher` 文件夹打包为 ZIP（`manifest.json` 必须在 ZIP 根目录）
2. 注册 [Microsoft Edge 开发者中心](https://partner.microsoft.com/dashboard/microsoftedge/)（需要微软账号，一次性注册费约 19 美元）
3. 创建新提交 → 上传 ZIP → 填写商店信息（名称、描述、截图、隐私政策等）
4. 提交审核，通常 3-7 天通过

## 默认链接

| 名称 | URL | 图标 |
|------|-----|------|
| DeepSeek Harness | http://127.0.0.1:3080/ | 🤖 |
| 公众号后台 | https://mp.weixin.qq.com/ | 📝 |
| 飞书 | https://www.feishu.cn/ | 💼 |

> 注意：`127.0.0.1` 是本机地址，其他人安装后无法访问你的本机服务。如需分享给别人，请改用局域网 IP 或公网地址。

## 文件结构

```
oneclick-launcher/
├── manifest.json    # MV3 清单
├── background.js    # 单击打开 + 右键菜单逻辑
├── options.html     # 可视化设置页
└── icons/           # 扩展图标 (16/32/48/128)
```

## License

MIT
