import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fixture } from '../site/helpers.mjs';
import { hash, loadNotes, parser, printer } from '../../scripts/site-lib.mjs';
import { applyUnit, finishDocument, prepareDocument, sourceHash, splitUnit, structure, validateMarkers, validateTranslation } from '../../scripts/translation/markdown.mjs';
import { cycleKey, TranslationState } from '../../scripts/translation/state.mjs';
import { azureEnabled, createAzureTranslator, wireText } from '../../scripts/translation/azure.mjs';
import { makeQueue, readManifest, runTranslation } from '../../scripts/translation/pipeline.mjs';

const glossary = JSON.parse(await fs.readFile(new URL('../../scripts/translation/glossary.json', import.meta.url), 'utf8'));
const env = { TRANSLATION_ENABLED: 'true', AZURE_TRANSLATOR_SKU: 'F0', TRANSLATION_F0_CONFIRMED: 'true', AZURE_TRANSLATOR_KEY: 'mock-key', AZURE_TRANSLATOR_REGION: 'mock-region' };
const response = (status, data) => new Response(JSON.stringify(data), { status });
const mockFetch = async (_url, options) => response(200, JSON.parse(options.body).map(item => ({ translations: [{ to: new URL(_url).searchParams.get('to'), text: item.Text.replaceAll('原文', 'Translated').replaceAll('段落', 'Paragraph').replaceAll('标题', 'Heading') }] })));
async function setup(t, extra = {}, options = {}) {
  const root = await fixture(t, { 'README.md': '# Home\n', 'React基础与组件.md': '# 标题\n\n原文段落 **React**，使用 [API](README.md) 和 \u0060value\u0060。\n\n第二段落。\n', 'Resources/a.png': 'fixture', ...extra });
  const state = await new TranslationState(path.join(root, '.translation-state'), options).load();
  const translator = createAzureTranslator({ env, state, fetchImpl: mockFetch, sleep: async () => {} });
  return { root, state, translator, glossary };
}

test('whole semantic blocks preserve formatting, code, table cells, HTML and source IDs', async t => {
  const body = '# 标题 :id=chosen\n\n<a id="section-1"></a>\n\n原文 **粗体** [链接](README.md) 和 \u0060const x = 1\u0060。\n\n- 原文 *强调*\n  - 子段落\n\n| 标题 | 值 |\n| --- | --- |\n| 原文 | ![图](Resources/a.png) |\n\n<div class="box">原文 <b>段落</b></div>\n\n\u0060\u0060\u0060js\n// Keep this comment.\nconst x = "中文";\n\u0060\u0060\u0060\n';
  const options = await setup(t, { 'React基础与组件.md': body });
  const { documents } = await loadNotes(options.root);
  const doc = documents.find(item => item.source === 'React基础与组件.md');
  const referenceTree = parser.parse('原文 [引用][] 与 [快捷]。\n\n[引用]: README.md\n[快捷]: README.md\n');
  const referenceDoc = { ...doc, tree: referenceTree, headings: [] };
  const referencePrepared = prepareDocument(referenceDoc, 'ja', glossary);
  for (const unit of referencePrepared.units) applyUnit(unit, unit.template.replaceAll('引用', '参照').replaceAll('快捷', 'ショートカット'));
  const references = finishDocument(referencePrepared);
  validateTranslation(references, { structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(referenceTree)))), 64), heading_ids: [] });
  assert.ok(references.includes('[参照][引用]'));
  assert.ok(references.includes('[ショートカット][快捷]'));
  const prepared = prepareDocument(doc, 'ja', glossary);
  const paragraph = prepared.units.find(unit => unit.template.includes('粗体'));
  assert.ok(paragraph.template.includes('原文'));
  assert.ok(paragraph.template.includes('[[NT'));
  assert.ok(!paragraph.template.includes('README.md'));
  assert.ok(!paragraph.template.includes('const x'));
  for (const unit of prepared.units) applyUnit(unit, unit.template.replaceAll('原文', '翻訳').replaceAll('标题', '見出し'));
  const result = finishDocument(prepared);
  const entry = { structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(doc.tree)))), 64), heading_ids: doc.headings.map(heading => heading.id) };
  validateTranslation(result, entry);
  assert.ok(result.includes('id="section-1"'));
  assert.ok(result.includes(':id=chosen'));
  assert.ok(result.includes('// Keep this comment.\nconst x = "中文";'));
  assert.ok(result.includes('<div class="box">翻訳 <b>段落</b></div>'));
  assert.equal(await fs.readFile(path.join(options.root, doc.source), 'utf8'), body);
  assert.throws(() => validateMarkers(paragraph.template, paragraph.template + '[[NT9999]]'), /placeholder/);
  const long = '原文。'.repeat(1500) + '[[NT0001]]';
  const chunks = splitUnit(long);
  assert.equal(chunks.join(''), long);
  assert.ok(chunks.every(chunk => chunk.length <= 1800));
});

