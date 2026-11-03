import { connection } from 'next/server';
import Link from 'next/link';
import Counter from './Counter';
import { listArticles } from '../lib/articles';

export default async function Page() {
  await connection();
  const renderedAt = new Date().toISOString();
  return <section>
    <h1>Next.js 服务端渲染</h1>
    <p>本次请求的服务器时间：<time data-testid="rendered-at">{renderedAt}</time></p>
    <ul>{listArticles().map(article => <li key={article.slug}>
      <Link href={'/articles/' + article.slug}>{article.title}</Link>
    </li>)}</ul>
    <Counter />
  </section>;
}
