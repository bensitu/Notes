import { useState } from 'react';
import type { FormEvent } from 'react';

export function TaskForm({ busy, onAdd }: {
  busy: boolean; onAdd: (title: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = title.trim();
    if (!text || text.length > 100) { setError('请输入 1 到 100 个字符'); return; }
    setError('');
    if (await onAdd(text)) setTitle('');
  }
  return <form onSubmit={submit}>
    <label htmlFor="title">任务标题</label>
    <input id="title" value={title} onChange={event => setTitle(event.target.value)}
      required maxLength={100} />
    <button disabled={busy}>新增</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
