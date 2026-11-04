# Modern CSS and accessibility :id=h-58e76889ea70

Learning objectives: build pages usable on phones, with keyboards, and with assistive tools. First learn HTML elements and selectors.

**Scope:** Modern browsers, using widely supported Flex, Grid, media queries, and semantic HTML. See the running project for complete styles.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Distinguish content, structure, and appearance first](#section-1)
- [Minimal runnable example](#section-2)
- [Layout selection quick reference](#section-3)
- [Inputs, feedback, and state](#section-4)
- [Verification steps](#section-5)
- [Common errors and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Distinguish content, structure, and appearance first :id=h-5aeda9137a07

HTML expresses what buttons, headings, and inputs are; CSS determines their layout and appearance. Prefer button for actions and a for navigation; do not turn everything into a clickable div.

Accessibility lets users with different interaction methods complete the same task. Keyboard operation, visible focus, labeled inputs, and textual failure feedback are fundamental features.

<a id="section-2"></a>

## Minimal runnable example :id=h-f83c3f98c495

Save as a standalone HTML file and open it in a browser:

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

This example demonstrates only layout and native required-field validation, without saving. See [TaskPage.vue](examples/taskboard/frontend/src/TaskPage.vue) for complete requests and error handling.

<a id="section-3"></a>

## Layout selection quick reference :id=h-a8bdfb0a37d2

| Requirement                                 | Consider first        | Common pitfall                                                    |
| ------------------------------------------- | --------------------- | ----------------------------------------------------------------- |
| A row of buttons, navigation, or list items | Flex                  | Long text may need wrapping or shrinking                          |
| Forms and multi-column areas                | Grid                  | minmax(0, 1fr) can prevent content from overflowing the grid      |
| Limit reading width                         | max-width or min()    | Do not fix width for just one screen size                         |
| Adjust for phones and desktops              | Media queries         | Choose breakpoints for content needs, not a list of device brands |
| Consistent spacing and colors               | CSS custom properties | Variable names should express purpose, not just color values      |

Flex and Grid do not replace each other. Keep a sensible document order before applying layout; users are confused when visual order opposes Tab focus order.

<a id="section-4"></a>

## Inputs, feedback, and state :id=h-8763ccd19b81

Every input needs a visible label; placeholders cannot replace labels. Errors should identify the field and how to fix it, optionally linked with aria-describedby. Use role=alert appropriately for dynamic errors and aria-live=polite for ordinary status updates.

When disabling buttons, explain why the user is waiting. Restore state when requests end. Indicate failure with text or icons as well as red color. Ensure sufficient text contrast and check zoomed layouts.

Do not remove outline without replacement focus styles, or hide ordinary actions in hover-only content. Respect prefers-reduced-motion for animations.

<a id="section-5"></a>

## Verification steps :id=h-475fcbbf8e67

1. Complete the form using only Tab, Shift+Tab, Enter, and Space.
2. Narrow the window and zoom the page to 200%; confirm no content is obscured.
3. Inspect the browser accessibility tree and confirm meaningful input and button names.
4. Try long titles, error messages, and in-progress states.
5. Use automated scanning as an aid, then inspect interactions manually; an automated score cannot prove usability for every user.

<a id="section-6"></a>

## Common errors and development quick reference :id=h-5e2857d10ab4

Set type=button on ordinary buttons inside forms to avoid submitting them. Use stable business keys in lists, not CSS visual positions as data identity.

Extract reusable styles by responsibility; create components or utility classes only when shared rules actually occur in multiple places. Record required browser support in project agreements and enforce it through builds and tests.

<a id="section-7"></a>

## Official references :id=h-7429d0ba69a3

- [MDN CSS layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
