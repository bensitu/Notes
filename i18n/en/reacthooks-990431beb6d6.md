# React Hooks and state management :id=h-80944b5c6bb2

Learning objectives: choose state, Effect, ref, reducer, and Context correctly, and understand closures, dependencies, and request cleanup. Read React fundamentals first; the running example uses React 19.

[Document index](README.md) · [Example guide](examples/react-taskboard/README.md)

**Contents**

- [Rules for calling Hooks](#section-1)
- [Common tools at a glance](#section-2)
- [Separate Effects from events](#section-3)
- [Request cleanup in the runnable example](#section-4)
- [StrictMode and repeated execution](#section-5)
- [Organizing growing state](#section-6)
- [Verification and common issues](#section-7)
- [Official references](#section-8)

<a id="section-1"></a>

## Rules for calling Hooks :id=h-b121d883c3c0

Call ordinary Hooks at the top level of function components or custom Hooks, keeping their call order the same on every render. Do not call useState / useEffect inside conditions, loops, ordinary utility functions, or event handlers.

The use API in React has its own rules; its exceptions do not apply to every Hook. Custom Hooks reuse logic; they do not automatically make all callers share the same state.

<a id="section-2"></a>

## Common tools at a glance :id=h-e98150157855

| Tool                  | Suitable for                                                                   | What it is not                                                           |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| useState              | Simple local state                                                             | An assignment that immediately changes a variable in the current closure |
| useReducer            | Multiple actions updating a group of state values                              | A place to make HTTP requests                                            |
| useEffect             | Establishing, updating, or cleaning up synchronization with an external system | The default container for all calculations and click logic               |
| useRef                | Holding a DOM reference or mutable value that does not drive display           | A page update notification                                               |
| Context               | Passing shared dependencies through a component tree                           | An automatically high-performance, universal state store                 |
| useMemo / useCallback | Retaining a calculation result or function identity when needed                | A guarantee of business correctness                                      |
| useTransition         | Marking rendering updates that can be deferred                                 | Request cancellation, rate limiting, or database locks                   |

First ensure clear state ownership and correct logic; then measure to decide whether calculations need caching. Do not wrap every expression in useMemo for the sake of “optimization.”

<a id="section-3"></a>

## Separate Effects from events :id=h-91b402851a5e

When a user clicks to create a task, send POST in the event handler. Effects suit subscriptions, timers, reading external state, and synchronization tied to component display. Values directly calculable from existing state usually do not need an Effect to write them into another state.

Effect dependencies come from the reactive values actually used; do not remove dependency-array entries just to silence warnings. A closure retains values from a particular render; missing dependencies can leave listeners reading old data indefinitely.

<a id="section-4"></a>

## Request cleanup in the runnable example :id=h-742f0ceb1bef

[TaskPage.tsx](examples/react-taskboard/src/TaskPage.tsx) creates an AbortController when initially loading tasks, and also uses an active flag to reject stale callbacks:

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

This is a fragment inside a component. Import or declare useEffect, loadTasks, and the setters as appropriate; the complete version also handles authentication and busy state.

Canceling a read does not mean the server has undone an already submitted business operation. When search or route parameters change, clean up the old request each time and ensure an old response cannot overwrite new results.

<a id="section-5"></a>

## StrictMode and repeated execution :id=h-839a65ef240d

In development, StrictMode adds checks, including extra render checks and Effect setup / cleanup cycles, to expose impure rendering or missing cleanup. This does not justify claiming production Effects always run only once.

Do not bypass every check with an “already ran” ref or remove StrictMode simply to hide duplicate requests. Put writes in explicit events; subscriptions, timers, and reads must support cleanup.

The example's pending ref synchronously prevents reentry into the same event flow; busy state displays the waiting state. Disabling a button does not provide business idempotency across pages or users.

<a id="section-6"></a>

## Organizing growing state :id=h-bc0ebd3e69c0

First lift state to the common parent. For complex state transitions, consider a pure reducer whose actions express what happened. Context can pass a reducer's result and dispatch, but changes to the provider value affect consumers that depend on it.

Treat remote data separately from local UI state. Suitable data tools can handle caching, expiration, retries, and deduplicating requests. Before adopting them, define load keys, cancellation, and permission boundaries; do not copy all server data into multiple global stores.

In an SSR environment, do not store user state in a mutable module-level singleton. A Node process serves multiple users; see the SSR documentation for state isolation between requests.

<a id="section-7"></a>

## Verification and common issues :id=h-056a2dab967f

Run npm test and npm run build for the example. Then use developer tools to check whether input is retained, buttons recover, and stale data updates are blocked when navigating, acting quickly, requests fail, or login expires.

| Issue                                                | Common cause                                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Effect keeps sending requests                        | Dependencies include a newly created object on every render, and the Effect updates related state |
| Timer executes repeatedly                            | Missing cleanup                                                                                   |
| Changing a ref does not update the page              | Refs do not trigger rendering                                                                     |
| Reducer occasionally produces duplicate side effects | Requests or external data mutations occur in the reducer                                          |
| Two clicks perform two business operations           | A frontend flag cannot replace server-side idempotency constraints                                |

<a id="section-8"></a>

## Official references :id=h-92e41fd835e3

- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [StrictMode](https://react.dev/reference/react/StrictMode)
