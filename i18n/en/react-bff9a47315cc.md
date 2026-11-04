# React fundamentals and components :id=h-cd14a5e3ea1f

Learning objectives: organize pages with function components and understand JSX, props, state, forms, and lists. First learn JavaScript functions, arrays, objects, and asynchronous requests. The examples pin React 19.3.1, Node 24, and TypeScript 5.9.3.

[Document index](README.md) · [Example guide](examples/react-taskboard/README.md)

**Contents**

- [What React does](#section-1)
- [Minimal run instructions](#section-2)
- [Your first component and state](#section-3)
- [Events, forms, and component communication](#section-4)
- [Lists, updates, and state ownership](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What React does :id=h-b9b02a68d5d4

React describes the interface based on data, then commits updates to the page. A component is a function returning an interface description, not an HTML string template; an ordinary function call, rendering, and a DOM update are also distinct operations.

JSX is a syntax extension to JavaScript, and TSX provides type checking for it. Put variables in braces, capitalize component names, and close tags; className corresponds to an CSS class, and htmlFor to the label association attribute.

<a id="section-2"></a>

## Minimal run instructions :id=h-4b840138caaf

Open another terminal at the repository root and first start the Java backend following the [task management instructions](examples/taskboard/README.md). React and Vue use the same API, but their page projects are independent.

```powershell
Set-Location examples/react-taskboard
npm ci
npm run dev
```

Visit [http://127.0.0.1:5174](http://127.0.0.1:5174) and log in with admin and the backend's APP_PASSWORD. Enter, submit, and complete a task, observing the interface. This is a CSR single-page application; see the separate documentation for SSR, as these are different execution models.

<a id="section-3"></a>

## Your first component and state :id=h-81ddc92e14ab

The following component can be placed in a TSX file; import it into a page to use it:

```tsx
import { useState } from 'react';

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return <button onClick={() => setCount(value => value + 1)}>
    点击次数：{count}
  </button>;
}
```

The parent passes in props; the child does not modify it directly. state holds data the current component needs to remember that affects its display. Calling a setter requests a later render; it does not change variables in the current function execution.

Passing initial does not mean later props changes automatically reset state. If synchronization is needed, first define component identity, controlled state, or reset rules; do not casually add an Effect to copy all props.

<a id="section-4"></a>

## Events, forms, and component communication :id=h-0b56630deb58

onClick={handleClick} passes a function; onClick={handleClick()} calls it during rendering. When an event needs additional arguments, wrap the call in an arrow function.

Controlled inputs use value and onChange. Use onSubmit for form submission and preventDefault as needed; do not store passwords in localStorage or print them to logs. Browser field validation improves feedback, but the server must still validate independently.

[TaskForm.tsx](examples/react-taskboard/src/TaskForm.tsx) manages its own input and calls onAdd supplied by its parent. The parent returns success or failure. Clear the form only on success; retain the text on failure so the user can edit it.

<a id="section-5"></a>

## Lists, updates, and state ownership :id=h-662664d94b35

Use a stable business ID as a list key; do not use array indices as stable identities when inserting, sorting, or filtering. A key is not automatically passed to a child as a normal prop.

Create new values when changing objects or arrays; do not push directly into existing state and expect React to detect it. Use a functional setter when you need the previous value. A new reference is not a deep copy; nested objects also require correct update boundaries.

Put shared data in the common parent, and keep input-only data in the form. Do not put all temporary state into a global library from the outset. The example calculates the remaining task count directly from the task list instead of storing another count that can fall out of sync.

<a id="section-6"></a>

## Verification and development quick reference :id=h-eaa4d71a544a

```powershell
npm test
npm run build
```

| Symptom                                   | Check                                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| Cannot edit input                         | Check whether onChange is provided and whether undefined and strings are mixed           |
| Request runs before a click               | Check whether the handler is called within JSX                                           |
| Inputs get mixed up after a list update   | Check key stability and whether state belongs in a different component                   |
| Still reading an old value after setState | The current event closure sees the state snapshot for this render                        |
| Content containing HTML appears as text   | Normal text escaping; do not enable dangerous HTML output for user input because of this |

React does not automatically provide complete routing, request caching, or server deployment. The corresponding tools and frameworks supply engineering and SSR capabilities.

<a id="section-7"></a>

## Official references :id=h-c0659c556c28

- [Getting started with React](https://react.dev/learn)
- [State as a snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Rendering lists](https://react.dev/learn/rendering-lists)
