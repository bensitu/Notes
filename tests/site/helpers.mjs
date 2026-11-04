import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function fixture(t, files) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'notes-site-test-'));
  t.after(async () => {
    assert.ok(path.resolve(root).startsWith(path.join(os.tmpdir(), 'notes-site-test-')));
    await fs.rm(root, { recursive: true, force: true });
  });
  for (const [name, body] of Object.entries(files)) {
    await fs.mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await fs.writeFile(path.join(root, name), body);
  }
  return root;
}
