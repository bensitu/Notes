# Vue 3 工程化开发

学习目标：从单个组件走到可测试、可构建的项目。先读 HTML、JavaScript、异步请求与现有 Vue 3 笔记。

**适用范围：** 示例使用 Node 24、Vue 3、Vite 8、Router 5、Pinia 4；完整精确版本和依赖树见 package.json 与 package-lock.json。TypeScript 固定 5.9.3，以匹配已验证的 vue-tsc 工具链。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [项目由哪些部分组成](#section-1)
- [最小运行步骤](#section-2)
- [响应式与组件职责](#section-3)
- [状态、请求与并发](#section-4)
- [开发配置与生产配置](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 项目由哪些部分组成

| 文件 | 职责 |
| --- | --- |
| src/main.ts | 创建应用，注册路由和 Pinia |
| src/App.vue | 应用的公共布局 |
| src/TaskPage.vue | 页面交互与反馈 |
| src/tasks.ts | 任务状态、加载与修改操作 |
| src/api.ts | Cookie、CSRF、状态码和请求处理 |
| vite.config.ts | 开发代理、构建插件和测试环境 |

[完整项目](examples/taskboard/frontend/package.json)已经提交锁文件。现成项目运行 npm ci；有意更新依赖时才改版本、重新安装并审查锁文件。

<a id="section-2"></a>

## 最小运行步骤

先按[项目说明](examples/taskboard/README.md)启动后端，再在仓库根目录执行：

```powershell
Set-Location examples/taskboard/frontend
npm ci
npm run dev
```

打开终端显示的本机地址。使用 admin 与后端的 APP_PASSWORD 登录。新增任务后应看到列表更新，点击完成后状态改变。

```powershell
npm test
npm run build
```

build 同时执行 Vue 类型检查与生产构建。开发服务器启动成功不代表类型检查通过。

<a id="section-3"></a>

## 响应式与组件职责

ref 用于需要被跟踪的值；脚本中通常通过 .value 访问，模板中会自动解包适用的顶层 ref。computed 表达派生值；watch 用于变化后需要执行的副作用，不用来替代所有计算属性。

props 从父组件传入，子组件用事件提出修改请求。直接修改 props 或仅复制引用后编辑，会让状态来源变得混乱。

组合式函数适合封装可复用的状态行为，例如搜索请求的取消与加载状态。不要把整个页面堆进一个巨大的 useEverything 函数。

<a id="section-4"></a>

## 状态、请求与并发

Pinia 管理需要跨组件共享的任务列表；输入框文字与按钮忙碌状态留在页面。刷新浏览器后内存状态消失，不能当成数据库。

本例提交时禁用按钮，避免同一页面重复操作；服务端仍通过版本字段防止旧数据覆盖新数据。遇到 409 应重新加载并让用户确认，不能偷偷无限重试。

TypeScript 类型不验证外部 JSON。本例将响应作为 unknown，再逐项检查任务字段。解析失败时保留旧列表并显示错误，不把错误恢复成“成功的空数组”。

<a id="section-5"></a>

## 开发配置与生产配置

Vite 的 /api 代理只用于开发。生产镜像由 Nginx 提供页面并转发 API。以 VITE_ 暴露的环境变量会进入浏览器代码，不能放数据库密码或私钥。

路由、Pinia 和 UI 库要按当前 Vue 主版本配套。版本更新应一起验证依赖树、类型检查、测试和构建；仓库不把所有工具的最新标签自动拼成兼容组合。

<a id="section-6"></a>

## 验证与开发速查

| 现象 | 检查方向 |
| --- | --- |
| 浏览器请求 404 | 请求是否使用 /api，相应代理是否存在 |
| 401 | 是否登录，会话 Cookie 是否被保存 |
| 登录后 POST 403 | 是否重新取得了登录后的 CSRF Token |
| 刷新子路径返回 404 | 服务器是否配置 SPA 入口回退 |
| 构建报包导出路径错误 | 相关工具是否支持当前 TypeScript 主版本 |

使用稳定的任务 ID 作为 key。长列表需要分页或虚拟滚动时再引入相应设计，本例只显示最新 100 条，不假装实现了完整分页。

<a id="section-7"></a>

## 官方参考

- [Vue 快速开始](https://vuejs.org/guide/quick-start)
- [Vite 文档](https://vite.dev/guide/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
