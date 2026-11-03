import { expect, test } from '@playwright/test';

for (const app of [
  { name: 'Next', url: 'http://127.0.0.1:3001', heading: 'Next.js 服务端渲染' },
  { name: 'Nuxt', url: 'http://127.0.0.1:3002', heading: 'Nuxt 服务端渲染' }
]) {
  test(app.name + ': content exists without browser JavaScript', async ({ browser, request }) => {
    const response = await request.get(app.url);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<h1>' + app.heading + '</h1>');
    expect(html).toMatch(/data-testid="rendered-at"/);
    expect(response.headers()['cache-control']).toMatch(/no-store|private/);
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(app.url);
      await expect(page.getByRole('link', { name: '理解 SSR', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '点击次数：0' })).toBeVisible();
    } finally { await context.close(); }
  });

  test(app.name + ': hydrates, navigates, and isolates a new browser', async ({ page, browser }) => {
    const hydrationErrors: string[] = [];
    page.on('pageerror', error => hydrationErrors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|mismatch|#418/i.test(message.text())) {
        hydrationErrors.push(message.text());
      }
    });
    await page.goto(app.url);
    const counter = page.getByRole('button', { name: '点击次数：0' });
    await expect(counter).toHaveAttribute('data-hydrated', 'true');
    await counter.click();
    await expect(page.getByRole('button', { name: '点击次数：1' })).toBeVisible();
    await page.getByRole('link', { name: '理解 SSR', exact: true }).click();
    await expect(page.getByRole('heading', { name: '理解 SSR', exact: true })).toBeVisible();
    expect(hydrationErrors).toEqual([]);
    const context = await browser.newContext();
    try {
      const other = await context.newPage();
      await other.goto(app.url);
      await expect(other.getByRole('button', { name: '点击次数：0' })).toHaveAttribute('data-hydrated', 'true');
    } finally { await context.close(); }
  });

  test(app.name + ': unknown article has an HTTP error status', async ({ request }) => {
    const response = await request.get(app.url + '/articles/not-a-real-article');
    expect(response.status()).toBe(404);
  });
}
