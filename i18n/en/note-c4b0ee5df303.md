# Frontend automated testing: state, components, and real browsers :id=h-b5f757669d90

Learning objectives: distinguish request mocks from real APIs and cover user-observable success, failure, and waiting states.

**Scope:** The running project pins Vitest, jsdom, and Playwright versions in the lockfile and runs on Node 24. Playwright requires a separate browser installation.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [What three test categories do](#section-1)
- [Minimal run instructions](#section-2)
- [Real-browser tests](#section-3)
- [Selectors and waiting](#section-4)
- [Extending component tests](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What three test categories do :id=h-b21bfe20d6e7

State and function tests check data behavior; component tests check rendering and interactions; browser end-to-end tests check that pages, networking, cookies, and servers cooperate.

jsdom simulates part of the DOM and is not a real browser. Similar screenshots do not mean login or submission works. Prioritize user-observable behavior, then choose the appropriate test level.

<a id="section-2"></a>

## Minimal run instructions :id=h-b76725de8939

```powershell
Set-Location examples/taskboard/frontend
npm ci
npm test
npm run build
```

Here [TaskPage.test.ts](examples/taskboard/frontend/src/TaskPage.test.ts) verifies error messages and form recovery; [tasks.test.ts](examples/taskboard/frontend/src/tasks.test.ts) checks retaining old data on request failure and rejecting malformed response fields. Tests provide HTTP 503 and invalid JSON to cover failures reliably without a real backend.

<a id="section-3"></a>

## Real-browser tests :id=h-0b9225425f2b

Start the Java backend in another terminal following the project instructions. Browser tests start the frontend development server:

```powershell
Set-Location examples/taskboard/frontend
npx playwright install chromium
$env:APP_PASSWORD = 'local-demo-change-me'
npm run test:e2e
```

APP_PASSWORD must match the backend. On Linux CI, playwright install --with-deps chromium can install required system dependencies along with the first browser installation.

[task.spec.ts](examples/taskboard/frontend/e2e/task.spec.ts) uses the real backend for password login, task creation and completion, and access denial after logout. It does not intercept API as fake successes, allowing detection of cookie, proxy, and CSRF configuration issues.

<a id="section-4"></a>

## Selectors and waiting :id=h-384755bc2b8e

Locate inputs and buttons by accessible name, such as getByLabel and getByRole. If multiple elements share text, use exact or narrow the scope to avoid wrong clicks.

Wait for business results, such as a new title appearing in the list, instead of sleeping a fixed three seconds. Fixed delays waste time in fast environments and still fail in slow ones.

Generate unique task names for each run. Since tests modify the database, use an isolated test database or an explicit cleanup strategy; never run destructive tests against production data.

<a id="section-5"></a>

## Extending component tests :id=h-b98b66337181

The project includes Vue Test Utils. When extending component tests, mount components, provide an isolated Pinia, and restore network mocks and global state afterward.

Recommended coverage: empty lists, loading, error messages, duplicate-click prevention, input-length boundaries, expired login, and user recovery after 409 conflicts. Avoid asserting every detail of private method names or DOM structure.

<a id="section-6"></a>

## Verification and development quick reference :id=h-25d2c2992612

| Symptom                                     | Check                                                           |
| ------------------------------------------- | --------------------------------------------------------------- |
| Backend tests pass, but browser login fails | Actual cookies, CSRF, proxy, and password                       |
| Tests interfere with each other             | Check mocks, global variables, and Pinia recreation             |
| CI cannot find a browser                    | Check browser and system-dependency installation                |
| Development works but build fails           | TypeScript, Vue type checks, and actual tool versions           |
| Elements intermittently cannot be found     | Check actual accessible names and waiting for the correct state |

Retain necessary screenshots, traces, and service logs on failure, limiting retention and access. Reports may contain business data; do not publicly upload login credentials or full sessions.

<a id="section-7"></a>

## Official references :id=h-e47684898f28

- [Vitest](https://vitest.dev/guide/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
