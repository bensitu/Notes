import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './style.css';

export const metadata: Metadata = { title: 'Next SSR 示例', description: '观察 HTML、服务器组件与水合' };
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN"><body><main>
    <nav><Link href="/">动态首页</Link> · <Link href="/static">静态页面</Link></nav>
    {children}
  </main></body></html>;
}
