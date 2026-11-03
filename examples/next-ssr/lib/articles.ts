import 'server-only';

const articles = [
  { slug: 'ssr', title: '理解 SSR', body: '初次 HTML 由服务器生成，交互仍需浏览器脚本。' },
  { slug: 'hydration', title: '理解水合', body: '浏览器用一致的初始数据接管服务器 HTML。' }
] as const;

export function listArticles() { return articles; }
export function findArticle(slug: string) { return articles.find(item => item.slug === slug); }