test('incremental runs reuse blocks, protect reviewed files and pause for an open PR', async t => {
  const options = await setup(t);
  const first = await runTranslation(options);
  assert.equal(first.completed.length, 2);
  const previousUsage = options.state.usage.estimated_used;
  const second = await runTranslation(options);
  assert.equal(second.completed.length, 0);
  assert.equal(options.state.usage.estimated_used, previousUsage);
  const manifest = await readManifest(options.root);
  const ja = manifest.entries.find(entry => entry.language === 'ja');
  ja.human_reviewed = true;
  await fs.writeFile(path.join(options.root, 'i18n/manifest.json'), JSON.stringify(manifest));
  const file = path.join(options.root, 'i18n/ja', ja.slug + '.md');
  const reviewed = await fs.readFile(file, 'utf8');
  await fs.appendFile(path.join(options.root, ja.source), '\n新增段落。\n');
  const blocked = await runTranslation({ ...options, openPr: true });
  assert.equal(blocked.stop, 'open_translation_pr');
  assert.equal(options.state.usage.estimated_used, previousUsage);
  const updated = await runTranslation(options);
  assert.equal(updated.completed.length, 1);
  assert.equal(updated.completed[0].language, 'en');
  assert.ok(updated.used_this_run < first.used_this_run / 2);
  assert.equal(await fs.readFile(file, 'utf8'), reviewed);
  assert.equal((await readManifest(options.root)).entries.find(entry => entry.language === 'ja').human_reviewed, true);
});

test('new documents precede changed translations and historical backlog, independently per language', async t => {
  const options = await setup(t, { 'New.md': '# New\n', 'Old.md': '# Old\n' });
  const { documents } = await loadNotes(options.root);
  const old = documents.find(doc => doc.source === 'Old.md');
  const queue = makeQueue(documents, { entries: [{ source: old.source, language: 'en', source_hash: 'old', human_reviewed: false }] }, { approved: true, knownSources: ['README.md', 'Old.md', 'React基础与组件.md'] });
  assert.equal(queue[0].doc.source, 'New.md');
  assert.equal(queue[2].doc.source, 'Old.md');
  assert.equal(makeQueue(documents, { entries: [] }).some(task => task.doc.source === 'New.md'), false);
  assert.equal(sourceHash({ original: 'x\r\ny' }), sourceHash({ original: 'x\ny' }));
});

test('combined-language budget is reserved before calls, and cycles resume automatically', async t => {
  const options = await setup(t, {}, { budget: 10 });
  let calls = 0;
  options.translator = createAzureTranslator({ env, state: options.state, sleep: async () => {}, fetchImpl: async (...args) => { calls++; return mockFetch(...args); } });
  const report = await runTranslation(options);
  assert.equal(report.stop, 'soft_budget_exhausted');
  assert.equal(calls, 0);
  assert.equal(report.completed.length, 0);
  assert.equal(cycleKey(new Date('2026-11-14T16:00:00Z'), 15, 'Asia/Tokyo'), '2026-11');
  assert.equal(cycleKey(new Date('2026-11-14T14:00:00Z'), 15, 'Asia/Tokyo'), '2026-10');
  assert.equal(cycleKey(new Date('2026-02-27T12:00:00Z'), 31), '2026-01');
  assert.equal(cycleKey(new Date('2026-02-28T12:00:00Z'), 31), '2026-02');
  options.state.usage = { cycle: '2026-10', estimated_used: 1800000, paused_for_quota: true, known_sources: ['Old.md'] };
  await options.state.save();
  const reset = await new TranslationState(options.state.directory, { now: new Date('2026-11-01T00:00:00Z') }).load();
  assert.equal(reset.usage.estimated_used, 0);
  assert.equal(reset.usage.paused_for_quota, false);
  assert.deepEqual(reset.usage.known_sources, ['Old.md']);
  const partial = await setup(t);
  const { documents } = await loadNotes(partial.root);
  const doc = documents.find(item => item.source === 'React基础与组件.md');
  partial.state.budget = prepareDocument(doc, 'en', glossary).units.flatMap(unit => splitUnit(unit.template)).reduce((sum, text) => sum + wireText(text).length, 0);
  const firstLanguage = await runTranslation(partial);
  assert.equal(firstLanguage.stop, 'soft_budget_exhausted');
  assert.deepEqual(firstLanguage.completed.map(item => item.language), ['en']);
  assert.equal(partial.state.usage.estimated_used, partial.state.budget);
});

test('quota errors pause the cycle, rate limits retry finitely without marking monthly exhaustion', async t => {
  for (const status of [403, 429, 401, 503]) {
    const options = await setup(t);
    let calls = 0;
    const client = createAzureTranslator({ env, state: options.state, sleep: async () => {}, fetchImpl: async () => { calls++; return response(status, { error: { code: status === 403 ? 403001 : status * 1000 } }); } });
    await assert.rejects(client.translate(['原文'], 'ja'));
    assert.equal(calls, status === 429 || status === 503 ? 3 : 1);
    assert.equal(options.state.usage.paused_for_quota, status === 403);
  }
  assert.equal(azureEnabled({}), false);
  assert.equal(azureEnabled({ ...env, TRANSLATION_F0_CONFIRMED: 'false' }), false);
  assert.throws(() => createAzureTranslator({ env: { ...env, AZURE_TRANSLATOR_SKU: 'S1' } }));
});

test('missing or duplicated placeholders never publish a partial translation', async t => {
  const options = await setup(t);
  let calls = 0;
  options.translator = createAzureTranslator({ env, state: options.state, sleep: async () => {}, fetchImpl: async (_url, request) => {
    calls++;
    return response(200, JSON.parse(request.body).map(() => ({ translations: [{ to: 'en', text: 'Broken [[NT9999]]' }] })));
  } });
  const report = await runTranslation(options);
  assert.equal(report.completed.length, 0);
  assert.equal(calls, 3);
  assert.equal((await readManifest(options.root)).entries.length, 0);
});
