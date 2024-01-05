# Jocker 即刻抽屉

即刻抽屉是一个可以按主题查看和备份自己即刻动态的工具，让你换一种方式来回顾自己的动态。

点击下图可查看完整演示视频：

[![jocker-example](https://user-images.githubusercontent.com/12845017/114270252-e7593d80-9a3d-11eb-8de0-fb5ac831e78a.gif)](https://youtu.be/k5599uMLi0E)



## 安装
Jocker 是一款 Chrome 插件，基于 Manifest V3 标准进行开发，请使用 Chromium 内核的浏览器，并更新到最新版本。

你可以使用下面两种方式安装此插件。

### chrome 网上应用店

如果你可以访问 chrome 网上应用店，请到地址 [https://chrome.google.com/webstore/detail/pnglcgpgmedjmknpknjedmkggedgdlpk](https://chrome.google.com/webstore/detail/pnglcgpgmedjmknpknjedmkggedgdlpk) 安装。

如果你无法访问，可以选择下载安装包安装。

### crx 安装包
1. 打开地址 [https://github.com/soyaine/jocker-chrome-extension/releases/latest](https://github.com/soyaine/jocker-chrome-extension/releases/latest) ，点击 `Assets` 展开列表后可以看到一个后缀为 .crx 的文件，点击它下载，浏览器可能会询问是否继续，点击 `继续`。
1. 在浏览器地址栏输入 `chrome://extensions` 打开扩展程序管理页面。
2. 点击打开该页面右上角的 `开发者模式`。
3. 将下载的 crx 文件拖动到这个页面，页面弹出确认框问，要添加“Jocker Extension”吗？点击 `添加扩展程序`。
4. 添加成功后，页面中会出现一个 Jocker Extension 卡片，请确认卡片右下角的开关为打开状态。

## 使用说明
1. 安装成功后，打开即刻网页版的个人页面 https://web.okjike.com/me ，如果你没有登录，请登录后再打开这个页面，请注意需要打开的是个人页面，而不是首页。
2. 等待片刻后，页面右下角会出现即刻抽屉的图标，点击它，就可以打开即刻抽屉页面了。
3. 点击 `开始整理`，等待拉取动态数据。由于此工具没有把你的动态数据存到本地，所以每次重新打开即刻抽屉页面，都需要重新取一次数据。

在即刻抽屉页面，你可以做的事情：
- 点击左侧的主题名字，可以查看每个主题下的对应动态。
- 点击右上角的按钮，可以切换当前的查看模式，当切换到图片模式的时候，左侧的主题排序和数量会基于图片的数量进行重新排序。
- 在图文模式下，点击右下角的下载按钮，可以下载当前主题下的动态数据，下载后，csv文件可以导入Notion或者用Excel、文本编辑器查看。

## 更新日志
#### v3.1.2
2024.01.05 支持的功能
- 可以查看导出收藏的动态了，并且可以按作者分类查看
- 按年份查看动态
- 动态中包含 #标签 的情况，也可以按标签查看了

#### v3.0.0
2021.03.21 支持的功能：
- 按主题查看自己的动态
- 按主题导出自己的文字动态，以csv文件格式
- 按主题查看自己发过的图片
- 查看自己往年今日的动态

## 其他
- 如果有什么问题或建议，可以到[Telegram讨论组](https://t.me/joinchat/eV5l2_DxlHI0NWNl)反馈
- 如果喜欢这个工具，欢迎[赞助开发者](http://afdian.net/@soyaine)
