import { escapeHtml, hash } from './site-lib.mjs';
import { locales } from './site-locales.mjs';

export function generateNav(documents, { language = 'zh', translations = new Map() } = {}) {
  const copy = locales[language];
  const home = language === 'zh' ? '/' : `/${language}/`;
  const categories = new Map();
  for (const doc of documents.filter(doc => doc.source !== 'README.md')) {
    if (!categories.has(doc.category)) categories.set(doc.category, []);
    categories.get(doc.category).push(doc);
  }
  const known = ['Java 与后端开发', '数据库与数据访问', '前端开发', 'Faces 页面开发', '中间件与服务入口', 'Python', '协作、测试与交付'];
  const names = [...categories.keys()].sort((a, b) => {
    const order = value => known.includes(value) ? known.indexOf(value) : value === '其他笔记' ? 1000 : 100;
    return order(a) - order(b) || a.localeCompare(b, 'zh-CN');
  });
  const ordered = [];
  let sidebar = `<a class="nav-home" href="#${home}">${copy.home}</a>\n\n`;
  const playground = language === 'zh' ? '/playground' : `/${language}/playground`;
  sidebar += `<a class="nav-playground" href="#${playground}">Playground</a>\n\n`;
  let index = `# ${copy.title}\n\n${copy.intro}\n\n`;
  index += `[Playground](${playground})\n\n`;
  index += language === 'zh' ? `共 **${documents.length - 1}** 篇文章，按技术领域自动整理。\n\n` : language === 'ja' ? `全 **${documents.length - 1}** 記事を技術分野ごとに整理しています。\n\n` : `**${documents.length - 1}** articles, organized by topic.\n\n`;
  for (const name of names) {
    const docs = categories.get(name).sort((a, b) => a.order - b.order || a.source.localeCompare(b.source, 'zh-CN'));
    ordered.push(...docs);
    const category = copy.categories[name] || name;
    sidebar += `<details class="nav-category" open><summary>${escapeHtml(category)} <span>${docs.length}</span></summary><ul>\n`;
    index += `## ${category} :id=category-${hash(name)}\n\n`;
    for (const doc of docs) {
      const translated = translations.get(doc.source);
      const route = translated?.route || doc.route;
      const label = translated?.label || doc.label;
      sidebar += `<li><a href="#${route}">${escapeHtml(label)}</a></li>\n`;
      index += `- [${label.replaceAll('[', '\\[').replaceAll(']', '\\]')}](${route})\n`;
    }
    sidebar += '</ul></details>\n\n';
    index += '\n';
  }
  return { sidebar, index, ordered };
}
