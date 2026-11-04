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
  const categoryState = new Map();
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const storedTheme = () => { try { return localStorage.getItem('notes-theme'); } catch { return null; } };
  function applyTheme(mode) {
    const dark = mode === 'dark';
    document.documentElement.dataset.theme = mode;
    const button = $('#theme-toggle');
    if (button) {
      button.textContent = dark ? '浅色模式' : '深色模式';
      button.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
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
      button.textContent = '复制';
      button.setAttribute('aria-label', '复制此代码块');
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
          button.textContent = '已复制';
          announce('代码已复制');
        } catch {
          button.textContent = '请选中后复制';
          announce('复制未完成，请选中代码手动复制');
        }
        setTimeout(() => { if (button.isConnected) button.textContent = '复制'; }, 2000);
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
    if (!headings.length) container.textContent = '本页没有子章节';
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
    if (toggle) toggle.setAttribute('aria-label', '展开或收起文章导航');
  }

  function updatePagination() {
    const article = $('#main');
    article.querySelector('.article-navigation')?.remove();
    const docs = navigation.documents;
    const index = docs.findIndex(doc => doc.route === routePath());
    if (index < 0 && routePath() !== '/') return;
    const nav = document.createElement('nav');
    nav.className = 'article-navigation';
    nav.setAttribute('aria-label', '相邻文章');
    const previous = index > 0 ? docs[index - 1] : null;
    const next = index < 0 ? docs[0] : docs[index + 1];
    for (const [doc, caption] of [[previous, '上一篇'], [next, '下一篇']]) {
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
      source.href = config.repository + '/blob/main/' + docs[index].source.split('/').map(encodeURIComponent).join('/');
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = '在 GitHub 查看源文档 ↗';
      article.append(source);
    }
    article.append(nav);
  }

  function sitePlugin(hook) {
    hook.doneEach(async () => {
      decorateArticle();
      updateToc();
      updateSidebar();
      try {
        navigation ||= await loadJson('navigation.json');
        updatePagination();
      } catch { announce('文章顺序暂时无法加载，请使用左侧导航'); }
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
    alias: { '/.*/_sidebar.md': resource('_sidebar.md'), '/_sidebar.md': resource('_sidebar.md'), '/zh/(.*)': resource('zh/$1.md') },
    markdown(marked, renderer) {
      const originalImage = renderer.image;
      renderer.image = token => originalImage({ ...token, href: token.href.startsWith(config.basePath + 'assets/') ? new URL(token.href, location.origin).href : token.href });
      marked.setOptions({ renderer });
      return marked;
    },
    plugins: [sitePlugin],
  };

  document.addEventListener('DOMContentLoaded', () => {
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
      if (!query) { status.textContent = '输入关键词搜索文章标题与全文。'; return; }
      status.textContent = '正在搜索…';
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
          status.textContent = matches.length ? '找到 ' + matches.length + ' 个章节，显示前 15 项。' : '没有找到结果，请换一个关键词。';
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
        } catch { if (current === request) status.textContent = '搜索暂时无法加载，请稍后重试。'; }
      }, 120);
    });
  });
})();
