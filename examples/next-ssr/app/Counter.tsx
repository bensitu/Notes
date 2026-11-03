'use client';

import { useEffect, useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return <button data-hydrated={String(hydrated)} onClick={() => setCount(value => value + 1)}>点击次数：{count}</button>;
}
