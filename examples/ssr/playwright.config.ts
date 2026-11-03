import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  workers: 1,
  use: { browserName: 'chromium' },
  webServer: [
    {
      command: 'node ../next-ssr/node_modules/next/dist/bin/next start ../next-ssr --hostname 127.0.0.1 --port 3001',
      url: 'http://127.0.0.1:3001/api/health',
      reuseExistingServer: false
    },
    {
      command: 'node scripts/start-nuxt.mjs',
      url: 'http://127.0.0.1:3002/api/articles',
      reuseExistingServer: false
    }
  ]
});
