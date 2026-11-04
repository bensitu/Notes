import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(await fs.readFile(new URL('../../.translation-browser/.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const source = name => manifest.documents.find(doc => doc.source === name);
const translated = (name, language) => manifest.translations.find(doc => doc.source === name && doc.language === language);

test('language switching keeps explicit chapter IDs and uses localized navigation', async ({ page }) => {
  const name = 'JSF 基础.md';
  await page.goto('./#' + source(name).route + '?id=section-1');
  await page.getByLabel('Language / 言語 / 语言').selectOption('en');
  await expect(page).toHaveURL(new RegExp(translated(name, 'en').route + '\\?id=section-1$'));
  await expect(page.locator('#main h1')).toHaveText('Lifecycle');
  await expect(page.locator('.nav-home')).toHaveText('All notes');
  await page.getByLabel('Language / 言語 / 语言').selectOption('ja');
  await expect(page).toHaveURL(new RegExp(translated(name, 'ja').route + '\\?id=section-1$'));
  await expect(page.locator('#main h1')).toHaveText('ライフサイクル');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('#section-1')).toBeAttached();
  await expect(page.locator('#page-toc-links a').first()).toHaveAttribute('href', new RegExp('^#' + translated(name, 'ja').route + '\\?id=h-'));
});

test('outdated reviewed translations remain readable, with working same-language links and Chinese fallbacks', async ({ page }) => {
  const route = translated('React基础与组件.md', 'ja').route;
  await page.goto('./#' + route);
  await expect(page.locator('.translation-notice.is-outdated')).toContainText('以前の原文');
  await expect(page.locator('.translation-notice a')).toHaveAttribute('href', '#' + source('React基础与组件.md').route);
  await expect(page.locator('#main pre code')).toContainText('// Keep this comment.\nconst value = "中文";');
  const image = page.locator('#main img').first();
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate(node => node.naturalWidth)).toBe(1);
  await page.locator('#main a[href$="?id=section-1"]').click();
  await expect(page).toHaveURL(new RegExp(translated('JSF 基础.md', 'ja').route + '\\?id=section-1$'));
  await page.goto('./#' + route);
  await page.locator('#main a[href="#' + source('中文 &+%.md').route + '"]').click();
  await expect(page.locator('#main h1')).toHaveText('仅中文文章');
  await page.getByLabel('Language / 言語 / 语言').selectOption('ja');
  await expect(page).toHaveURL(/#\/ja\/\?source=/);
  await expect(page.locator('.translation-notice')).toContainText('まだありません');
  await page.locator('.translation-notice a').click();
  await expect(page.locator('#main h1')).toHaveText('仅中文文章');
});

test('mobile language controls, localized search and dark mode remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('./#/en/');
  await expect(page.locator('.nav-home')).toHaveText('All notes');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByLabel('Keywords', { exact: true }).fill('Component basics');
  await expect(page.locator('#search-results a').first()).toContainText('Component basics');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
