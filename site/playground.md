# Playground：在浏览器里边改边看

Playground 是站内的交互练习页。打开网站后，点击顶部导航或左侧导航中的 Playground；HTML/CSS/JavaScript、React、Vue 和 SSR 相关文章开头也有入口。首页的 Playground 链接始终保留，文章数量和原有文章地址不受影响。

## 第一次使用

本地需要 Node.js 24。在仓库根目录执行：

```powershell
npm ci --ignore-scripts
npm run build:site
npm run serve:site
```

打开 <http://127.0.0.1:4173/Notes/#/playground>。这只是你自己电脑上的预览地址；部署后使用网站自己的域名和路径，不需要访问读者电脑的 3001 或 3002 端口。原文中的这些地址仍保留，它们用于运行完整的本地项目。

1. 在“选择示例”中选一个练习，页面会先运行原始示例。
2. 点击文件名切换编辑内容，例如 HTML 示例的 index.html、style.css 和 script.js。修改后点击“运行”，或在编辑器中按 Ctrl+Enter；macOS 使用 ⌘+Enter。
3. 在右侧预览中点击按钮，观察页面变化。手机上编辑器和预览按上下顺序排列。
4. 使用 `console.log()` 查看变量；语法错误和运行错误显示在控制台。报错时先看文件名和错误提示，改好后再运行。
5. “重置示例”恢复当前示例的全部文件；“停止”移除当前预览。运行或重置都会重新建立页面，计数器等状态也从头开始。

切换示例会保留本次页面会话中的代码草稿。中文、英文和日文分别保存草稿：首次切换到某种语言时显示该语言的初始示例，切回时恢复对应草稿。刷新页面后恢复原始示例；代码不上传服务器，也不写入浏览器长期存储。需要保留自己的练习时，请复制到本地文件。网址中的 `?demo=react-counter` 等参数只指定示例，不包含修改后的代码。

## 每种示例能练什么

| 示例 | 可以练习 | 使用范围 |
| --- | --- | --- |
| HTML / CSS / JavaScript | 页面结构、样式、DOM 查询、事件处理 | HTML 编辑区域填写正文片段，CSS 和 JavaScript 分别写在对应文件中；不要在 HTML 中嵌入 script 或 onclick |
| React | JSX、组件、useState 与事件 | 已提供全局 React、ReactDOM；使用普通 JavaScript 和 JSX，不支持 import、TypeScript 或安装其他 npm 包 |
| Vue | createApp、ref、computed、模板绑定 | 已提供全局 Vue；直接写浏览器应用代码，不编译 .vue 单文件组件，不支持 import |
| CSR / SSR / 水合 | 初始 HTML、正文显示、事件绑定与水合的先后关系 | 固定流程的浏览器模拟，不执行服务器端渲染 |

React 与 Vue 使用真实的框架运行库。React 示例用 Babel 在预览内部把 JSX 转成浏览器能执行的 JavaScript；Vue 使用包含模板编译器的浏览器版本。运行库随站点一起发布，普通文章不会提前加载这些较大的脚本，示例也不依赖外部 CDN。

预览放在带 sandbox 的 iframe 中，相当于给练习页面一个单独的小窗口。它允许执行脚本，但不能读取主站页面或共享主站的存储；网络 API 请求、表单提交和弹窗等功能受到限制。请用它练习页面和组件交互；调用后端接口、登录和完整构建流程应在配套本地工程中完成。预览固定使用浅色背景，便于观察原始页面样式；外层编辑器随主站主题变化。

“停止”通过移除 iframe 结束正常执行的定时器和页面。无限循环或非常重的同步计算仍可能卡住浏览器标签页，此时需要关闭该标签页；本练习页不是远程代码执行服务。

## SSR 对比应该怎么看

点“下一步”依次推进流程。步骤只表达先后关系，不表示耗时长短，也不能作为性能测试。

1. 等待响应：两侧都还没有页面内容。
2. 收到初始 HTML：CSR 一侧只有空容器；SSR 一侧已有可读正文，但计数器尚未绑定点击事件。
3. 浏览器 JavaScript 就绪：CSR 生成组件并可以交互；SSR 一侧单独留出水合阶段，让你观察“已有正文”和“已有交互”的区别。
4. SSR 水合完成：框架接管已有 DOM，连接组件状态与事件处理，SSR 计数器也能交互。

勾选“模拟禁用 JavaScript”后，流程重新开始，并停在初始 HTML 阶段。SSR 正文仍可显示；本例的计数按钮依赖脚本，因此无法交互。普通链接和 HTML 表单能否继续使用，取决于真实页面怎样实现。

真实框架可能采用流式渲染、选择性水合等方式，阶段会重叠。本演示没有启动 Node 服务，也没有执行 Next.js 或 Nuxt。要验证真实服务器响应、请求隔离、缓存和水合错误，请运行 [SSR 本地示例与验证](../examples/ssr/README.md)，并阅读 [SSR 与水合原理](../SSR与水合原理.md)。

## 维护入口

- `site/playground/samples.mjs` 保存初始代码、说明和配套文章映射。新增示例时使用稳定的 ASCII id，避免改动别人保存的网址。
- `site/playground/host.mjs` 管理编辑器、草稿、预览生命周期、控制台和 SSR 模拟；`runner.js` 只在预览内部执行代码。
- `scripts/build-playground.mjs` 打包运行库，复制许可证并生成示例数据。直接依赖固定版本，完整依赖见根 package-lock.json。
- 生成的中文、英文、日文入口共用相同的教学逻辑。操作按钮、文件分组的无障碍名称、示例说明、预览中的初始文字、加载错误和 SSR 模拟的步骤与解释随语言切换。代码中的变量名与框架 API 保持一致；用户自己编辑的代码不会自动翻译。配套阅读使用对应语言的文章标题与地址，缺少译文时明确标注中文原文。
- `tests/site/playground.spec.mjs` 验证编辑、运行、重置、框架交互、错误反馈、预览隔离、SSR 流程、320px 布局与语言路由。运行 `npm run build:site`、`npm run validate:site` 和 `npm run test:site:browser` 验证。

参考：[React createRoot](https://react.dev/reference/react-dom/client/createRoot)、[Vue 浏览器入门](https://vuejs.org/guide/quick-start.html)、[Babel Standalone](https://babeljs.io/docs/babel-standalone)、[iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)。
