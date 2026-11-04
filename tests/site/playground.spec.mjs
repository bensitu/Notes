import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(await fs.readFile(new URL('../../.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const preview = page => page.frameLocator('.pg-frame');
const run = page => page.getByRole('button', { name: '运行', exact: true }).click();

test('HTML editors run drafts, keep file contents, reset and isolate the preview', async ({ page }) => {
  await page.goto('./#/playground');
  await expect(preview(page).getByRole('heading')).toHaveText('每天进步一点点');
  await preview(page).getByRole('button', { name: '完成一次练习' }).click();
  await expect(preview(page).locator('#count')).toHaveText('1');
  await expect(page.locator('.pg-logs')).toContainText('已完成的练习： 1');
  await page.getByRole('button', { name: 'index.html', exact: true }).click();
  await page.getByRole('textbox').fill('<h1>我修改的标题</h1>');
  await page.getByRole('button', { name: 'script.js', exact: true }).click();
  await page.getByRole('textbox').fill('try { parent.document.body; } catch (error) { console.log("隔离：" + error.name); }\nconsole.log("<img src=x onerror=alert(1)>");');
  await run(page);
  await expect(preview(page).getByRole('heading')).toHaveText('我修改的标题');
  await expect(page.locator('.pg-logs')).toContainText('隔离：SecurityError');
  await expect(page.locator('.pg-logs')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.pg-logs img')).toHaveCount(0);
  await expect(page.locator('.pg-frame')).toHaveAttribute('sandbox', 'allow-scripts');
  await page.locator('#pg-sample').selectOption('vue-counter');
  await page.locator('#pg-sample').selectOption('html-basics');
  await expect(preview(page).getByRole('heading')).toHaveText('我修改的标题');
  await page.getByRole('button', { name: '重置示例', exact: true }).click();
  await expect(preview(page).getByRole('heading')).toHaveText('每天进步一点点');
  await page.getByRole('button', { name: '停止', exact: true }).click();
  await expect(page.locator('.pg-frame')).toHaveCount(0);
  await expect(page.locator('.pg-status')).toHaveText('已停止');
});

test('React JSX renders, reports a syntax error, and runs the corrected draft', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/)) external.push(request.url()); });
  await page.goto('./#/playground?demo=react-counter');
  await expect(preview(page).getByRole('heading')).toHaveText('React 练习计数器');
  await preview(page).getByRole('button').click();
  await expect(preview(page).locator('p')).toHaveText('已完成 1 次练习');
  await page.getByRole('textbox').fill('function App( {');
  await run(page);
  await expect(page.locator('.pg-status')).toContainText('运行出错');
  await expect(page.locator('.pg-logs')).toContainText('App.jsx');
  await page.getByRole('textbox').fill('ReactDOM.createRoot(document.getElementById("app")).render(<h1>JSX 修改成功</h1>);');
  await page.getByRole('textbox').press('Control+Enter');
  await expect(preview(page).getByRole('heading')).toHaveText('JSX 修改成功');
  await expect(page.locator('.pg-status')).toHaveText('已运行');
  expect(external).toEqual([]);
});

test('Vue ref and computed update the template and article links return to the selected demo', async ({ page }) => {
  await page.goto('./#/playground?demo=vue-counter');
  await expect(preview(page).getByRole('heading')).toHaveText('Vue 练习计数器');
  for (let count = 0; count < 3; count++) await preview(page).getByRole('button').click();
  await expect(preview(page).getByText('今天的目标已完成')).toBeVisible();
  await page.locator('.pg-related a').first().click();
  await expect(page.locator('.article-playground a')).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/playground-page/);
  await page.locator('.article-playground a').click();
  await expect(page.locator('#pg-sample')).toHaveValue('vue-counter');
  await expect(preview(page).getByRole('heading')).toHaveText('Vue 练习计数器');
});

test('SSR simulation separates initial HTML, client rendering and hydration including disabled JS', async ({ page }) => {
  await page.goto('./#/playground?demo=ssr-compare');
  const cards = page.locator('.pg-sim-card');
  const next = page.getByRole('button', { name: '下一步', exact: true });
  await expect(cards).toHaveCount(2);
  await next.click();
  await expect(cards.nth(0).locator('.pg-sim-view')).toContainText('空容器');
  await expect(cards.nth(1).getByRole('button')).toBeDisabled();
  await next.click();
  await expect(cards.nth(0).getByRole('button')).toBeEnabled();
  await expect(cards.nth(1).getByRole('button')).toBeDisabled();
  await next.click();
  await expect(cards.nth(1).getByRole('button')).toBeEnabled();
  await cards.nth(1).getByRole('button').click();
  await expect(cards.nth(1).locator('.pg-sim-view')).toContainText('已完成 1 次练习');
  await page.getByLabel('模拟禁用 JavaScript', { exact: true }).check();
  await next.click();
  await expect(next).toBeDisabled();
  await expect(cards.nth(0).locator('.pg-sim-view')).toContainText('空容器');
  await expect(cards.nth(1).getByRole('button')).toBeDisabled();
  await expect(page.locator('.pg-explanation')).toContainText('SSR 仍能显示初始正文');
});

test('local URL boundaries render correctly and playground works at 320px, in dark mode and across languages', async ({ page }) => {
  const source = manifest.documents.find(doc => doc.source === 'Next.js与AppRouter实践.md');
  await page.goto('./#' + source.route);
  const link = page.locator('#main a[href="http://127.0.0.1:3001"]');
  await expect(link).toHaveText('http://127.0.0.1:3001');
  await expect(page.locator('#main')).toContainText('。生产构建会报告');
  await page.locator('.article-playground a').click();
  await expect(page.locator('#pg-sample')).toHaveValue('ssr-compare');
  await page.setViewportSize({ width: 320, height: 760 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.locator('#pg-sample').selectOption('react-counter');
  await expect(preview(page).getByRole('heading')).toHaveText('React 练习计数器');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.getByRole('button', { name: '切换到深色模式' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#language-select').selectOption('en');
  await expect(page).toHaveURL(/#\/en\/playground\?demo=react-counter$/);
  await expect(page.locator('#pg-sample')).toHaveValue('react-counter');
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeVisible();
  await expect(preview(page).getByRole('heading')).toHaveText('React 练习计数器');
  await page.locator('#language-select').selectOption('ja');
  await expect(page).toHaveURL(/#\/ja\/playground\?demo=react-counter$/);
  await expect(page.getByRole('button', { name: '実行', exact: true })).toBeVisible();
});
