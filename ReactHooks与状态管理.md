# React Hooks 与状态管理

学习目标：正确选择 state、Effect、ref、reducer 和 Context，理解闭包、依赖与请求清理。先阅读 React 基础；贯穿示例使用 React 19。

[文档目录](README.md) · [示例说明](examples/react-taskboard/README.md)

**内容导航**

- [Hook 的调用规则](#section-1)
- [常用工具速查](#section-2)
- [Effect 与事件分开](#section-3)
- [可运行示例中的请求清理](#section-4)
- [StrictMode 与重复执行](#section-5)
- [状态扩大之后怎样组织](#section-6)
- [验证与常见问题](#section-7)
- [官方参考](#section-8)


<a id="section-1"></a>

## Hook 的调用规则

一般 Hook 在函数组件或自定义 Hook 的顶层调用，保持每次渲染的调用顺序。不要在条件、循环、普通工具函数或事件处理函数里临时调用 useState / useEffect。

React 的 use API 有自己的规则，不能把它的例外套到所有 Hook。自定义 Hook 复用的是逻辑，不会自动让所有调用者共享同一份 state。

<a id="section-2"></a>

## 常用工具速查

| 工具 | 适合什么 | 不是什么 |
| --- | --- | --- |
| useState | 简单的本地状态 | 立即改变当前闭包变量的赋值 |
| useReducer | 多种动作共同更新一组状态 | 执行 HTTP 请求的位置 |
| useEffect | 与外部系统建立、更新或清理同步 | 所有计算和点击逻辑的默认容器 |
| useRef | 保存 DOM 引用或不驱动显示的可变值 | 页面更新通知 |
| Context | 在组件树中传递共同依赖 | 自动高性能的万能状态仓库 |
| useMemo / useCallback | 在需要时保留计算结果或函数身份 | 业务正确性的保证 |
| useTransition | 标记可延后的渲染更新 | 请求取消、限流或数据库锁 |

先保证状态来源清晰、逻辑正确，再通过测量决定是否需要缓存计算。不要为了“优化”给每个表达式包 useMemo。

<a id="section-3"></a>

## Effect 与事件分开

用户点击创建任务，应在事件里发送 POST。Effect 适合订阅、计时器、读取外部状态或与组件展示绑定的同步。由已有 state 可以直接计算的值，通常不需要再通过 Effect 写到另一份 state。

Effect 的依赖来自实际使用的响应式值，不能靠删依赖数组中的元素让警告消失。闭包保存的是某次渲染的值；漏依赖可能让监听器一直读旧数据。

<a id="section-4"></a>

## 可运行示例中的请求清理

[TaskPage.tsx](examples/react-taskboard/src/TaskPage.tsx)初次读取任务时创建 AbortController，同时用 active 标记拒绝过期回调：

```tsx
useEffect(() => {
  const controller = new AbortController();
  let active = true;
  loadTasks(controller.signal).then(items => {
    if (active) setTasks(items);
  }).catch(error => {
    if (active) setError(error instanceof Error ? error.message : '读取失败');
  });
  return () => {
    active = false;
    controller.abort();
  };
}, []);
```

这是组件内部片段，useEffect、loadTasks 和 setter 需要相应导入或声明；完整版本另处理认证与忙碌状态。

取消读取不代表服务器撤销了已经提交的业务操作。搜索或路由参数变化时，每次清理旧请求，并确保旧响应不能覆盖新结果。

<a id="section-5"></a>

## StrictMode 与重复执行

开发环境的 StrictMode 会增加检查，包括额外的渲染检查和 Effect 的 setup / cleanup 周期，用来暴露不纯渲染或缺失清理。不能据此宣称生产的 Effect 永远只运行一次。

不要用“已运行”ref 绕过所有检查，也不要为了隐藏重复请求直接删除 StrictMode。写入操作放在明确事件里；订阅、定时器和读取要能清理。

示例中的 pending ref 是同步阻止同一事件流程重入的标记，busy state 用于显示等待。禁用按钮不提供跨页面、跨用户的业务幂等性。

<a id="section-6"></a>

## 状态扩大之后怎样组织

先提升状态到共同父组件；复杂状态转换考虑纯 reducer，动作表达发生了什么。Context 可传递 reducer 的结果与 dispatch，但 provider 值变化会影响依赖它的消费者。

远端数据与本地 UI 状态分开思考：缓存、过期、重试与重复请求合并可以交给合适的数据工具。引入前明确加载键、取消和权限边界，不把所有服务器数据复制进多个全局仓库。

SSR 环境不把用户状态放进模块顶层的可变单例。Node 进程会服务多个用户；请求之间的状态隔离见 SSR 文档。

<a id="section-7"></a>

## 验证与常见问题

运行示例的 npm test 和 npm run build。再在开发工具中检查：切换页面、快速操作、请求失败、登录过期时，是否保留输入、恢复按钮并阻止过期数据更新。

| 问题 | 常见原因 |
| --- | --- |
| Effect 不断请求 | 依赖包含每次新建的对象，且 Effect 又更新相关 state |
| 定时器重复执行 | 缺少 cleanup |
| ref 变化页面不更新 | ref 本来不触发渲染 |
| reducer 偶尔产生重复副作用 | reducer 中执行了请求或修改外部数据 |
| 点击两次发生两笔业务 | 前端标记不能代替服务端幂等约束 |


<a id="section-8"></a>

## 官方参考

- [同步 Effect](https://react.dev/learn/synchronizing-with-effects)
- [不一定需要 Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Hook 规则](https://react.dev/reference/rules/rules-of-hooks)
- [StrictMode](https://react.dev/reference/react/StrictMode)
