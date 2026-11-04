# SSR deployment and cache security :id=h-07a9a512b951

Learning objectives: run SSR as a server application with user boundaries, and understand risks involving caching, cookies, proxies, and serialization. First read SSR, HTTP security, and the Next / Nuxt documentation.

[Document index](README.md) · [SSR example guide](examples/ssr/README.md)

**Contents**

- [Identify the actual deployment model first](#section-1)
- [Minimal production verification](#section-2)
- [Determine data ownership before caching](#section-3)
- [Request state and BFF boundaries](#section-4)
- [Data output, errors, and streaming responses](#section-5)
- [Checklist and capability limits](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Identify the actual deployment model first :id=h-934408950cc3

| Build model                  | What to deploy                      | What must not be assumed                                                       |
| ---------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| React / Vue CSR              | Static files and an independent API | That the development proxy has been deployed                                   |
| Next Node SSR                | Next server runtime and build files | That serving an arbitrary directory as a static site preserves server features |
| Nuxt Node SSR                | .output/server and related output   | That copying public alone provides API and dynamic pages                       |
| Static export / prerendering | Generated static content            | That all request-time server capabilities remain available                     |

Edge environments, serverless platforms, and ordinary Node differ in API, filesystem access, and lifecycle. The examples use Node 24; check support before deploying to another platform.

<a id="section-2"></a>

## Minimal production verification :id=h-c043f426620f

Build Next and Nuxt following the [run instructions](examples/ssr/README.md), then run the tests. Do not substitute development-server results for production behavior.

Check raw HTML, Cache-Control, response statuses, and client logs. Then retest through the actual reverse proxy, focusing on compression, streaming, timeouts, request-body limits, and resource paths.

This repository's taskboard Nginx service forwards the Java API; it does not automatically proxy newly added Next / Nuxt ports. Configure upstreams and domains separately for the target deployment.

<a id="section-3"></a>

## Determine data ownership before caching :id=h-7ebe3a6a532e

| Content                                                           | Default approach                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Static assets with content hashes                                 | Can be cached long term                                                               |
| Public articles                                                   | Can be shared once expiration and invalidation rules are defined                      |
| HTML / payload containing identity, permissions, or personal data | Avoid shared caching first; design around explicit identity boundaries if needed      |
| Login, logout, and setting cookies                                | Do not cache as ordinary public pages                                                 |
| Error responses                                                   | Distinguish permanent absence from temporary failures; avoid caching errors long term |

A cache key may depend on language, tenant, user, or other inputs, not only URL. Disabling browser caching alone does not automatically clear server or CDN caches.

Cache-Control is not a universal switch for every internal cache. Check framework data caches, page caches, client navigation caches, proxies, and CDN separately, and invalidate the corresponding layers on updates.

<a id="section-4"></a>

## Request state and BFF boundaries :id=h-30824d8b7e88

A Node process may handle multiple users simultaneously. Do not store the current user, cookies, CSRF, or tenant objects in module globals. Public read-only constants can be shared; mutable request data must be isolated.

Server fetch is not inherently equivalent to browser fetch. When forwarding the current request's identity to a trusted upstream, restrict destinations and allowed headers; do not unconditionally forward Cookie or Authorization to user-supplied URL.

The server receiving upstream Set-Cookie does not mean the browser has received it. A BFF design must correctly handle cookie domain, path, Secure, SameSite, and multi-value response headers, rather than merely copying a string.

<a id="section-5"></a>

## Data output, errors, and streaming responses :id=h-3800bc8c8b94

Pass only data needed by the interface to the client. Even without a public prefix, private environment variables can leak if written into props or API responses.

Ordinary templates escape text, but manually inserting JSON into script, concatenating HTML, or using dangerous HTML APIs introduces additional risks. Use framework serialization and still check which fields may be output.

Error responses must not echo stack traces, SQL, or secrets. Once streaming starts, the HTTP status may already have been sent. Monitor both status and rendering failures; do not judge success solely from the final page text.

<a id="section-6"></a>

## Checklist and capability limits :id=h-72d94a4e7b91

- Two independent sessions cannot see each other's private content.
- HTML, RSC / Nuxt payloads, API, and logs contain no unnecessary secrets.
- Unauthenticated, unauthorized, missing-resource, and upstream-failure cases have defined behavior.
- Client disconnections, timeouts, and server shutdown release the corresponding resources.
- Release records retain code, configuration, framework versions, and cache invalidation strategy together.
- Static assets come from the same build version as the page, avoiding missing resources during releases.
- Proxy and CDN scenarios require actual verification, not a substitute local test.

The example handles only public articles and has no production login or CDN. Browser-session isolation tests only show that this example's counter state is not shared across sessions; they do not establish the security of a complete authentication system.

<a id="section-7"></a>

## Official references :id=h-854071373aab

- [Next self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Nuxt deployment](https://nuxt.com/docs/4.x/getting-started/deployment)
- [OWASP caching and session protection](https://cheatsheetseries.owasp.org/)
