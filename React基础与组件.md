# React 基础与组件

学习目标：用函数组件组织页面，理解 JSX、props、state、表单和列表。先掌握 JavaScript 函数、数组、对象与异步请求。示例固定 React 19.3.1、Node 24 和 TypeScript 5.9.3。

[文档目录](README.md) · [示例说明](examples/react-taskboard/README.md)

**内容导航**

- [React 负责什么](#section-1)
- [最小运行步骤](#section-2)
- [第一个组件与状态](#section-3)
- [事件、表单与组件通信](#section-4)
- [列表、更新与状态归属](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)


<a id="section-1"></a>

## React 负责什么

React 根据数据描述界面，再把更新提交到页面。组件是返回界面描述的函数，不是 HTML 字符串模板；普通函数调用、渲染和 DOM 更新也不是同一件事。

JSX 是 JavaScript 的语法扩展，TSX 为它提供类型检查。变量写在花括号中，组件名称大写，标签闭合；className 对应 CSS 类，htmlFor 对应 label 的关联属性。

<a id="section-2"></a>

## 最小运行步骤

从仓库根目录另开终端，先按[任务管理说明](examples/taskboard/README.md)启动 Java 后端。React 与 Vue 使用同一 API，但页面项目相互独立。

```powershell
Set-Location examples/react-taskboard
npm ci
npm run dev
```

访问 http://127.0.0.1:5174，用 admin 和后端的 APP_PASSWORD 登录。输入任务、提交、完成后观察界面。此处是 CSR 单页应用；SSR 另见对应文档，不把它们混为一种运行方式。

<a id="section-3"></a>

## 第一个组件与状态

下面是可以放入 TSX 文件的组件；将其引入页面后使用：

```tsx
import { useState } from 'react';

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return <button onClick={() => setCount(value => value + 1)}>
    点击次数：{count}
  </button>;
}
```

props 由父组件传入，子组件不直接修改。state 用于当前组件需要记住并影响显示的数据。调用 setter 请求后续渲染，不会修改当前这次函数执行中的变量。

传入 initial 不表示之后 props 变化会自动重置 state。需要同步时先明确组件身份、受控状态或重置规则，不随意加 Effect 复制所有 props。

<a id="section-4"></a>

## 事件、表单与组件通信

onClick={handleClick} 传递函数；onClick={handleClick()} 会在渲染时调用它。事件中需要额外参数时，可以用一个箭头函数包装调用。

受控输入使用 value 与 onChange。表单提交使用 onSubmit 并按需要 preventDefault；密码不存 localStorage，也不打印到日志。字段验证在浏览器改善反馈，服务端仍需独立校验。

[TaskForm.tsx](examples/react-taskboard/src/TaskForm.tsx)管理自己的输入，调用父组件传入的 onAdd。父组件返回成功或失败，表单只在成功时清空，失败时保留文字供用户修改。

<a id="section-5"></a>

## 列表、更新与状态归属

列表用稳定的业务 ID 作 key；插入、排序或过滤时，不把数组下标当稳定身份。key 不会作为普通 prop 自动传给子组件。

修改对象与数组时创建新值，不直接 push 到现有 state 再期望 React 识别；需要前一个值时使用函数式 setter。新引用不是深复制，嵌套对象也要维护正确边界。

共享数据放在共同父组件；只属于输入框的数据留在表单。不要一开始就把全部临时状态放入全局库。示例的剩余任务数直接从任务列表计算，不再保存一份容易失步的计数。

<a id="section-6"></a>

## 验证与开发速查

```powershell
npm test
npm run build
```

| 症状 | 检查 |
| --- | --- |
| 输入不能修改 | 是否提供了 onChange，是否把 undefined 与字符串混用 |
| 点击前就执行请求 | 是否在 JSX 中调用了处理函数 |
| 列表更新后输入串行 | key 是否稳定，状态是否放错组件 |
| setState 后仍读到旧值 | 当前事件闭包看到的是这次渲染的状态快照 |
| 内容包含 HTML 却显示为文字 | 正常文本转义；不要因此对用户输入开启危险 HTML 输出 |

React 不自动提供完整路由、请求缓存或服务端部署。工程和 SSR 的配套能力由相应工具与框架承担。


<a id="section-7"></a>

## 官方参考

- [React 入门](https://react.dev/learn)
- [状态快照](https://react.dev/learn/state-as-a-snapshot)
- [列表渲染](https://react.dev/learn/rendering-lists)
