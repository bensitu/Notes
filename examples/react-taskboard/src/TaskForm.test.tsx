import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

it('preserves input after a failed submission', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn().mockResolvedValue(false);
  render(<TaskForm busy={false} onAdd={onAdd} />);
  await user.type(screen.getByLabelText('任务标题'), 'Keep this title');
  await user.click(screen.getByRole('button', { name: '新增' }));
  expect(screen.getByLabelText('任务标题')).toHaveValue('Keep this title');
});

it('clears input only after a successful submission', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn().mockResolvedValue(true);
  render(<TaskForm busy={false} onAdd={onAdd} />);
  await user.type(screen.getByLabelText('任务标题'), '  New title  ');
  await user.click(screen.getByRole('button', { name: '新增' }));
  expect(onAdd).toHaveBeenCalledWith('New title');
  expect(screen.getByLabelText('任务标题')).toHaveValue('');
});
