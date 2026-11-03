# 现代 CSS 与可访问性

学习目标：做出在手机、键盘和辅助工具下也能使用的页面。先掌握 HTML 元素与选择器。

**适用范围：** 现代浏览器；使用已经广泛支持的 Flex、Grid、媒体查询和语义化 HTML。完整样式见贯穿项目。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [先分清内容、结构与外观](#section-1)
- [最小可运行示例](#section-2)
- [布局选择速查](#section-3)
- [输入、反馈与状态](#section-4)
- [验证步骤](#section-5)
- [常见错误与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 先分清内容、结构与外观

HTML 表达按钮、标题和输入框是什么，CSS 决定如何排列和显示。点击操作优先用 button，页面跳转优先用 a；不要把所有内容都做成带点击事件的 div。

可访问性是让不同操作方式的用户完成同一任务。键盘能操作、焦点能看见、输入有标签、失败有文字反馈，都是基础功能。

<a id="section-2"></a>

## 最小可运行示例

保存成独立 HTML 文件后用浏览器打开：

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>任务表单</title>
<style>
* { box-sizing: border-box; }
main { width: min(100% - 2rem, 40rem); margin: 2rem auto; }
form { display: grid; gap: .75rem; }
input, button { font: inherit; padding: .6rem; }
:focus-visible { outline: 3px solid #1c58b7; outline-offset: 3px; }
@media (min-width: 40rem) {
  form { grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; }
}
</style>
</head>
<body>
<main>
  <h1>任务表单</h1>
  <form>
    <label for="title">任务标题</label>
    <input id="title" name="title" required maxlength="100">
    <button type="submit">提交</button>
  </form>
</main>
</body>
</html>
```

这个例子只演示布局和原生必填验证，没有保存功能。完整的请求与错误处理见 [TaskPage.vue](examples/taskboard/frontend/src/TaskPage.vue)。

<a id="section-3"></a>

## 布局选择速查

| 需求 | 优先考虑 | 易错点 |
| --- | --- | --- |
| 一行按钮、导航、列表项 | Flex | 长文字可能需要允许换行或收缩 |
| 表单、多列区域 | Grid | minmax(0, 1fr) 可以避免内容撑破网格 |
| 限制阅读宽度 | max-width 或 min() | 不要固定成只能适应一块屏幕的宽度 |
| 手机与桌面调整 | 媒体查询 | 断点按内容需要确定，不是设备品牌清单 |
| 统一间距和颜色 | CSS 自定义属性 | 变量名应表达用途，不只是颜色数值 |

Flex 和 Grid 不互相替代。先保证正常文档顺序，再通过布局呈现；视觉顺序与 Tab 焦点顺序相反时用户会困惑。

<a id="section-4"></a>

## 输入、反馈与状态

每个输入有可见 label；placeholder 不能代替 label。错误说明应该指出字段与修复方法，可用 aria-describedby 关联。动态错误使用合适的 role=alert，普通状态更新使用 aria-live=polite。

禁用按钮时要让用户知道为什么等待。请求结束必须恢复状态；不只靠红色表示失败，也使用文字或图标。使用足够的文字对比度，并检查放大后的布局。

不要去掉 outline 而不给替代焦点样式；不要把正常操作藏在仅有 hover 的内容中。对动画尊重 prefers-reduced-motion。

<a id="section-5"></a>

## 验证步骤

1. 只用 Tab、Shift+Tab、Enter 和 Space 完成表单。
2. 将窗口缩窄，并把页面放大到 200%，确认没有内容被遮挡。
3. 查看浏览器可访问性树，确认输入名称与按钮名称有意义。
4. 尝试长标题、错误提示和处理中状态。
5. 用自动工具辅助扫描，再由人检查交互；自动分数不能证明所有用户都能使用。

<a id="section-6"></a>

## 常见错误与开发速查

提交表单里的普通按钮要写 type=button，避免触发表单提交。列表中使用稳定的业务键，别用 CSS 视觉位置代替数据身份。

样式重用按职责抽取；只有确实存在多处共同规则时再建立组件或工具类。需要支持哪些浏览器，应写入项目约定并在构建和测试中落实。

<a id="section-7"></a>

## 官方参考

- [MDN CSS 布局](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
