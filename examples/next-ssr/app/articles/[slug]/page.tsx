import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findArticle } from '../../../lib/articles';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  return { title: article?.title ?? '文章不存在' };
}
export default async function Article({ params }: Props) {
  await connection();
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();
  return <article><h1>{article.title}</h1><p>{article.body}</p></article>;
}
