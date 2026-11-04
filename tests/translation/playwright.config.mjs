import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: '.', testMatch: 'language.spec.mjs', workers: 1,
  use: { baseURL: 'http://127.0.0.1:4175/Notes/', headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'node scripts/serve-site.mjs', cwd: fileURLToPath(new URL('../..', import.meta.url)), url: 'http://127.0.0.1:4175/Notes/', reuseExistingServer: false, env: { PORT: '4175', SITE_BASE_PATH: '/Notes/', SITE_OUTPUT_DIR: fileURLToPath(new URL('../../.translation-browser/.site-dist', import.meta.url)) } },
});
