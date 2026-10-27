# DSH Style Ultra

为 DeepSeek Harness Desktop 与 Web 添加“外观”设置页。提供系统 / 浅色 / 深色模式、主题配色、自定义颜色、界面与代码字体、字号、背景图片、模糊、遮罩、侧边栏透明度、减少动态效果，以及 macOS Desktop 的可选 Liquid Glass 风格。改变设置后立即生效；重置会移除背景图片并恢复默认设置。

## 安装

使用 DeepSeek Harness CLI 安装 GitHub 版本：

```sh
dsh plugin --profile desktop add github:MrCashmere/dsh-style-ultra
dsh plugin --profile web add github:MrCashmere/dsh-style-ultra
```

也可以安装本地目录，将以下路径替换为你的插件目录：

```sh
dsh plugin --profile desktop add /path/to/dsh-style-ultra
dsh plugin --profile web add /path/to/dsh-style-ultra
```

安装后重启相应的 Desktop 或 Web 服务，在设置中选择“外观”。卸载时使用 `dsh plugin --profile desktop remove dsh-style-ultra` 或 `dsh plugin --profile web remove dsh-style-ultra`。

## 系统字体

在“外观”中点击“读取系统字体”，按浏览器提示授权后，界面字体和代码字体的下拉菜单会列出当前设备已安装的字体家族；输入框也可搜索或手动填写字体家族名称，再点击“应用”。字体选择会保存在当前客户端，字体列表不会上传。界面字体和代码字体共用本次客户端运行中读取的列表；重新启动客户端后可再次读取，已选字体会保留。

Web 端读取的是访问页面的设备的字体，而不是服务器的字体。自动读取需要支持 Local Font Access API 的浏览器和安全上下文（HTTPS 或 localhost），并受本地字体权限限制；如果接口不可用或权限被拒绝，仍可手动输入字体家族名称。Desktop 使用相同的客户端接口，具体可用性取决于应用内的浏览器和权限设置。

在 macOS Desktop 的外观设置最底部可选择 Liquid Glass 的“跟随系统”或“超透亮”档位，作用于新建会话按钮、输入框和账号菜单。该效果使用网页的半透明与背景模糊模拟，并非系统原生 Liquid Glass；开启系统的减少透明度时会使用不透明背景。

## 存储和兼容性

模式和内容字号使用 DSH 原生主题设置；其余设置保存在当前浏览器 / Desktop WebView 的 localStorage，图片保存在该客户端的 IndexedDB，不上传到服务器。因此不同浏览器、来源和 Desktop 的设置不会自动同步。清除站点数据会删除它们。支持 PNG、JPEG、GIF、WebP、AVIF、BMP，最大 20 MB。背景通过透明主题底色和独立模糊图片层实现；应用中有不透明背景的卡片和弹窗仍保持可读。主题与字体取决于本机字体和 DSH 主题令牌；使用自定义前景和背景时请自行保证对比度。

需要支持 `theme.overrideTokens` 和设置 section slot 的 DeepSeek Harness 版本（针对本机安装的 0.2.1 系列接口编写）。

## 验证

```sh
npm test
```
