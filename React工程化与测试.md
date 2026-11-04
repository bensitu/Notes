# React 工程化与测试

学习目标：把 React 组件组织成可运行、可检查、可发布的项目。示例使用 Node 24、Vite 8、React 19、React Router 8、TypeScript 5.9.3；精确依赖以锁文件为准。

[文档目录](README.md) · [示例说明](examples/react-taskboard/README.md)

**内容导航**

- [工程文件地图](#section-1)
- [安装、开发与构建](#section-2)
- [路由与数据边界](#section-3)
- [组件测试](#section-4)
- [真实接口与浏览器测试](#section-5)
- [发布、失败与速查](#section-6)
- [官方参考](#section-7)


<a id="section-1"></a>

## 工程文件地图

| 文件 | 职责 |
| --- | --- |
| src/main.tsx | 根节点、StrictMode 与浏览器路由 |
| src/TaskPage.tsx | 页面状态、认证与任务操作 |
| src/TaskForm.tsx | 受控输入和提交反馈 |
| src/tasks.ts | 请求、DTO 及运行时响应检查 |
| src/api.ts | 会话 Cookie、CSRF 与 HTTP 错误 |
| vite.config.ts | 插件、开发代理和 Vitest |
| src/*.test.tsx / e2e | 组件行为测试 / 真实浏览器流程 |

React 官方也提供框架路线。本例选择 Vite 演示 CSR 与独立 Java API；需要服务端渲染时使用 Next.js 等框架的相应项目，不把 Vite 目录当成完整 SSR 服务。

<a id="section-2"></a>

## 安装、开发与构建

先从仓库根目录运行后端，再另开终端：

```powershell
Set-Location examples/react-taskboard
npm ci
npm test
npm run build
npm run dev
```

打开 <http://127.0.0.1:5174>。npm ci 使用已提交的 package-lock；有意修改依赖才执行安装更新并审查锁文件。开发服务器成功启动不代表完整类型检查通过。

构建结果在 dist。Vite 的 /api 开发代理不会随 dist 自动部署，生产需要服务器把该路径转发到受保护的 Java API。

<a id="section-3"></a>

## 路由与数据边界

示例从 react-router 导入 BrowserRouter、Routes、Route 和 NavLink，使用其声明式模式。路由库的 Framework / Data / Declarative 模式不同，不能把不同模式的配置随意拼接。

浏览器 History 路由需要服务器对页面路径返回 SPA 入口；API、缺失静态资源和真正的错误应分别处理。客户端显示“页面不存在”不保证初次 HTTP 响应就是 404。

本例用 React state 保存最新任务列表，不引入额外全局库。响应先作为 unknown 检查；TypeScript 的泛型断言不能验证外部 JSON。

<a id="section-4"></a>

## 组件测试

```powershell
npm test
```

测试验证失败提交保留输入、成功提交才清空、503 后显示错误并恢复登录按钮。使用 label 与 role 定位元素，不依赖私有方法或偶然的 DOM 层级。

组件测试使用 jsdom，不证明浏览器布局、Cookie、代理或 CSRF 流程已经正确。网络模拟要在用例后恢复，避免污染其他测试。

<a id="section-5"></a>

## 真实接口与浏览器测试

后端需要仍在本机 8080 运行。使用与后端一致的密码：

```powershell
Set-Location examples/react-taskboard
npx playwright install chromium
$env:APP_PASSWORD = 'local-demo-change-me'
npm run test:e2e
```

流程使用真实 Java API 完成登录、创建、完成、退出和路由导航，不把服务器改成假成功。测试库与账号需要独立于生产；创建的测试记录不应写入真实用户环境。

<a id="section-6"></a>

## 发布、失败与速查

| 问题 | 检查 |
| --- | --- |
| TSX 报错 | 文件扩展名、jsx 配置、React 类型版本 |
| 构建成功但请求失败 | 生产 /api 代理和目标服务 |
| 登录后写入 403 | Cookie 与登录后重新取得的 CSRF Token |
| 页面刷新 404 | History 路由的服务端回退 |
| 列表为空却没错误 | 是否把失败吞成空数组 |
| 新增超时后再次提交重复 | 服务端是否已完成操作，是否需要幂等键 |

VITE_ 环境变量会进入浏览器代码，不能保存服务器秘密。React 转义普通文本，但不代替后端权限校验；不对不可信内容随意使用 dangerouslySetInnerHTML。


<a id="section-7"></a>

## 官方参考

- [React 工程选择](https://react.dev/learn/creating-a-react-app)
- [Vite](https://vite.dev/guide/)
- [React Router 模式](https://reactrouter.com/start/modes)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
