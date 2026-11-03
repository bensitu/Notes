import type { Article } from '../../shared/types/article';

export const articles: readonly Article[] = Object.freeze([
  Object.freeze({ slug: 'ssr', title: '理解 SSR', body: '初次 HTML 由服务器生成。' }),
  Object.freeze({ slug: 'hydration', title: '理解水合', body: '客户端沿用 payload 中的初始数据。' })
]);
