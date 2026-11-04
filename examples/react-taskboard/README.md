# React 任务管理示例

这是浏览器端渲染的 React SPA，复用 ../taskboard/backend 的 Java API；没有增加另一套数据库或绕过 Session / CSRF。

## 版本与目录

Node 24、React 19.3.1、React Router 8.5.1、Vite 8、TypeScript 5.9.3。精确版本和依赖树见 package.json 与 package-lock.json。

TaskPage 管理页面状态，TaskForm 保留输入，tasks.ts 检查接口数据，api.ts 维护本浏览器的 CSRF 信息。这个 api.ts 只用于浏览器，不能直接作为 SSR 多用户服务的全局会话管理器。

## 运行

终端一从仓库根目录执行：

```powershell
Set-Location examples/taskboard/backend
$env:APP_PASSWORD = 'local-demo-change-me'
mvn spring-boot:run
```

终端二也从仓库根目录执行：

```powershell
Set-Location examples/react-taskboard
npm ci
npm run dev
```

打开 <http://127.0.0.1:5174>，用 admin 与上面的密码登录。前端开发代理 /api 到本机 8080，页面仅显示最新 100 条任务。

## 检查

```powershell
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

浏览器测试依赖正在运行的真实后端，APP_PASSWORD 与后端一致。测试自行启动 5174 的前端服务。生产部署需要 SPA 回退与实际 API 代理，不能只复制开发代理配置。

## 文档与验证范围

- [React 基础](../../React基础与组件.md)
- [Hooks 与状态](../../ReactHooks与状态管理.md)
- [工程化与测试](../../React工程化与测试.md)

本机已通过 TypeScript 检查、Vite 生产构建、3 项组件测试和 1 个真实 Java API 浏览器流程（登录、创建、完成、退出、路由导航）。外部部署、生产账号和跨用户数据隔离不属于本演示能力。
