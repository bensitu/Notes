import { beforeEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTasks } from './tasks';

beforeEach(() => { setActivePinia(createPinia()); vi.restoreAllMocks(); });

it('keeps the previous list when the request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
  const store = useTasks();
  store.items = [{ id: 1, title: 'Previous', done: false, version: 0 }];
  await expect(store.load()).rejects.toThrow('503');
  expect(store.items).toHaveLength(1);
  vi.unstubAllGlobals();
});

it('rejects malformed data instead of silently displaying it', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json([{ id: 'wrong' }])));
  await expect(useTasks().load()).rejects.toThrow('字段');
  vi.unstubAllGlobals();
});
