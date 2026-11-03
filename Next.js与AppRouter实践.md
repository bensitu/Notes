# Next.js 与 App Router 实践

学习目标：理解路由、服务端组件、客户端边界、数据和部署之间的关系。先阅读 React 与 SSR 文档。示例固定 Next 16.4.4、React 19.3.1、Node 24、TypeScript 5.9.3。

[文档目录](README.md) · [SSR 示例说明](examples/ssr/README.md)

**内容导航**

- [先看目录约定](#section-1)
- [最小运行步骤](#section-2)
- [服务端与客户端边界](#section-3)
- [参数、数据与状态](#section-4)
- [缓存、更新与服务端写操作](#section-5)
- [验证、错误与开发速查](#section-6)
- [官方参考](#section-7)


<a id="section-1"></a>

## 先看目录约定

| 文件 | 用途 |
| --- | --- |
| app/layout.tsx | 根布局、语言与公共元信息 |
| app/page.tsx | 请求时渲染的首页 |
| app/Counter.tsx | 带 use client 的交互组件 |
| app/articles/[slug]/page.tsx | 动态参数文章路由 |
| app/static/page.tsx | 可构建时生成的公共页面 |
| app/not-found.tsx / error.tsx | 不存在与渲染错误界面 |
| app/api/health/route.ts | HTTP Route Handler |
| lib/articles.ts | 仅服务端使用的公共只读数据 |

这是 App Router 项目，不混用 Pages Router 的 getServerSideProps / getStaticProps。两套路由可以有迁移场景，但文件约定和数据 API 不相同。

<a id="section-2"></a>

## 最小运行步骤

从仓库根目录开始：

```powershell
Set-Location examples/next-ssr
npm ci
npm run build
npm start
```

访问 http://127.0.0.1:3001。生产构建会报告动态首页和可预渲染的 /static。需要开发热更新时另用 npm run dev，不能同时占用同一端口。

项目只有公共只读文章和浏览器计数器，没有登录、写数据库或接入 Java 任务 API。

<a id="section-3"></a>

## 服务端与客户端边界

页面与布局默认是服务器组件。交互组件的文件开头使用 use client：

```tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(value => value + 1)}>次数：{count}</button>;
}
```

这是独立组件示例。完整版本还标记水合就绪状态供测试使用。

use client 是模块依赖边界，不是“该组件首次一定只在浏览器运行”。首次请求仍可能生成它的 HTML，之后由浏览器水合。服务端秘密不能通过 props、HTML 或 RSC payload 传给客户端。

<a id="section-4"></a>

## 参数、数据与状态

本版本动态 params 是 Promise，示例通过 await params 取得 slug；不要复制另一个版本把 params 当同步对象的写法。请求相关的 cookies、headers 等也需要按目标版本的异步接口使用。

首页通过稳定的 connection() 等待实际请求，再生成时间。它不是业务授权检查，也不是所有页面都必须使用的函数。

lib/articles.ts 用 server-only 表达服务端导入限制，内容是不可变公共样例。Server Component 可以直接调用服务端数据函数，不必绕回自己的 Route Handler 做一次 HTTP 请求。

<a id="section-5"></a>

## 缓存、更新与服务端写操作

本示例是手工创建的配置，没有开启 Cache Components 或 Partial Prefetching。不要把当前脚手架的默认配置、旧教程的 fetch 缓存默认值与本示例混为一谈。

需要缓存时明确：缓存数据还是页面、键包含哪些输入、有效期和更新如何发生。公共文章可以缓存，个人会话和权限相关数据不能直接进入共享缓存。

Server Actions / Server Functions 是可由客户端触发的服务端入口，不等于只会被你的按钮调用。新增写操作时仍要认证、授权、验证输入、限制资源消耗并处理失败。use server 不是权限声明。

<a id="section-6"></a>

## 验证、错误与开发速查

[SSR 测试](examples/ssr/tests/rendering.spec.ts)在生产模式验证首页 HTML、交互、导航、独立会话和未知文章。error.tsx 是渲染错误边界，不保证自动捕获所有事件处理、后台任务或网络错误。

| 现象 | 检查 |
| --- | --- |
| Hook 无法在页面使用 | 是否需要小范围客户端边界 |
| 构建时意外访问用户数据 | 静态 / 动态选择与请求 API |
| 服务端 fetch 没有登录身份 | 是否正确取得并受控转发当前请求凭证 |
| 改数据后仍旧 | 数据缓存、页面缓存、客户端导航缓存与失效策略 |
| 上传 dist 到 Nginx 后不能 SSR | Next 的运行产物与 Node 服务，不是 Vite 静态目录 |

已开始流式发送响应后，不能假定所有异常都还能改成新的 HTTP 状态。错误测试要观察真实响应和界面；生产还需验证代理、缓存和部署平台行为。


<a id="section-7"></a>

## 官方参考

- [Next App Router](https://nextjs.org/docs/app)
- [组件边界](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [connection](https://nextjs.org/docs/app/api-reference/functions/connection)
- [缓存模型](https://nextjs.org/docs/app/getting-started/caching)
- [部署](https://nextjs.org/docs/app/getting-started/deploying)
