import { expect, test } from '@playwright/test';

test('logs in and creates a task through the real API', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('密码', { exact: true }).fill(process.env.APP_PASSWORD ?? 'local-demo-change-me');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  const title = 'Browser task ' + Date.now();
  await page.getByLabel('任务标题').fill(title);
  await page.getByRole('button', { name: '新增', exact: true }).click();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '完成：' + title, exact: true }).click();
  await expect(page.getByRole('button', { name: '恢复：' + title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: '退出登录', exact: true }).click();
  await expect(page.getByLabel('密码', { exact: true })).toBeVisible();
  expect((await page.request.get('/api/tasks')).status()).toBe(401);
});
