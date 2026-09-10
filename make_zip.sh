# 一键直达 Launcher - 扩展文件
# 说明：本 zip 直接用于 Edge 应用商店上传（manifest.json 在根目录）
cd /home/admin/.openclaw/workspace/oneclick-launcher && rm -f oneclick-launcher.zip && zip -r oneclick-launcher.zip manifest.json background.js options.html icons/ -x "*.DS_Store" && echo "--- ZIP 内容 ---" && unzip -l oneclick-launcher.zip