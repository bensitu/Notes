# Nuxt full-stack and SSR practice :id=h-6a21bfa5ad6f

Learning objectives: understand page routing, server-side API, data payloads, and hydration in the Vue ecosystem. First learn Vue 3 and SSR. The example pins Nuxt 4.6.4, Vue 3.5.44, Node 24, and the accompanying lockfile.

[Document index](README.md) · [SSR example guide](examples/ssr/README.md)

**Contents**

- [How Nuxt relates to ordinary Vue projects](#section-1)
- [Minimal run instructions](#section-2)
- [Data fetching and payloads](#section-3)
- [SSR-friendly state](#section-4)
- [Environment, errors, and authentication](#section-5)
- [Verification and quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## How Nuxt relates to ordinary Vue projects :id=h-db1014dd552a

Vue handles components and reactivity; Nuxt adds conventions for page routing, server-side rendering, data fetching, and server runtime. Nitro handles the corresponding server build and runtime.

This example uses the app directory layout of Nuxt 4. Do not directly use Nuxt 2's asyncData, directory layout, or plugin syntax as configuration for this project.

| Directory      | Responsibility                                    |
| -------------- | ------------------------------------------------- |
| app/pages      | Filesystem-based page routing                     |
| app/components | Reusable Vue components                           |
| app/app.vue    | NuxtPage and shared structure                     |
| server/api     | Server-side API invoked by corresponding requests |
| server/utils   | Public server data for this example               |
| shared/types   | Shareable type definitions                        |
| nuxt.config.ts | SSR, Nitro, page headers, and route rules         |

<a id="section-2"></a>

## Minimal run instructions :id=h-416c962c5758

```powershell
Set-Location examples/nuxt-ssr
npm ci
npm run typecheck
npm run build
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = '3002'
npm start
```

Enter the project from the repository root and visit [http://127.0.0.1:3002](http://127.0.0.1:3002). This Node server build outputs to .output; taking only .output/public does not preserve dynamic SSR.

Use npm run dev in development, also on port 3002; do not run it on the same port as production simultaneously. The server API provides only public read-only articles, without real users or a database.

<a id="section-3"></a>

## Data fetching and payloads :id=h-9d96c7edee6e

The page uses useFetch('/api/articles'). Server results travel in the initial payload and can be reused during client hydration. Fetching initial data with ordinary $fetch directly in setup can produce different duplicate-fetch behavior.

Choose useFetch, useAsyncData, and $fetch in events according to the scenario; do not interchange them simply because they look similar. Data sharing a key must also have consistent options and expectations to avoid overwriting each other.

Data here comes from the example's own fixed server array. Generic types do not validate real external API; when integrating external services, check response status and data structure.

<a id="section-4"></a>

## SSR-friendly state :id=h-dcec1d983bf2

The example stores server time as follows:

```typescript
const renderedAt = useState<string>('rendered-at', () => new Date().toISOString());
```

This is a fragment in a Vue setup context; Nuxt auto-imports useState. The client reuses the server payload instead of obtaining another time on the first hydration.

Counter uses keyed useState to reuse state within the same application, while Nuxt handles request context. Do not put a mutable ref at the top level of a server module as state for all users.

Passed values must respect the framework's serialization boundary. Connection objects, functions, and arbitrary class instances cannot simply be treated as data safe to pass to the browser. Even serializable values must not put secrets into the payload.

<a id="section-5"></a>

## Environment, errors, and authentication :id=h-1795318bb37a

useSeoMeta expresses page titles and descriptions. Missing articles produce a server 404 and page error handling. Page-route middleware cannot replace authentication and authorization in server/api.

Separate private runtime configuration from runtimeConfig.public. Values in public reach the browser; do not put database passwords or service keys there.

Server and browser requests in SSR differ in cookie behavior. Relative-path useFetch in Nuxt can use request-context forwarding. For external upstreams, still verify the destination, allowlist, and actual forwarded headers; do not send every credential to arbitrary URL.

<a id="section-6"></a>

## Verification and quick reference :id=h-7c38a603c7fc

| Symptom                                                   | Check                                                             |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| Initial render reports window does not exist              | Check browser-only API usage in modules or setup                  |
| Server and client content differ                          | useState / data payloads and nondeterministic values              |
| The browser receives secrets                              | public configuration, page props, useState, and response content  |
| The old article remains after parameter changes           | Check whether fetch keys and route parameters are reactive        |
| API returns 404 after deploying only the static directory | Check whether the Nitro service was accidentally omitted          |
| Route checks pass, but access still exceeds permissions   | Check whether server API actually verifies identity and ownership |

Run production tests, checking content without JavaScript, hydration, and initial values in independent browsers separately. After extension, real databases, sessions, and CDN configuration need separate verification.

<a id="section-7"></a>

## Official references :id=h-e91c94f3279c

- [Nuxt rendering modes](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [Data fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching)
- [State management](https://nuxt.com/docs/4.x/getting-started/state-management)
- [Deployment](https://nuxt.com/docs/4.x/getting-started/deployment)
