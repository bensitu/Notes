import { expect, test } from '@playwright/test';

test('uses the real session API and keeps navigation in the SPA', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('密码', { exact: true }).fill(process.env.APP_PASSWORD ?? 'local-demo-change-me');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  const title = 'React task ' + Date.now();
  await page.getByLabel('任务标题').fill(title);
  await page.getByRole('button', { name: '新增' }).click();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '完成：' + title, exact: true }).click();
  await expect(page.getByRole('button', { name: '恢复：' + title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: '退出登录', exact: true }).click();
  await expect(page.getByLabel('密码', { exact: true })).toBeVisible();
  expect((await page.request.get('/api/tasks')).status()).toBe(401);
  await page.getByRole('link', { name: '关于', exact: true }).click();
  await expect(page.getByRole('heading', { name: '关于示例' })).toBeVisible();
});
