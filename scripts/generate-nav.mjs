import { escapeHtml, hash } from './site-lib.mjs';

export function generateNav(documents) {
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
  let sidebar = '<a class="nav-home" href="#/">全部笔记</a>\n\n';
  let index = '# 开发学习与工程实践笔记\n\n从概念入门，也可在开发时查阅配置、示例和常见问题。选择左侧分类，或搜索全文。\n\n';
  index += `共 **${documents.length - 1}** 篇文章，按技术领域自动整理。\n\n`;
  for (const name of names) {
    const docs = categories.get(name).sort((a, b) => a.order - b.order || a.source.localeCompare(b.source, 'zh-CN'));
    ordered.push(...docs);
    sidebar += `<details class="nav-category" open><summary>${escapeHtml(name)} <span>${docs.length}</span></summary><ul>\n`;
    index += `## ${name} :id=category-${hash(name)}\n\n`;
    for (const doc of docs) {
      sidebar += `<li><a href="#${doc.route}">${escapeHtml(doc.label)}</a></li>\n`;
      index += `- [${doc.label.replaceAll('[', '\\[').replaceAll(']', '\\]')}](${doc.route})\n`;
    }
    sidebar += '</ul></details>\n\n';
    index += '\n';
  }
  return { sidebar, index, ordered };
}
