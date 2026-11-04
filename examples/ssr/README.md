# SSR 示例与生产模式验证

两个独立项目提供相同的公共文章，便于观察服务器 HTML 和浏览器水合。它们不访问 taskboard 的 Java 服务，也没有真实登录或数据库。

## 固定版本

| 项目 | 版本 | 端口 |
| --- | --- | --- |
| ../next-ssr | Next 16.4.4、React 19.3.1、TypeScript 5.9.3、Node 24 | 3001 |
| ../nuxt-ssr | Nuxt 4.6.4、Vue 3.5.44、TypeScript 5.9.3、Node 24 | 3002 |
| 本目录 | Playwright 1.64.1，生产模式验证 | 启动以上两个服务 |

精确依赖见各自的 package-lock.json。公开文章是只读常量；Node 进程没有保存用户可变数据。

## 构建 Next

终端从仓库根目录开始：

```powershell
Set-Location examples/next-ssr
npm ci
npm run build
npm start
```

访问 <http://127.0.0.1:3001>。首页按请求渲染，/static 预渲染；构建日志会显示对应策略。演示没有开启 Cache Components，不能套用不同配置下的默认缓存结论。

## 构建 Nuxt

另一个终端从仓库根目录开始：

```powershell
Set-Location examples/nuxt-ssr
npm ci
npm run typecheck
npm run build
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = '3002'
npm start
```

访问 <http://127.0.0.1:3002>。Nuxt 的 useFetch 与 useState 传递服务端初始结果，Counter 在挂载后标记水合完成。

## 自动验证

先停止前面手动启动的 3001 / 3002 服务，测试会自行启动生产服务，不复用未知服务。两个项目都已构建后：

```powershell
Set-Location examples/ssr
npm ci
npx playwright install chromium
npm test
```

已在本机 Node 24 与 Chromium 下通过六项测试：

- Next / Nuxt 初始 HTML 有正文、文章链接和时间；禁用 JavaScript 仍可见。
- 启用脚本后，水合标记完成，计数器可以从 0 增加到 1。
- 页面导航正常，没有测试捕获到的水合错误。
- 独立浏览器的计数器初始值仍为 0。
- 未知文章返回 HTTP 404。

Next 已通过完整构建与类型检查；Nuxt 已通过类型检查与完整构建。真实反向代理、CDN、部署平台与用户认证未在这个公共数据样例中验证。

## 文档

- [SSR 与水合原理](../../SSR与水合原理.md)
- [Next.js 与 App Router](../../Next.js与AppRouter实践.md)
- [Nuxt 全栈与 SSR](../../Nuxt全栈与SSR实践.md)
- [SSR 部署与缓存安全](../../SSR部署与缓存安全.md)

测试脚本只启动本机服务。next start 与 Nuxt Node 输出都需要运行时，不能当作普通 Vite dist 复制到静态服务器就保留动态能力。
