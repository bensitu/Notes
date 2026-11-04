import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fixture } from '../site/helpers.mjs';
import { createGithub, persistState, restoreState, openTranslationPr } from '../../scripts/translation/github.mjs';
import { TranslationState } from '../../scripts/translation/state.mjs';
import { createAzureTranslator } from '../../scripts/translation/azure.mjs';

test('open translation PRs pause without writing refs or touching their edits', async t => {
  const calls = [];
  const api = createGithub({ env: { GITHUB_REPOSITORY: 'owner/repo', GH_TOKEN: 'mock-token' }, fetchImpl: async (url, options) => {
    calls.push({ url, method: options.method });
    return new Response(JSON.stringify(url.includes('/files?') ? [{ filename: 'i18n/ja/old.md' }] : [{ number: 1, head: { ref: 'manual-review' }, labels: [] }]));
  } });
  const root = await fixture(t, { 'README.md': '# Home\n' });
  const result = await openTranslationPr(api, root, { completed: [] });
  assert.equal(result.skipped, 'open_translation_pr');
  assert.ok(calls.every(call => call.method === 'GET'));
  await assert.rejects(api.writeRef('main', 'sha', true), /restricted/);
  await assert.rejects(api.writeRef('feature/other', 'sha', false), /restricted/);
});

test('machine state contains only the usage counter and cache shards, with an orphan initial commit', async t => {
  const root = await fixture(t, { 'usage.json': '{"cycle":"2026-11","estimated_used":20,"paused_for_quota":false}\n', 'cache/ab.json': '{}\n' });
  const writes = [];
  const api = {
    request: async (method, url, body) => {
      if (method === 'GET') return null;
      writes.push({ method, url, body });
      return { sha: 'created-sha' };
    },
    writeRef: async (...args) => writes.push({ ref: args }),
  };
  await persistState(api, root);
  const tree = writes.find(write => write.url === '/git/trees').body.tree;
  assert.deepEqual(tree.map(entry => entry.path), ['usage.json', 'cache/ab.json']);
  assert.deepEqual(writes.find(write => write.url === '/git/commits').body.parents, []);
  assert.deepEqual(writes.at(-1).ref, ['translation-state', 'created-sha', false]);
  const unsafe = { request: async (_method, url) => url.includes('/git/ref/') ? { object: { sha: 'commit' } } : url.includes('/git/commits/') ? { tree: { sha: 'tree' } } : { tree: [{ type: 'blob', path: '../escape.json', sha: 'x' }] } };
  await assert.rejects(restoreState(unsafe, root), /Unexpected file/);
});

test('API budget is checkpointed before sending text, and failed checkpoints prevent a chargeable request', async t => {
  const root = await fixture(t, { 'README.md': '# Home\n' });
  const sequence = [];
  const state = await new TranslationState(path.join(root, 'state'), { checkpoint: async () => { sequence.push('checkpoint'); throw new Error('storage unavailable'); } }).load();
  const translator = createAzureTranslator({ env: { TRANSLATION_ENABLED: 'true', AZURE_TRANSLATOR_SKU: 'F0', TRANSLATION_F0_CONFIRMED: 'true', AZURE_TRANSLATOR_KEY: 'mock', AZURE_TRANSLATOR_REGION: 'mock' }, state, fetchImpl: async () => { sequence.push('api'); return new Response('[]'); } });
  await assert.rejects(translator.translate(['原文'], 'en'), /storage unavailable/);
  assert.deepEqual(sequence, ['checkpoint']);
  assert.ok(state.usage.estimated_used > 0);
});
