import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const manifest = JSON.parse(fs.readFileSync(new URL('../../.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const baseURL = 'http://127.0.0.1:4176' + manifest.basePath;
export default defineConfig({
  testDir: '.', testMatch: 'published.spec.mjs', workers: 1,
  use: { baseURL, headless: true, colorScheme: 'light', trace: 'retain-on-failure' },
  webServer: { command: 'node scripts/serve-site.mjs', cwd: fileURLToPath(new URL('../..', import.meta.url)), url: baseURL, reuseExistingServer: false, env: { PORT: '4176', SITE_BASE_PATH: manifest.basePath } },
});
