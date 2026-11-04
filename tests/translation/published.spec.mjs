import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(await fs.readFile(new URL('../../.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const source = name => manifest.documents.find(doc => doc.source === name);
test.beforeEach(async ({ page }) => {
  await page.route('https://img-blog.csdnimg.cn/**', route => route.abort());
});

test('all published articles have current English and Japanese editions and localized navigation', async ({ page }) => {
  expect(manifest.translationWarnings).toEqual([]);
  expect(manifest.translations).toHaveLength(manifest.documents.length * 2);
  for (const language of ['en', 'ja']) {
    const translations = manifest.translations.filter(doc => doc.language === language);
    expect(new Set(translations.map(doc => doc.source)).size).toBe(manifest.documents.length);
    expect(translations.every(doc => doc.status !== 'outdated')).toBe(true);
    await page.goto('./#/' + language + '/');
    await expect(page.locator('#main h1')).toBeVisible();
    const links = page.locator('.nav-category li a');
    await expect(links).toHaveCount(manifest.documents.length);
    expect(await links.evaluateAll((nodes, prefix) => nodes.every(node => node.hash.startsWith(prefix)), '#/' + language + '/')).toBe(true);
    await expect(page.locator('#main')).not.toContainText(/untranslated|translations are added|未翻訳|尚无译文/i);
    await expect(page.locator('.translation-notice')).toHaveCount(0);
  }
});

test('real translated articles preserve deep links and code across language changes', async ({ page }) => {
  const article = source('JSF 基础.md');
  await page.goto('./#' + article.route + '?id=section-1');
  const code = await page.locator('#main pre code').first().textContent();
  for (const language of ['en', 'ja']) {
    await page.locator('#language-select').selectOption(language);
    const translated = manifest.translations.find(doc => doc.source === article.source && doc.language === language);
    await expect(page).toHaveURL(new RegExp('#' + translated.route + '\\?id=section-1$'));
    await expect(page.locator('#section-1')).toBeAttached();
    await expect(page.locator('#main pre code').first()).toHaveText(code);
    await expect(page.locator('.translation-notice')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  }
});

test('shared technical keywords prefer the selected language and Japanese pages fit mobile', async ({ page }) => {
  for (const language of ['en', 'ja']) {
    await page.goto('./#/' + language + '/');
    await expect(page.locator('#main h1')).toBeVisible();
    await page.locator('#search-open').click();
    await page.locator('#search-input').fill('React');
    await expect(page.locator('#search-results a').first()).toHaveAttribute('href', new RegExp('^#/' + language + '/'));
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({ width: 320, height: 780 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.getByRole('button', { name: 'ダークモードに切替', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
