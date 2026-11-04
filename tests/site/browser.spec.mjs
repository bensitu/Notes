import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(await fs.readFile(new URL('../../.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const doc = name => manifest.documents.find(item => item.source === name);

test.beforeEach(async ({ page }) => {
  await page.route('https://img-blog.csdnimg.cn/**', route => route.abort());
});

test('homepage, generated categories, search, theme and keyboard work under the project base', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./#/');
  await expect(page.locator('#main h1').first()).toContainText('开发学习');
  await expect(page.locator('.nav-category')).toHaveCount(7);
  await expect(page.locator('.nav-category li a')).toHaveCount(60);
  await page.keyboard.press('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('关键词', { exact: true }).fill('murmur2');
  await expect(page.locator('#search-results a').first()).toContainText('Kafka');
  await page.locator('#search-results a').first().click();
  await expect(page.locator('#main h1').first()).toContainText('Kafka');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.sidebar-nav [aria-current="page"]')).toHaveCount(1);
  await page.getByRole('button', { name: '切换到深色模式' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '切换到浅色模式' }).click();
  expect(errors).toEqual([]);
});

test('JSF explicit anchors, table wrapping, highlighted code and clipboard work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./#' + doc('JSF 基础.md').route);
  await page.locator('#main a:not(.anchor)').filter({ hasText: '一、JSF 生命周期' }).click();
  await expect(page).toHaveURL(/\?id=section-1$/);
  await expect.poll(() => page.locator('#section-1').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(180);
  await expect(page.locator('#page-toc-links a').first()).toBeVisible();
  await page.locator('#page-toc-links a').nth(1).click();
  await expect(page).toHaveURL(/\?id=h-[a-f\d]+$/);
  await expect(page.locator('#page-toc-links [aria-current="location"]')).toHaveCount(1);
  await expect(page.locator('.table-scroll')).not.toHaveCount(0);
  await expect(page.locator('pre code .token').first()).toBeAttached();
  const first = page.locator('pre').first();
  const source = await first.locator('code').textContent();
  await first.getByRole('button', { name: '复制此代码块' }).click();
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toEqual(source);
  await expect(page.locator('.article-navigation a')).not.toHaveCount(0);
});

test('local images and GitHub example links are served with the correct target', async ({ page, request }) => {
  await page.goto('./#' + doc('MyBatis的使用.md').route);
  const image = page.locator('#main img').first();
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('src', /^http:\/\/127\.0\.0\.1:4173\/Notes\/assets\/media\/[a-f\d]+\.png\?v=/);
  await expect.poll(() => image.evaluate(element => element.naturalWidth)).toBeGreaterThan(0);
  const rawHtmlImage = page.locator('#main img[style]').first();
  expect((await request.get(await rawHtmlImage.getAttribute('src'))).status()).toBe(200);
  await page.goto('./#' + doc('React基础与组件.md').route);
  await expect(page.locator('#main a[href*="/blob/main/examples/react-taskboard/src/TaskForm.tsx"]')).toHaveCount(1);
  await expect(page.locator('#main a[href*="/blob/main/examples/react-taskboard/README.md"]')).toHaveCount(1);
});

test('long Vue article remains usable on mobile and navigation can be toggled', async ({ page }) => {
  await page.goto('./#' + doc('VUE基础.md').route);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.sidebar')).not.toBeInViewport();
  await expect(page.locator('#main h1').first()).toBeVisible();
  await expect(page.locator('.page-toc')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expect.poll(() => page.locator('#main').evaluate(element => element.clientWidth)).toBeGreaterThan(300);
  const toggle = page.locator('.sidebar-toggle-button');
  await toggle.click();
  await expect(page.locator('.sidebar')).toBeInViewport();
  const category = page.locator('.nav-category').first();
  await category.locator('summary').click();
  await expect(category).not.toHaveAttribute('open', '');
  await toggle.click();
  await page.getByRole('button', { name: '搜索笔记' }).click();
  await expect(page.getByLabel('关键词', { exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('unknown routes show a usable not-found page', async ({ page }) => {
  await page.goto('./#/missing-article');
  await expect(page.locator('#main')).toContainText('未找到这篇笔记');
  await page.locator('#main a').filter({ hasText: '返回全部笔记' }).click();
  await expect(page.locator('#main h1').first()).toContainText('开发学习');
});
