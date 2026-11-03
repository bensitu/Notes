process.env.NITRO_HOST = '127.0.0.1';
process.env.NITRO_PORT = '3002';
await import('../../nuxt-ssr/.output/server/index.mjs');
