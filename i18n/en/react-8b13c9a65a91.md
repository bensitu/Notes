# React project engineering and testing :id=h-4570736a9809

Learning objectives: organize React components into a runnable, checkable, releasable project. The example uses Node 24, Vite 8, React 19, React Router 8, and TypeScript 5.9.3; the lockfile determines exact dependencies.

[Document index](README.md) · [Example guide](examples/react-taskboard/README.md)

**Contents**

- [Project file map](#section-1)
- [Installation, development, and builds](#section-2)
- [Routing and data boundaries](#section-3)
- [Component tests](#section-4)
- [Real API and browser tests](#section-5)
- [Releases, failures, and quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Project file map :id=h-c5f7f7581c30

| File                  | Responsibility                                  |
| --------------------- | ----------------------------------------------- |
| src/main.tsx          | Root node, StrictMode, and browser routing      |
| src/TaskPage.tsx      | Page state, authentication, and task operations |
| src/TaskForm.tsx      | Controlled inputs and submission feedback       |
| src/tasks.ts          | Requests, DTO, and runtime response checks      |
| src/api.ts            | Session cookies, CSRF, and HTTP errors          |
| vite.config.ts        | Plugins, development proxy, and Vitest          |
| src/\*.test.tsx / e2e | Component behavior tests / real-browser flows   |

React also officially offers a framework path. This example chooses Vite to demonstrate CSR with an independent Java API. When server-side rendering is needed, use the corresponding project in a framework such as Next.js; do not treat a Vite directory as a complete SSR service.

<a id="section-2"></a>

## Installation, development, and builds :id=h-a224083bebbb

First run the backend from the repository root, then open another terminal:

```powershell
Set-Location examples/react-taskboard
npm ci
npm test
npm run build
npm run dev
```

Open [http://127.0.0.1:5174](http://127.0.0.1:5174). npm ci uses the committed package-lock; update installations and review the lockfile only when deliberately changing dependencies. A development server starting successfully does not mean full type checking has passed.

Build output goes to dist. Vite's /api development proxy is not automatically deployed with dist. In production, the server must forward that path to the protected Java API.

<a id="section-3"></a>

## Routing and data boundaries :id=h-53c9cbb26112

The example imports BrowserRouter, Routes, Route, and NavLink from react-router and uses its Declarative mode. The router's Framework / Data / Declarative modes differ; do not arbitrarily combine configuration from different modes.

Browser History routing requires the server to return the SPA entry point for page paths. Handle API, missing static resources, and actual errors separately. A client-side “page not found” display does not guarantee an initial HTTP response of 404.

This example stores the latest task list in React state without an extra global library. Check responses as unknown first; a TypeScript generic assertion cannot validate external JSON.

<a id="section-4"></a>

## Component tests :id=h-bc74aaa8d400

```powershell
npm test
```

Tests verify that failed submissions retain input, only successful submissions clear it, and a 503 displays an error and restores the login button. Locate elements by label and role, without relying on private methods or incidental DOM nesting.

Component tests use jsdom and do not establish correctness of browser layout, cookies, proxies, or CSRF flows. Restore network mocks after each case to avoid affecting other tests.

<a id="section-5"></a>

## Real API and browser tests :id=h-7721de07947c

The backend must still be running locally on 8080. Use the same password as the backend:

```powershell
Set-Location examples/react-taskboard
npx playwright install chromium
$env:APP_PASSWORD = 'local-demo-change-me'
npm run test:e2e
```

The flow uses the real Java API for login, creation, completion, logout, and route navigation; do not change the server to return fake success. Test databases and accounts must be separate from production; test records must not be written into real users' environments.

<a id="section-6"></a>

## Releases, failures, and quick reference :id=h-34b8fc7c0b16

| Issue                                                     | Check                                                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| TSX error                                                 | File extension, jsx configuration, and React type versions                                            |
| Build succeeds but requests fail                          | Production /api proxy and target service                                                              |
| Writes return 403 after login                             | Cookies and the CSRF token retrieved again after login                                                |
| Page refresh returns 404                                  | Server fallback for History routing                                                                   |
| List is empty with no error                               | Check whether failures are swallowed and converted to an empty array                                  |
| Resubmitting after creation times out produces duplicates | Check whether the server has already completed the operation and whether an idempotency key is needed |

VITE\_ environment variables enter browser code and cannot hold server secrets. React escapes ordinary text but does not replace backend authorization checks; do not use dangerouslySetInnerHTML casually for untrusted content.

<a id="section-7"></a>

## Official references :id=h-5258c283811a

- [React project choices](https://react.dev/learn/creating-a-react-app)
- [Vite](https://vite.dev/guide/)
- [React Router modes](https://reactrouter.com/start/modes)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
