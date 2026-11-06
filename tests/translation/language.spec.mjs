import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(await fs.readFile(new URL('../../.translation-browser/.site-dist/site-manifest.json', import.meta.url), 'utf8'));
const source = name => manifest.documents.find(doc => doc.source === name);
const translated = (name, language) => manifest.translations.find(doc => doc.source === name && doc.language === language);

test('language switching keeps explicit chapter IDs and uses localized navigation', async ({ page }) => {
  const name = 'JSF 基础.md';
  await page.goto('./#' + source(name).route + '?id=section-1');
  await page.locator('#language-select').selectOption('en');
  await expect(page).toHaveURL(new RegExp(translated(name, 'en').route + '\\?id=section-1$'));
  await expect(page.locator('#main h1')).toHaveText('Lifecycle');
  await expect(page.locator('.translation-notice')).toHaveCount(0);
  await expect(page.locator('.nav-home')).toHaveText('All notes');
  await page.locator('#language-select').selectOption('ja');
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
  await page.locator('#language-select').selectOption('ja');
  await expect(page).toHaveURL(/#\/ja\/\?source=/);
  await expect(page.locator('.translation-notice')).toContainText('中国語の原文');
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
  await page.getByLabel('Keywords', { exact: true }).fill('const');
  await expect(page.locator('#search-results a').first()).toHaveAttribute('href', /^#\/en\//);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

const interfaceCopy = {
  zh: { lang: 'zh-CN', selector: '语言', caption: '开发学习笔记', brand: 'Notes 全部笔记', name: '技术笔记', skip: '跳到正文', table: '表格，可横向滚动', sidebar: '文章分类导航', toggle: '展开或收起文章导航', adjacent: '相邻文章', top: '顶部导航', toc: '本页目录', copy: '复制此代码块', fallback: '请选中后复制', copyFailed: '复制未完成，请选中代码手动复制', navigationFailed: '文章顺序暂时无法加载，请使用左侧导航', playgroundFailed: '示例加载失败，请刷新页面重试。', playgroundLoading: '正在加载示例…' },
  en: { lang: 'en', selector: 'Language', caption: 'Developer notes', brand: 'Notes · All notes', name: 'Technical notes', skip: 'Skip to main content', table: 'Table; scroll horizontally', sidebar: 'Articles by category', toggle: 'Show or hide article navigation', adjacent: 'Adjacent articles', top: 'Main navigation', toc: 'On this page', copy: 'Copy this code block', fallback: 'Select and copy', copyFailed: 'Copy failed. Select the code and copy it manually.', navigationFailed: 'Article order could not load. Use the sidebar navigation.', playgroundFailed: 'The example could not load. Refresh the page to try again.', playgroundLoading: 'Loading example…' },
  ja: { lang: 'ja', selector: '言語', caption: '開発ノート', brand: 'Notes · すべてのノート', name: '技術ノート', skip: '本文へ移動', table: '表（横にスクロールできます）', sidebar: 'カテゴリー別の記事ナビゲーション', toggle: '記事ナビゲーションを開閉', adjacent: '前後の記事', top: 'メインナビゲーション', toc: 'このページの目次', copy: 'コードをコピー', fallback: '選択してコピー', copyFailed: 'コピーできませんでした。コードを選択して手動でコピーしてください。', navigationFailed: '記事の順序を読み込めませんでした。サイドバーを使ってください。', playgroundFailed: 'サンプルを読み込めませんでした。ページを再読み込みしてください。', playgroundLoading: 'サンプルを読み込み中…' },
};

for (const [language, copy] of Object.entries(interfaceCopy)) {
  const article = language === 'zh' ? source('React基础与组件.md') : translated('React基础与组件.md', language);

  test(`${language}: interface and accessibility labels match the route language`, async ({ page }) => {
    await page.route(url => url.pathname.endsWith('/' + article.file), async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: await response.text() + '\n\n| Key | Value |\n| --- | --- |\n| Example | 1 |\n' });
    });
    await page.goto('./#' + article.route);
    await expect(page.locator('html')).toHaveAttribute('lang', copy.lang);
    await expect(page.locator('#language-select')).toHaveAccessibleName(copy.selector);
    await expect(page.locator('.site-brand')).toHaveAccessibleName(copy.brand);
    await expect(page.locator('.brand-caption')).toHaveText(copy.caption);
    await expect(page.locator('.site-header nav')).toHaveAccessibleName(copy.top);
    await expect(page.locator('.page-toc')).toHaveAccessibleName(copy.toc);
    await expect(page.locator('#skip-to-content')).toHaveText(copy.skip);
    await page.locator('#skip-to-content').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main h1').first()).toBeFocused();
    await expect(page.locator('.table-scroll')).toHaveAccessibleName(copy.table);
    await expect(page.locator('.sidebar-nav')).toHaveAccessibleName(copy.sidebar);
    await expect(page.locator('.article-navigation')).toHaveAccessibleName(copy.adjacent);
    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('.sidebar-toggle-button');
    await expect(toggle).toHaveAccessibleName(copy.toggle);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName(copy.toggle);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleName(copy.toggle);
    // Docsify's duplicate brand is intentionally hidden by the existing stylesheet.
    await expect(page.locator('.app-name')).toBeHidden();
    await expect(page.locator('.app-name-link')).toHaveText(copy.name);
  });

  for (const mode of ['clipboard', 'legacy']) {
    test(`${language}: ${mode} copy failure is localized and announced`, async ({ page }) => {
      await page.addInitScript(mode => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'clipboard' ? { writeText: async () => { throw new Error('Clipboard denied'); } } : undefined });
        document.execCommand = () => { throw new Error('Clipboard denied'); };
      }, mode);
      await page.goto('./#' + article.route);
      const button = page.locator('.copy-code').first();
      await expect(button).toHaveAccessibleName(copy.copy);
      await button.click();
      await expect(button).toHaveText(copy.fallback);
      await expect(page.locator('#site-status')).toHaveText(copy.copyFailed);
      await expect(page.locator('#site-status')).toHaveAttribute('aria-live', 'polite');
      await expect(page.locator('.clipboard-fallback')).toHaveCount(0);
    });
  }

  test(`${language}: navigation and Playground failures are localized`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/navigation.json', route => route.fulfill({ status: 503, body: '{}' }));
    await page.goto('./#' + article.route);
    await expect(page.locator('#site-status')).toHaveText(copy.navigationFailed);
    const target = language === 'en' ? 'ja' : 'en';
    await page.locator('#language-select').selectOption(target);
    await expect(page.locator('#language-select')).toHaveValue(language);
    await expect(page.locator('#site-status')).toHaveText(copy.navigationFailed);
    await page.unroute('**/navigation.json');
    let releaseModule;
    const moduleResponse = new Promise(resolve => { releaseModule = resolve; });
    await page.route('**/playground-host.js', async route => {
      await moduleResponse;
      await route.fulfill({ status: 503, body: '' });
    });
    const prefix = language === 'zh' ? '' : '/' + language;
    await page.goto('./#' + prefix + '/playground', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#playground-root')).toHaveText(copy.playgroundLoading);
    await expect(page.locator('#playground-root')).toHaveAttribute('aria-busy', 'true');
    releaseModule();
    await expect(page.locator('#playground-root')).toHaveText(copy.playgroundFailed);
    await expect(page.locator('#playground-root')).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('#playground-root')).toHaveAttribute('role', 'alert');
    expect(errors).toEqual([]);
  });
}

for (const [language, title, back] of [
  ['en', 'Note not found', 'return to all notes'],
  ['ja', 'ノートが見つかりません', 'すべてのノートに戻ってください'],
]) {
  test(`${language}: unknown routes keep the localized not-found page and home link`, async ({ page }) => {
    await page.goto('./#/' + language + '/missing-article');
    await expect(page.locator('#main h1')).toHaveText(title);
    await expect(page.getByRole('link', { name: back, exact: true })).toHaveAttribute('href', '#/' + language + '/');
    await page.getByRole('link', { name: back, exact: true }).click();
    await expect(page).toHaveURL(new RegExp('#/' + language + '/$'));
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  });
}
