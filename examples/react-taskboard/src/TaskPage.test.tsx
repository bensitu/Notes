import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskPage } from './TaskPage';

it('reports a service failure and restores the login control', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
  render(<TaskPage />);
  expect(await screen.findByRole('alert')).toHaveTextContent('503');
  expect(screen.getByRole('button', { name: '登录' })).toBeEnabled();
});
