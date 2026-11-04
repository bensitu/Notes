import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'browser.spec.mjs',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173/Notes/', headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'npm run serve:site', url: 'http://127.0.0.1:4173/Notes/', reuseExistingServer: false },
});
