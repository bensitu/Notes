/* Keep the browser layer small; article discovery and rewriting belong to the build. */
(() => {
  'use strict';
  const config = window.NOTES_SITE;
  const asset = filename => config.assetPath + filename;
  const resource = filename => new URL(config.basePath + filename + '?v=' + config.version, location.origin).href;
  const $ = selector => document.querySelector(selector);
  let navigation;
  let searchIndex;
  let observer;
  let playgroundCleanup;
  const categoryState = new Map();
  const translations = {
    zh: { light: '浅色模式', dark: '深色模式', toLight: '切换到浅色模式', toDark: '切换到深色模式', search: '搜索笔记', title: '搜索全部笔记', close: '关闭', keyword: '关键词', hint: '输入关键词搜索文章标题与全文。', searching: '正在搜索…', noResults: '没有找到结果，请换一个关键词。', failed: '搜索暂时无法加载，请稍后重试。', matches: n => '找到 ' + n + ' 个章节，显示前 15 项。', toc: '本页目录', emptyToc: '本页没有子章节', copy: '复制', copied: '已复制', copyLabel: '复制此代码块', previous: '上一篇', next: '下一篇', source: '在 GitHub 查看源文档 ↗', missing: '尚无译文，可阅读中文版。', outdated: '此译文对应较早的原文，请参考最新中文版。', chinese: '最新中文版', reviewed: '已人工审校', machine: '机器翻译，尚未标记人工审校' },
    en: { light: 'Light mode', dark: 'Dark mode', toLight: 'Switch to light mode', toDark: 'Switch to dark mode', search: 'Search', title: 'Search all notes', close: 'Close', keyword: 'Keywords', hint: 'Search article titles and full text.', searching: 'Searching…', noResults: 'No results. Try another keyword.', failed: 'Search is unavailable. Please try again.', matches: n => n + ' matching sections; showing up to 15.', toc: 'On this page', emptyToc: 'No subsections', copy: 'Copy', copied: 'Copied', copyLabel: 'Copy this code block', previous: 'Previous', next: 'Next', source: 'View Chinese source on GitHub ↗', missing: 'This translation is not available. Read the Chinese article.', outdated: 'This translation reflects an earlier source. Check the latest Chinese article.', chinese: 'Latest Chinese source', reviewed: 'Human reviewed', machine: 'Machine translation; not marked as human reviewed' },
    ja: { light: 'ライトモード', dark: 'ダークモード', toLight: 'ライトモードに切替', toDark: 'ダークモードに切替', search: '検索', title: 'すべてのノートを検索', close: '閉じる', keyword: 'キーワード', hint: '記事のタイトルと本文を検索します。', searching: '検索中…', noResults: '見つかりません。別のキーワードをお試しください。', failed: '検索を読み込めません。再度お試しください。', matches: n => n + ' 件の節が一致しました。先頭 15 件を表示します。', toc: 'このページの目次', emptyToc: '小見出しはありません', copy: 'コピー', copied: 'コピー済み', copyLabel: 'コードをコピー', previous: '前の記事', next: '次の記事', source: 'GitHub で中国語原文を表示 ↗', missing: 'この翻訳はまだありません。中国語の記事をご覧ください。', outdated: 'この翻訳は以前の原文に対応しています。最新の中国語版も確認してください。', chinese: '最新の中国語原文', reviewed: '人による校閲済み', machine: '機械翻訳・人による校閲は未登録' },
  };
  function language() { return /^#\/(en|ja)(?:\/|$)/.exec(location.hash)?.[1] || 'zh'; }
  function ui() { return translations[language()]; }
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const storedTheme = () => { try { return localStorage.getItem('notes-theme'); } catch { return null; } };
  function applyTheme(mode) {
    const dark = mode === 'dark';
    document.documentElement.dataset.theme = mode;
    const button = $('#theme-toggle');
    if (button) {
      button.textContent = dark ? ui().light : ui().dark;
      button.setAttribute('aria-label', dark ? ui().toLight : ui().toDark);
    }
  }
  applyTheme(storedTheme() || (systemTheme.matches ? 'dark' : 'light'));
  systemTheme.addEventListener('change', event => { if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light'); });

  async function loadJson(filename) {
    const response = await fetch(asset(filename), { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  }
  const routePath = () => location.hash.slice(1).split('?')[0] || '/';
  const currentLink = id => '#' + routePath() + '?id=' + encodeURIComponent(id);
  function announce(message) { $('#site-status').textContent = message; }
  function localize() {
    const copy = ui();
    document.documentElement.lang = { zh: 'zh-CN', en: 'en', ja: 'ja' }[language()];
    $('#language-select').value = language();
    $('.search-button-label').textContent = copy.search;
    $('#search-open').setAttribute('aria-label', copy.search);
    $('#search-title').textContent = copy.title;
    $('#search-close').textContent = copy.close;
    $('#search-close').setAttribute('aria-label', copy.close);
    $('label[for="search-input"]').textContent = copy.keyword;
    $('#search-input').placeholder = copy.keyword;
    if (!$('#search-input').value) $('#search-status').textContent = copy.hint;
    $('.toc-title').textContent = copy.toc;
    $('.brand-caption').textContent = { zh: '开发学习笔记', en: 'Developer notes', ja: '開発ノート' }[language()];
    $('.site-brand').href = config.basePath + '#' + (language() === 'zh' ? '/' : '/' + language() + '/');
    $('.site-brand').setAttribute('aria-label', 'Notes · ' + copy.title);
    $('.playground-link').href = config.basePath + '#' + (language() === 'zh' ? '' : '/' + language()) + '/playground';
    applyTheme(document.documentElement.dataset.theme);
  }
  function translationNotice() {
    const article = $('#main');
    article.querySelector('.translation-notice')?.remove();
    const lang = language();
    if (lang === 'zh') return;
    const item = navigation.locales[lang].find(doc => doc.route === routePath() && !doc.fallback);
    const missing = new URLSearchParams(location.hash.split('?')[1]).get('source');
    const source = item ? navigation.documents.find(doc => doc.source === item.source) : navigation.documents.find(doc => doc.file === 'zh/' + missing + '.md');
    if (!item && !source) return;
    const notice = document.createElement('aside');
    notice.className = 'translation-notice' + (item?.status === 'outdated' ? ' is-outdated' : '');
    notice.setAttribute('role', 'note');
    const text = document.createElement('p');
    text.textContent = !item ? ui().missing : item.status === 'outdated' ? ui().outdated : item.status === 'human_reviewed' ? ui().reviewed : ui().machine;
    const link = document.createElement('a');
    link.href = '#' + source.route;
    link.textContent = ui().chinese;
    notice.append(text, link);
    article.querySelector('h1')?.after(notice);
  }
  function revealAnchor() {
    const id = new URLSearchParams(location.hash.split('?')[1]).get('id');
    let target = id && document.getElementById(id);
    while (target) {
      const details = target.closest('details');
      if (!details) break;
      details.open = true;
      target = details.parentElement;
    }
  }
  window.addEventListener('hashchange', revealAnchor);

  function decorateArticle() {
    const article = $('#main');
    if (!article) return;
    for (const table of article.querySelectorAll('table')) {
      const container = document.createElement('div');
      container.className = 'table-scroll';
      container.tabIndex = 0;
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', '表格，可横向滚动');
      table.before(container);
      container.append(table);
    }
    for (const image of article.querySelectorAll('img')) { image.loading = 'lazy'; image.decoding = 'async'; }
    for (const pre of article.querySelectorAll('pre')) {
      const code = pre.querySelector('code');
      if (!code) continue;
      const button = document.createElement('button');
      button.className = 'copy-code';
      button.type = 'button';
      button.textContent = ui().copy;
      button.setAttribute('aria-label', ui().copyLabel);
      button.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(code.textContent);
          else {
            const input = document.createElement('textarea');
            input.value = code.textContent;
            input.className = 'clipboard-fallback';
            document.body.append(input);
            input.select();
            const copied = document.execCommand('copy');
            input.remove();
            button.focus();
            if (!copied) throw new Error('Clipboard unavailable');
          }
          button.textContent = ui().copied;
          announce(ui().copied);
        } catch {
          button.textContent = '请选中后复制';
          announce('复制未完成，请选中代码手动复制');
        }
        setTimeout(() => { if (button.isConnected) button.textContent = ui().copy; }, 2000);
      });
      pre.append(button);
    }
    const title = article.querySelector('h1')?.textContent || '中文笔记';
    document.title = title + ' · Notes';
  }

  function updateToc() {
    observer?.disconnect();
    const container = $('#page-toc-links');
    container.replaceChildren();
    const headings = [...document.querySelectorAll('#main h2[id], #main h3[id]')].filter(heading => !heading.closest('.source-readme'));
    const links = new Map();
    for (const heading of headings) {
      const link = document.createElement('a');
      link.href = currentLink(heading.id);
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'toc-subheading';
      container.append(link);
      links.set(heading.id, link);
    }
    if (!headings.length) container.textContent = ui().emptyToc;
    const activate = id => {
      for (const [key, link] of links) {
        link.classList.toggle('is-active', key === id);
        if (key === id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    if (headings[0]) activate(headings[0].id);
    observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) activate(visible[0].target.id);
    }, { rootMargin: '-85px 0px -65% 0px', threshold: 0 });
    headings.forEach(heading => observer.observe(heading));
    const activeId = new URLSearchParams(location.hash.split('?')[1]).get('id');
    if (activeId) activate(activeId);
  }

  function updateSidebar() {
    for (const link of document.querySelectorAll('.sidebar-nav a')) {
      const active = link.hash.slice(1).split('?')[0] === routePath();
      link.classList.toggle('is-current', active);
      const currentTarget = link.closest('li') || link;
      if (active) currentTarget.setAttribute('aria-current', 'page');
      else currentTarget.removeAttribute('aria-current');
      const details = link.closest('details');
      if (active && details) details.open = true;
    }
    for (const details of document.querySelectorAll('.nav-category')) {
      const name = details.querySelector('summary').textContent;
      const current = !!details.querySelector('a.is-current');
      if (!current && categoryState.has(name)) details.open = categoryState.get(name);
      if (!details.dataset.bound) {
        details.dataset.bound = 'true';
        details.addEventListener('toggle', () => categoryState.set(name, details.open));
      }
    }
    const sidebar = $('.sidebar-nav');
    sidebar?.setAttribute('aria-label', '文章分类导航');
    const aside = $('.sidebar');
    const selected = sidebar?.querySelector('a.is-current');
    if (aside && selected && aside.classList.contains('show')) {
      const item = selected.getBoundingClientRect();
      const bounds = aside.getBoundingClientRect();
      if (item.top < bounds.top || item.bottom > bounds.bottom) aside.scrollTop += item.top - bounds.top - aside.clientHeight / 2;
    }
    const toggle = $('.sidebar-toggle-button');
    if (toggle) {
      toggle.setAttribute('aria-label', '展开或收起文章导航');
      toggle.setAttribute('aria-keyshortcuts', '\\');
    }
    const toggleButton = $('.sidebar-toggle');
    if (toggleButton) toggleButton.title = '展开或收起导航（快捷键 \\）';
  }

  function updatePagination() {
    const article = $('#main');
    article.querySelector('.article-navigation')?.remove();
    const docs = navigation.locales[language()];
    const index = docs.findIndex(doc => doc.route === routePath());
    if (index < 0 && routePath() !== '/' && routePath() !== '/' + language() + '/') return;
    const nav = document.createElement('nav');
    nav.className = 'article-navigation';
    nav.setAttribute('aria-label', '相邻文章');
    const previous = index > 0 ? docs[index - 1] : null;
    const next = index < 0 ? docs[0] : docs[index + 1];
    for (const [doc, caption] of [[previous, ui().previous], [next, ui().next]]) {
      const item = document.createElement('div');
      if (doc) {
        const link = document.createElement('a');
        link.href = '#' + doc.route;
        const small = document.createElement('small');
        small.textContent = caption;
        const label = document.createElement('span');
        label.textContent = doc.label;
        link.append(small, label);
        item.append(link);
      }
      nav.append(item);
    }
    if (index >= 0) {
      const source = document.createElement('a');
      source.className = 'article-source';
      source.href = config.repository + '/blob/' + encodeURIComponent(config.revision) + '/' + docs[index].source.split('/').map(encodeURIComponent).join('/');
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = ui().source;
      article.append(source);
    }
    article.append(nav);
  }

  function sitePlugin(hook) {
    hook.beforeEach(content => {
      playgroundCleanup?.();
      playgroundCleanup = null;
      document.body.classList.remove('playground-page');
      return content;
    });
    hook.doneEach(async () => {
      localize();
      revealAnchor();
      decorateArticle();
      updateToc();
      updateSidebar();
      try {
        navigation ||= await loadJson('navigation.json');
        translationNotice();
        updatePagination();
        const root = $('#playground-root');
        if (root) {
          document.body.classList.add('playground-page');
          const { mountPlayground } = await import(asset('playground-host.js'));
          if (root.isConnected) {
            playgroundCleanup = await mountPlayground(root, { assetPath: config.assetPath, language: language() });
            root.setAttribute('aria-busy', 'false');
          }
        } else {
          const current = navigation.locales[language()].find(doc => doc.route === routePath());
          if (current?.playground) {
            const aside = document.createElement('aside');
            aside.className = 'article-playground';
            const link = document.createElement('a');
            link.href = '#' + (language() === 'zh' ? '' : '/' + language()) + '/playground?demo=' + current.playground;
            link.textContent = { zh: '在 Playground 中修改并运行示例 →', en: 'Edit and run an example in Playground →', ja: 'Playground でサンプルを編集・実行 →' }[language()];
            aside.append(link);
            $('#main h1')?.after(aside);
          }
        }
      } catch {
        const root = $('#playground-root');
        if (root) { root.textContent = '示例加载失败，请刷新页面重试。'; root.setAttribute('aria-busy', 'false'); }
        else announce('文章顺序暂时无法加载，请使用左侧导航');
      }
    });
    hook.ready(updateSidebar);
  }

  window.$docsify = {
    name: '技术笔记',
    nameLink: config.basePath + '#/',
    basePath: config.basePath,
    homepage: resource('README.md'),
    loadSidebar: true,
    auto2top: true,
    subMaxLevel: 0,
    routerMode: 'hash',
    notFoundPage: resource('_404.md'),
    skipLink: '跳到正文',
    requestHeaders: { 'Cache-Control': 'no-cache' },
    noCompileLinks: ['^' + config.basePath + 'assets/.*'],
    alias: { '/playground': resource('playground.md'), '/en/_sidebar.md': resource('en/_sidebar.md'), '/ja/_sidebar.md': resource('ja/_sidebar.md'), '/.*/_sidebar.md': resource('_sidebar.md'), '/_sidebar.md': resource('_sidebar.md'), '/en/': resource('en/README.md'), '/ja/': resource('ja/README.md'), '/en/(.*)': resource('en/$1.md'), '/ja/(.*)': resource('ja/$1.md'), '/zh/(.*)': resource('zh/$1.md') },
    markdown(marked, renderer) {
      const originalImage = renderer.image;
      renderer.image = token => originalImage({ ...token, href: token.href.startsWith(config.basePath + 'assets/') ? new URL(token.href, location.origin).href : token.href });
      marked.setOptions({ renderer });
      return marked;
    },
    plugins: [sitePlugin],
  };

  document.addEventListener('DOMContentLoaded', () => {
    $('#language-select').addEventListener('change', async event => {
      navigation ||= await loadJson('navigation.json');
      const lang = event.target.value;
      if (/^\/(?:en\/|ja\/)?playground$/.test(routePath())) {
        location.hash = (lang === 'zh' ? '' : '/' + lang) + '/playground' + (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : '');
        return;
      }
      const current = Object.values(navigation.locales).flat().find(doc => !doc.fallback && doc.route === routePath());
      const target = current && navigation.locales[lang].find(doc => doc.source === current.source);
      const id = new URLSearchParams(location.hash.split('?')[1]).get('id');
      const anchor = id && target && Object.values(target.anchors || {}).includes(id) ? '?id=' + encodeURIComponent(id) : '';
      location.hash = target && !target.fallback ? target.route + anchor : (lang === 'zh' ? '/' : '/' + lang + '/') + (current ? '?source=' + current.file.split('/').at(-1).replace(/\.md$/, '') : '');
    });
    applyTheme(document.documentElement.dataset.theme);
    $('#theme-toggle').addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('notes-theme', theme); } catch { /* Persistence is optional. */ }
      applyTheme(theme);
    });
    const dialog = $('#search-dialog');
    const input = $('#search-input');
    const status = $('#search-status');
    const results = $('#search-results');
    const open = () => { if (!dialog.open) dialog.showModal(); input.focus(); };
    $('#search-open').addEventListener('click', open);
    $('#search-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); dialog.close(); } }, true);
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    document.addEventListener('keydown', event => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable]')) { event.preventDefault(); open(); }
    });
    results.addEventListener('click', event => { if (event.target.closest('a')) dialog.close(); });
    let request = 0;
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      const current = ++request;
      const query = input.value.trim().toLocaleLowerCase();
      results.replaceChildren();
      if (!query) { status.textContent = ui().hint; return; }
      status.textContent = ui().searching;
      debounce = setTimeout(async () => {
        try {
          searchIndex ||= await loadJson('search-index.json');
          if (current !== request) return;
          const words = query.split(/\s+/).filter(Boolean);
          const matches = searchIndex.map(section => {
            const title = (section.title + ' ' + section.heading).toLocaleLowerCase();
            const text = section.text.toLocaleLowerCase();
            return { section, score: words.every(word => (title + ' ' + text).includes(word)) ? words.reduce((score, word) => score + (title.includes(word) ? 10 : 1), 0) : 0 };
          }).filter(item => item.score).sort((a, b) => b.score - a.score);
          status.textContent = matches.length ? ui().matches(matches.length) : ui().noResults;
          for (const { section } of matches.slice(0, 15)) {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + section.route;
            const title = document.createElement('strong');
            title.textContent = section.title + (section.heading ? ' · ' + section.heading : '');
            const caption = document.createElement('small');
            caption.textContent = section.category;
            const snippet = document.createElement('p');
            const start = Math.max(0, section.text.toLocaleLowerCase().indexOf(words[0]) - 35);
            snippet.textContent = (start ? '…' : '') + section.text.slice(start, start + 160).replace(/\s+/g, ' ') + '…';
            link.append(title, caption, snippet);
            item.append(link);
            results.append(item);
          }
        } catch { if (current === request) status.textContent = ui().failed; }
      }, 120);
    });
  });
})();
