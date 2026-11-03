import { defineStore } from 'pinia';
import { api } from './api';

export interface Task { id: number; title: string; done: boolean; version: number }

function parseTask(value: unknown): Task {
  if (!value || typeof value !== 'object') throw new Error('任务格式不正确');
  const item = value as Record<string, unknown>;
  if (!Number.isSafeInteger(item.id) || typeof item.title !== 'string'
      || typeof item.done !== 'boolean' || !Number.isSafeInteger(item.version)) {
    throw new Error('任务字段不正确');
  }
  return item as unknown as Task;
}

export const useTasks = defineStore('tasks', {
  state: () => ({ items: [] as Task[] }),
  actions: {
    async load() {
      const value = await api<unknown>('/api/tasks');
      if (!Array.isArray(value)) throw new Error('任务列表格式不正确');
      this.items = value.map(parseTask);
    },
    async add(title: string) {
      await api<unknown>('/api/tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      await this.load();
    },
    async toggle(task: Task) {
      await api<unknown>('/api/tasks/' + task.id, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, done: !task.done, version: task.version })
      });
      await this.load();
    }
  }
});
