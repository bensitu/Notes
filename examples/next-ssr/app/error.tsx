'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section><h1>页面暂时无法读取</h1><button onClick={reset}>重试</button></section>;
}
