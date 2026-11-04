# SSR and hydration principles :id=h-a20a476ee778

Learning objectives: distinguish when HTML is generated, where JavaScript executes, and how a page becomes interactive. Requires fundamentals of HTML, HTTP, and React or Vue. Examples use production builds of Next 16 and Nuxt 4.

[Document index](README.md) · [SSR example guide](examples/ssr/README.md)

**Contents**

- [Keep these four concepts distinct](#section-1)
- [Observe two runnable projects](#section-2)
- [What “matching” means for hydration](#section-3)
- [Common sources of mismatches](#section-4)
- [Performance, SEO, and streaming](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Keep these four concepts distinct :id=h-50e889bc9a3a

| Concept             | How initial content is produced                                                               | Runtime requirements                                     |
| ------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| CSR                 | The business interface is mainly produced after JavaScript runs in the browser                | Static resource hosting and a data API                   |
| SSR                 | The server generates initial HTML while handling a request; caching can be combined with this | The corresponding server runtime                         |
| SSG / prerendering  | Generate HTML for known pages at build time                                                   | Deploy the generated static content                      |
| hydration Hydration | The browser takes over server HTML using matching data and components                         | Client scripts and matching initial results are required |

SPA describes navigation and application organization, while SSR describes how HTML is generated; they are not strictly mutually exclusive. An SSR framework can later navigate with client-side routing, and one site can mix strategies by page.

React Server Components describes server components and their protocol boundary, not the same thing as SSR: server components can participate in build-time or request-time rendering. Client components may also participate in prerendering the initial HTML.

<a id="section-2"></a>

## Observe two runnable projects :id=h-ac1da6722a17

The Next example is in examples/next-ssr, and the Nuxt example in examples/nuxt-ssr. See the [SSR example guide](examples/ssr/README.md) for complete commands and verification.

Build and start one project first, then read the homepage's raw response using curl.exe. It should already contain article links and titles; these should remain visible even with browser JavaScript disabled.

After enabling JavaScript, wait for data-hydrated=true, then click the counter: its value changes from 0 to 1. Server-returned HTML and an interactive page are two separately verified results.

<a id="section-3"></a>

## What “matching” means for hydration :id=h-eeb4521a6d44

The first server and browser renders should produce compatible structure, text, and attributes. Do not independently call random-number or current-time functions on both first renders, or use formatting that depends on different time zones.

Next passes the server-calculated time down as server-generated content; the interactive counter starts at a fixed 0. Nuxt uses useState to retain the server's initial value, passing it in the payload for the client to reuse.

window, document, and localStorage exist only in the appropriate browser environment. Read them at client mount time or within an explicit client-component boundary, not during module import.

<a id="section-4"></a>

## Common sources of mismatches :id=h-29ba6474f1f5

| Source                | Example                                           | How to fix it                                                              |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Different data        | Each side fetches a different result              | Use framework data passing and the initial payload                         |
| Time and locale       | Server UTC versus browser local time zone         | Unify initial output; show local formatting after mount                    |
| Invalid HTML          | The browser restructures disallowed tag nesting   | Fix the structure                                                          |
| Browser state         | Reading localStorage directly on the first render | Provide a deterministic initial interface and read after mount             |
| External modification | Extensions or third-party scripts modify DOM      | Reproduce in a minimal environment and identify the source of modification |

Do not treat suppressHydrationWarning, ClientOnly, or disabling SSR as the default fix for every issue. Design appropriate placeholders and loading behavior only when content truly can be produced only in the browser.

<a id="section-5"></a>

## Performance, SEO, and streaming :id=h-fb1bef754f5b

SSR may show content sooner, but adds server work and the cost of waiting for upstream data. hydration still requires script downloads, parsing, and execution; SSR does not guarantee improvements in every metric.

SSG and caching suit public content that changes infrequently. Ensure isolation first for private user content. Streaming rendering can send content in segments, but proxy buffering, error statuses, and monitoring must also be coordinated.

Having HTML does not automatically complete SEO. Titles, metadata, accessible links, correct statuses, canonical URL, and a suitable site content strategy are also required.

<a id="section-6"></a>

## Verification and development quick reference :id=h-fb72a47e7175

1. Start a production build; do not check only dev mode.
2. Inspect raw HTML, not only the Elements panel after scripts have run.
3. Disable browser JavaScript and confirm the expected content remains.
4. Enable scripts and check hydration logs and interaction.
5. Use independent browser sessions to confirm user state does not leak between them.
6. Check statuses for nonexistent pages and upstream failures.

[Production-mode tests](examples/ssr/tests/rendering.spec.ts) cover script-free content, hydration interaction, independent browser state, and unknown articles in both frameworks. They do not establish that a real CDN, identity system, or every component has been tested.

<a id="section-7"></a>

## Official references :id=h-38f66550cb07

- [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Next server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Nuxt rendering modes](https://nuxt.com/docs/4.x/guide/concepts/rendering)
