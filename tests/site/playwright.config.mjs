import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync(new URL('../../.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const baseURL = 'http://127.0.0.1:4173' + manifest.basePath;

export default defineConfig({
  testDir: '.',
  testMatch: 'browser.spec.mjs',
  fullyParallel: false,
  workers: 1,
  use: { baseURL, headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'npm run serve:site', url: baseURL, reuseExistingServer: false, env: { SITE_BASE_PATH: manifest.basePath, PORT: '4173' } },
});
