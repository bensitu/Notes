import { afterEach, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TaskPage from './TaskPage.vue';

afterEach(() => vi.unstubAllGlobals());

it('announces a failed initial request and keeps the login form usable', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
  const wrapper = mount(TaskPage, { global: { plugins: [createPinia()] } });
  try {
    await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toContain('503');
    expect(wrapper.get('label[for="password"]').text()).toBe('密码');
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined();
  } finally { wrapper.unmount(); }
});
