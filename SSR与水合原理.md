# SSR 与水合原理

学习目标：区分 HTML 在何时生成、JavaScript 在哪里执行，以及页面如何获得交互。需要 HTML、HTTP、React 或 Vue 基础。示例使用 Next 16 与 Nuxt 4 的生产构建。

[文档目录](README.md) · [SSR 示例说明](examples/ssr/README.md)

**内容导航**

- [四种概念不要混在一起](#section-1)
- [用两个可运行项目观察](#section-2)
- [水合要求的“一致”是什么](#section-3)
- [不匹配的常见来源](#section-4)
- [性能、SEO 与流式输出](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)


<a id="section-1"></a>

## 四种概念不要混在一起

| 概念 | 初始内容怎样产生 | 运行条件 |
| --- | --- | --- |
| CSR | 业务界面主要在浏览器执行 JavaScript 后产生 | 静态资源服务与数据 API |
| SSR | 服务器处理请求时生成初始 HTML，可与缓存配合 | 相应服务器运行环境 |
| SSG / 预渲染 | 构建时为已知页面生成 HTML | 部署生成的静态内容 |
| 水合 Hydration | 浏览器用相符的数据和组件接管服务器 HTML | 需要客户端脚本和一致的初始结果 |

SPA 描述导航和应用组织方式，SSR 描述生成 HTML 的方式；它们不是绝对互斥。SSR 框架后续可以使用客户端路由导航，同一站点也能按页面混合策略。

React Server Components 描述服务端组件及其协议边界，不等于 SSR：服务器组件可以参与构建时或请求时渲染。客户端组件也可能参与首次 HTML 的预渲染。

<a id="section-2"></a>

## 用两个可运行项目观察

Next 示例在 examples/next-ssr，Nuxt 示例在 examples/nuxt-ssr。完整命令与验证见 [SSR 示例说明](examples/ssr/README.md)。

先构建并启动一个项目，再用 curl.exe 读取首页原始响应。正常应已包含文章链接和标题；即使浏览器禁用 JavaScript，仍能看到这些内容。

启用 JavaScript 后等待 data-hydrated=true，再点击计数器，数字由 0 变成 1。服务器返回 HTML 和页面可以交互是两个分别验证的结果。

<a id="section-3"></a>

## 水合要求的“一致”是什么

服务器和浏览器首次渲染应产生兼容的结构、文本和属性。不要在两边首次渲染各自直接调用随机数、当前时间或依赖不同时区的格式化。

Next 把服务器计算出的时间作为服务器生成的内容传下去；交互计数器初始值固定为 0。Nuxt 使用 useState 保存服务器初始值，通过 payload 让客户端沿用。

window、document、localStorage 只存在于相应浏览器环境。把读取放到客户端挂载阶段或明确的客户端组件边界；不要在模块导入时就访问它们。

<a id="section-4"></a>

## 不匹配的常见来源

| 来源 | 例子 | 修正方向 |
| --- | --- | --- |
| 数据不同 | 两边各取一次不同结果 | 使用框架的数据传递与初始 payload |
| 时间与地区 | 服务器 UTC、浏览器本地时区 | 统一初始输出，挂载后再显示本地格式 |
| HTML 不合法 | 不允许的标签嵌套被浏览器重排 | 修正结构 |
| 浏览器状态 | 首次渲染直接读 localStorage | 提供确定初始界面，挂载后读取 |
| 外部修改 | 扩展或第三方脚本修改 DOM | 最小环境复现并定位修改来源 |

不要把 suppressHydrationWarning、ClientOnly 或关闭 SSR 当成修复所有问题的默认手段。只有内容确实只能在浏览器产生时，才设计相应占位和加载行为。

<a id="section-5"></a>

## 性能、SEO 与流式输出

SSR 可能更早显示内容，但也增加服务器工作和等待上游数据的成本。水合仍需下载、解析和执行脚本；SSR 不保证所有指标都更好。

SSG 与缓存适合变化较少的公共内容；用户私有内容先保证隔离。流式渲染可分段发送内容，但代理缓冲、错误状态与监控也要配合。

有 HTML 不等于自动完成 SEO。还需要标题、元信息、可访问链接、正确状态、规范 URL 和适当的站点内容策略。

<a id="section-6"></a>

## 验证与开发速查

1. 生产构建后启动，不只检查 dev。
2. 检查原始 HTML，而不是仅看已经执行脚本的 Elements 面板。
3. 禁用浏览器 JavaScript，确认预期内容仍存在。
4. 启用脚本，检查水合日志和交互。
5. 用独立浏览器会话确认用户状态不串。
6. 检查不存在页面和上游失败的状态。

[生产模式测试](examples/ssr/tests/rendering.spec.ts)覆盖两个框架的无脚本内容、水合交互、独立浏览器状态和未知文章。它不证明真实 CDN、身份系统或所有组件均已测试。


<a id="section-7"></a>

## 官方参考

- [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Next 服务端与客户端组件](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Nuxt 渲染模式](https://nuxt.com/docs/4.x/guide/concepts/rendering)
