export default defineNuxtConfig({
  compatibilityDate: '2026-11-04',
  ssr: true,
  devtools: { enabled: false },
  telemetry: false,
  nitro: { preset: 'node-server' },
  app: { head: { htmlAttrs: { lang: 'zh-CN' }, title: 'Nuxt SSR 示例' } },
  routeRules: { '/': { headers: { 'cache-control': 'no-store' } } }
});
