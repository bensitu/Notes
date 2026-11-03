import { api } from './api';

export interface Task { id: number; title: string; done: boolean; version: number }

export async function loadTasks(signal?: AbortSignal): Promise<Task[]> {
  const value = await api<unknown>('/api/tasks', { signal });
  if (!Array.isArray(value)) throw new Error('任务列表格式不正确');
  return value.map(item => {
    if (!item || typeof item !== 'object'
        || !Number.isSafeInteger(item.id) || typeof item.title !== 'string'
        || typeof item.done !== 'boolean' || !Number.isSafeInteger(item.version)) {
      throw new Error('任务字段不正确');
    }
    return item as Task;
  });
}

export async function addTask(title: string): Promise<void> {
  await api('/api/tasks', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
}

export async function toggleTask(task: Task): Promise<void> {
  await api('/api/tasks/' + task.id, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: task.title, done: !task.done, version: task.version })
  });
}
