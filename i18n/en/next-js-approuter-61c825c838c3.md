# Next.js and App Router in practice :id=h-8921a275558d

Learning objectives: understand the relationships among routing, server components, client boundaries, data, and deployment. Read the React and SSR documentation first. The example pins Next 16.4.4, React 19.3.1, Node 24, and TypeScript 5.9.3.

[Document index](README.md) · [SSR example guide](examples/ssr/README.md)

**Contents**

- [Start with directory conventions](#section-1)
- [Minimal run instructions](#section-2)
- [Server and client boundaries](#section-3)
- [Parameters, data, and state](#section-4)
- [Caching, updates, and server-side writes](#section-5)
- [Verification, errors, and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Start with directory conventions :id=h-28a1cb97e6e4

| File                          | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| app/layout.tsx                | Root layout, language, and shared metadata      |
| app/page.tsx                  | Homepage rendered at request time               |
| app/Counter.tsx               | Interactive component with use client           |
| app/articles/\[slug]/page.tsx | Article route with a dynamic parameter          |
| app/static/page.tsx           | Public page that can be generated at build time |
| app/not-found.tsx / error.tsx | Not-found and rendering-error interfaces        |
| app/api/health/route.ts       | HTTP Route Handler                              |
| lib/articles.ts               | Public read-only data used only on the server   |

This is an App Router project; do not mix in Pages Router's getServerSideProps / getStaticProps. The two routers may coexist during migration, but their file conventions and data API differ.

<a id="section-2"></a>

## Minimal run instructions :id=h-bce13f9ef108

Start from the repository root:

```powershell
Set-Location examples/next-ssr
npm ci
npm run build
npm start
```

Visit [http://127.0.0.1:3001](http://127.0.0.1:3001). The production build reports a dynamic homepage and a prerenderable /static. For development hot updates, use npm run dev separately; both services cannot occupy the same port simultaneously.

The project contains only public read-only articles and a browser counter. It has no login, database writes, or connection to the Java task API.

<a id="section-3"></a>

## Server and client boundaries :id=h-ae8476c2e62b

Pages and layouts are server components by default. Put use client at the start of an interactive component's file:

```tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(value => value + 1)}>次数：{count}</button>;
}
```

This is a standalone component example. The complete version also marks hydration readiness for testing.

use client defines a module dependency boundary; it does not mean “this component initially runs only in the browser.” Its HTML may still be generated for the first request, followed by browser hydration. Do not pass server secrets to the client through props, HTML, or RSC payloads.

<a id="section-4"></a>

## Parameters, data, and state :id=h-c328438f81e5

In this version, dynamic params is a Promise; the example gets slug with await params. Do not copy another version's synchronous params usage. Request-related cookies, headers, and similar APIs must also follow the target version's asynchronous interfaces.

The homepage uses the stable connection() API to wait for an actual request before generating a time. It is not a business authorization check or a function every page must use.

lib/articles.ts uses server-only to restrict imports to the server and contains immutable public sample data. A Server Component can call server data functions directly without looping back through its own Route Handler for an HTTP request.

<a id="section-5"></a>

## Caching, updates, and server-side writes :id=h-8b105bf9ec40

This example has manually created configuration and enables neither Cache Components nor Partial Prefetching. Do not conflate current scaffolding defaults, old tutorials' fetch-cache defaults, and this example.

When caching is needed, define whether it caches data or pages, which inputs form the key, expiration, and updates. Public articles can be cached; personal-session and permission-related data must not directly enter shared caches.

Server Actions / Server Functions are server entry points that clients can trigger, not functions only your buttons can call. New writes still need authentication, authorization, input validation, resource limits, and failure handling. use server is not a permission declaration.

<a id="section-6"></a>

## Verification, errors, and development quick reference :id=h-6b722fc85fd9

[SSR tests](examples/ssr/tests/rendering.spec.ts) verify homepage HTML, interaction, navigation, independent sessions, and unknown articles in production mode. error.tsx is a rendering error boundary, not a guarantee that all event-handler, background-task, or network errors are automatically caught.

| Symptom                                          | Check                                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| A Hook cannot be used in a page                  | Check whether a narrowly scoped client boundary is needed                                    |
| User data is unexpectedly accessed at build time | Static / dynamic selection and request API                                                   |
| Server fetch has no login identity               | Check whether current request credentials are correctly obtained and forwarded under control |
| Data stays stale after changes                   | Data, page, and client navigation caches, plus invalidation strategy                         |
| Cannot perform SSR after uploading dist to Nginx | Next runtime output and Node service, rather than a Vite static directory                    |

Once response streaming has started, do not assume every exception can still change the HTTP status. Observe actual responses and the interface in error tests. Production also requires verification of proxy, cache, and deployment-platform behavior.

<a id="section-7"></a>

## Official references :id=h-9c776aec5d06

- [Next App Router](https://nextjs.org/docs/app)
- [Component boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [connection](https://nextjs.org/docs/app/api-reference/functions/connection)
- [Caching model](https://nextjs.org/docs/app/getting-started/caching)
- [Deployment](https://nextjs.org/docs/app/getting-started/deploying)
