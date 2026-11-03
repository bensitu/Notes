# Nuxt 全栈与 SSR 实践

学习目标：在 Vue 体系中理解页面路由、服务端 API、数据 payload 和水合。先掌握 Vue 3 与 SSR。示例固定 Nuxt 4.6.4、Vue 3.5.44、Node 24 和配套锁文件。

[文档目录](README.md) · [SSR 示例说明](examples/ssr/README.md)

**内容导航**

- [Nuxt 与普通 Vue 项目的关系](#section-1)
- [最小运行步骤](#section-2)
- [数据获取与 payload](#section-3)
- [SSR 友好的状态](#section-4)
- [环境、错误与认证](#section-5)
- [验证与速查](#section-6)
- [官方参考](#section-7)


<a id="section-1"></a>

## Nuxt 与普通 Vue 项目的关系

Vue 负责组件与响应式；Nuxt 在其上提供页面路由、服务端渲染、数据获取和服务端运行等约定。Nitro 承担相应服务器构建与运行。

本例使用 Nuxt 4 的 app 目录布局。不要把 Nuxt 2 的 asyncData、目录和插件写法直接当成当前项目配置。

| 目录 | 职责 |
| --- | --- |
| app/pages | 文件系统页面路由 |
| app/components | 可复用 Vue 组件 |
| app/app.vue | NuxtPage 与公共结构 |
| server/api | 受对应请求调用的服务端 API |
| server/utils | 本例服务端公共数据 |
| shared/types | 可共享的类型定义 |
| nuxt.config.ts | SSR、Nitro、页面头与路由规则 |

<a id="section-2"></a>

## 最小运行步骤

```powershell
Set-Location examples/nuxt-ssr
npm ci
npm run typecheck
npm run build
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = '3002'
npm start
```

从仓库根目录进入项目，访问 http://127.0.0.1:3002。这个 Node server 构建输出在 .output，不能只取 .output/public 就认为已保留动态 SSR。

开发时使用 npm run dev，端口同样是 3002；不要与生产服务同时占用。服务端 API 只提供公共只读文章，没有真实用户或数据库。

<a id="section-3"></a>

## 数据获取与 payload

页面使用 useFetch('/api/articles')，服务端结果随初始 payload 传递，客户端水合时可以沿用。直接在 setup 中用普通 $fetch 获取初始数据，可能产生不同的重复获取行为。

按场景选择 useFetch、useAsyncData 和事件中的 $fetch；不要为“函数看起来相似”就相互替换。共享 key 的数据还应保持选项与预期一致，防止相互覆盖。

本例的数据由自己的固定服务端数组产生。类型泛型不负责验证真实外部 API；接入外部服务时应检查响应状态和数据结构。

<a id="section-4"></a>

## SSR 友好的状态

示例将服务器时间保存为：

```typescript
const renderedAt = useState<string>('rendered-at', () => new Date().toISOString());
```

这是 Vue setup 上下文片段；useState 由 Nuxt 自动导入。客户端沿用服务器 payload，不在第一次水合重新取另一个时间。

Counter 使用带 key 的 useState，在同一应用中复用该状态，同时由 Nuxt 处理请求上下文。不要在服务端模块顶层放一个可变 ref，当作所有用户的状态。

传递值应符合框架的序列化边界。连接对象、函数或任意类实例不能直接当成可安全传给浏览器的数据；即使值可序列化，秘密仍然不能进入 payload。

<a id="section-5"></a>

## 环境、错误与认证

useSeoMeta 表达页面标题与描述；不存在文章通过服务端 404 和页面错误处理表现。页面路由 middleware 不能代替 server/api 中的认证与授权。

运行时私有配置与 runtimeConfig.public 分开；public 中的值会被浏览器取得，不能放数据库密码或服务密钥。

SSR 中服务器请求与浏览器请求的 Cookie 行为不同。Nuxt 的相对路径 useFetch 可以使用请求上下文转发；转发到外部上游时仍应确认目标、白名单和实际头部范围，不能把所有凭证发到任意 URL。

<a id="section-6"></a>

## 验证与速查

| 现象 | 检查 |
| --- | --- |
| 初始渲染报 window 不存在 | 是否在模块或 setup 中使用浏览器专属 API |
| 服务器与客户端内容不同 | useState / 数据 payload 与不确定值 |
| 浏览器收到秘密 | public 配置、页面 props、useState、响应内容 |
| 切换参数后还是旧文章 | 获取键与路由参数是否响应式 |
| 只部署静态目录后 API 404 | 是否误丢弃 Nitro 服务 |
| 路由校验通过但仍越权 | 服务端 API 是否真正检查身份与归属 |

运行生产测试，分别检查无 JavaScript 内容、水合与独立浏览器初始值。真实数据库、会话和 CDN 配置需要在扩展后单独验证。


<a id="section-7"></a>

## 官方参考

- [Nuxt 渲染模式](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [数据获取](https://nuxt.com/docs/4.x/getting-started/data-fetching)
- [状态管理](https://nuxt.com/docs/4.x/getting-started/state-management)
- [部署](https://nuxt.com/docs/4.x/getting-started/deployment)
