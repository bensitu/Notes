import { useEffect, useRef, useState } from 'react';
import { ApiError, login, logout } from './api';
import { addTask, loadTasks, toggleTask } from './tasks';
import type { Task } from './tasks';
import { TaskForm } from './TaskForm';

export function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const pending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    loadTasks(controller.signal).then(items => {
      if (active) { setTasks(items); setLoggedIn(true); }
    }).catch(reason => {
      if (!active) return;
      if (reason instanceof ApiError && reason.status === 401) setLoggedIn(false);
      else setError(reason instanceof Error ? reason.message : '读取失败');
    }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; controller.abort(); };
  }, []);

  async function run(action: () => Promise<void>): Promise<boolean> {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError('');
    try { await action(); return true; }
    catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) {
        setLoggedIn(false); setTasks([]);
      }
      setError(reason instanceof Error ? reason.message : '操作失败');
      return false;
    } finally { pending.current = false; setBusy(false); }
  }

  const remaining = tasks.filter(task => !task.done).length;
  return <section>
    <h1>React 任务管理</h1>
    {error && <p role="alert">{error}</p>}
    {!loggedIn ? <form onSubmit={event => {
      event.preventDefault();
      void run(async () => {
        await login(password);
        setPassword('');
        setTasks(await loadTasks());
        setLoggedIn(true);
      });
    }}>
      <label htmlFor="password">密码</label>
      <input id="password" type="password" value={password}
        onChange={event => setPassword(event.target.value)} autoComplete="current-password" required />
      <button disabled={busy}>登录</button>
    </form> : <>
      <TaskForm busy={busy} onAdd={title => run(async () => {
        await addTask(title); setTasks(await loadTasks());
      })} />
      <p aria-live="polite">{busy ? '处理中' : '待完成 ' + remaining + ' 条（最多显示最新 100 条）'}</p>
      <ul>{tasks.map(task => <li key={task.id}>
        <span className={task.done ? 'done' : ''}>{task.title}</span>
        <button disabled={busy} aria-label={(task.done ? '恢复：' : '完成：') + task.title}
          onClick={() => void run(async () => {
            await toggleTask(task); setTasks(await loadTasks());
          })}>{task.done ? '恢复' : '完成'}</button>
      </li>)}</ul>
      <button disabled={busy} onClick={() => void run(async () => {
        await logout(); setLoggedIn(false); setTasks([]);
      })}>退出登录</button>
    </>}
  </section>;
}
