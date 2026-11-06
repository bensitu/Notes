import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fixture } from '../site/helpers.mjs';
import { exportBatch, importBatch } from '../../scripts/translation/batch.mjs';
import { readManifest } from '../../scripts/translation/catalog.mjs';
import { validateTranslations } from '../../scripts/translation/validate.mjs';

async function setup(t) {
  const root = await fixture(t, {
    'README.md': '# Home\n',
    'scripts/translation/glossary.json': '{"version":1,"terms":[]}',
    '文章.md': '# 原文标题\n\n<a id="section-1"></a>\n\n## 原文章节\n\n原文说明 **原文强调** 与 `const x = "中文"`。\n\n```js\n// Keep code unchanged.\nconst x = "中文";\n```\n',
  });
  const batch = await exportBatch(root);
  for (const doc of batch.documents) for (const unit of doc.units) unit.translated = unit.text.replaceAll('原文', doc.language === 'en' ? 'Translated ' : '翻訳');
  return { root, batch };
}

test('file translation import preserves code, anchors and publication metadata without service calls', async t => {
  const { root, batch } = await setup(t);
  assert.equal(await importBatch(root, batch, { method: 'offline-test', revision: 'test' }), 2);
  const manifest = await readManifest(root);
  assert.equal(manifest.entries.length, 2);
  for (const entry of manifest.entries) {
    assert.equal(entry.human_reviewed, false);
    assert.equal(entry.translation_method, 'offline-test');
    const text = await fs.readFile(path.join(root, 'i18n', entry.language, entry.slug + '.md'), 'utf8');
    assert.ok(text.includes('const x = "中文";'));
    assert.ok(text.includes('id="section-1"'));
  }
  await validateTranslations(root);
});

test('file import rejects stale sources, missing placeholders and locked translations before writing', async t => {
  const { root, batch } = await setup(t);
  const stale = structuredClone(batch);
  stale.documents[1].source_hash = '0'.repeat(64);
  await assert.rejects(importBatch(root, stale, { revision: 'test' }), /Source changed/);
  await assert.rejects(fs.access(path.join(root, 'i18n/en')));
  const broken = structuredClone(batch);
  const unit = broken.documents[0].units.find(unit => unit.text.includes('[[NT'));
  unit.translated = unit.translated.replace(/\[\[NT\d+\]\]/, '');
  await assert.rejects(importBatch(root, broken, { revision: 'test' }), /placeholder_integrity/);
  await importBatch(root, batch, { revision: 'test' });
  const manifest = await readManifest(root);
  manifest.entries[0].human_reviewed = true;
  await fs.writeFile(path.join(root, 'i18n/manifest.json'), JSON.stringify(manifest));
  await assert.rejects(importBatch(root, batch, { revision: 'test' }), /locked/);
});

test('CRLF translation imports remain valid after LF checkout, without accepting code changes', async t => {
  const { root } = await setup(t);
  const source = path.join(root, '文章.md');
  const original = await fs.readFile(source, 'utf8');
  await fs.writeFile(source, original.replaceAll('\n', '\r\n'));
  const batch = await exportBatch(root);
  for (const doc of batch.documents) for (const unit of doc.units) unit.translated = unit.text;
  await importBatch(root, batch, { revision: 'crlf' });
  const fingerprints = batch.documents.map(doc => doc.units.map(unit => unit.id));
  await fs.writeFile(source, original);
  for (const entry of (await readManifest(root)).entries) {
    const file = path.join(root, 'i18n', entry.language, entry.slug + '.md');
    await fs.writeFile(file, (await fs.readFile(file, 'utf8')).replace(/\r\n?/g, '\n'));
  }
  assert.deepEqual((await exportBatch(root)).documents.map(doc => doc.units.map(unit => unit.id)), fingerprints);
  await validateTranslations(root, { complete: true });
  const entry = (await readManifest(root)).entries[0];
  const file = path.join(root, 'i18n', entry.language, entry.slug + '.md');
  await fs.writeFile(file, (await fs.readFile(file, 'utf8')).replace('const x = "中文";', 'const x = "changed";'));
  await assert.rejects(validateTranslations(root), /translation_structure_changed/);
});
