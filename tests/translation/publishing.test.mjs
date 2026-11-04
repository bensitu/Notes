import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { fixture } from '../site/helpers.mjs';
import { buildSite } from '../../scripts/build-site.mjs';
import { validateSite } from '../../scripts/validate-site.mjs';
import { TranslationState } from '../../scripts/translation/state.mjs';
import { createAzureTranslator } from '../../scripts/translation/azure.mjs';
import { readManifest, runTranslation, pilotSources } from '../../scripts/translation/pipeline.mjs';
import { validateTranslations } from '../../scripts/translation/validate.mjs';
import { createResolver, loadNotes, transformDocument } from '../../scripts/site-lib.mjs';

const glossary = JSON.parse(await fs.readFile(new URL('../../scripts/translation/glossary.json', import.meta.url), 'utf8'));
const env = { TRANSLATION_ENABLED: 'true', AZURE_TRANSLATOR_SKU: 'F0', TRANSLATION_F0_CONFIRMED: 'true', AZURE_TRANSLATOR_KEY: 'mock-only', AZURE_TRANSLATOR_REGION: 'mock' };
function translator(state) {
  return createAzureTranslator({ env, state, sleep: async () => {}, fetchImpl: async (url, request) => {
    const language = new URL(url).searchParams.get('to');
    return new Response(JSON.stringify(JSON.parse(request.body).map(item => ({ translations: [{ to: language, text: item.Text.replace(/[\p{Script=Han}]+/gu, language === 'ja' ? '翻訳' : 'Translated') }] }))));
  } });
}

test('published translations retain anchors and media, and unresolved language targets fall back to Chinese', async t => {
  const unusual = '中文 空格, &+%.md';
  const root = await fixture(t, {
    'README.md': '# Home\n',
    'React基础与组件.md': `# 原文标题\n\n[章节](#section-1)\n\n<a id="section-1"></a>\n\n## 原文段落\n\n[另一篇](${encodeURIComponent(unusual)}?mode=a%2Bb#section-1)\n\n![图片](Resources/图%25.png)\n\n[源码](examples/demo/a.ts)\n`,
    [unusual]: '# 标题\n\n<a id="section-1"></a>\n\n正文。\n',
    'Resources/图%.png': 'fixture', 'examples/demo/a.ts': 'export const x = 1;',
  });
  const state = await new TranslationState(path.join(root, '.translation-state')).load();
  const report = await runTranslation({ root, state, translator: translator(state), glossary });
  assert.equal(report.completed.length, 2);
  await validateTranslations(root);
  const built = await buildSite({ root });
  assert.equal(built.translations.length, 2);
  const ja = built.translations.find(item => item.language === 'ja');
  const output = await fs.readFile(path.join(root, '.site-dist', ja.file), 'utf8');
  assert.ok(output.includes(ja.route + '?id=section-1'));
  assert.match(output, /\/zh\/note-[a-f\d]+\?mode=a%2Bb\\&id=section-1/);
  assert.match(output, /\/Notes\/assets\/media\/[a-f\d]+\.png\?v=/);
  assert.ok(output.includes('https://github.com/bensitu/Notes/blob/main/examples/demo/a.ts'));
  await validateSite(path.join(root, '.site-dist'));
  const manifest = await readManifest(root);
  manifest.entries.find(item => item.language === 'ja').human_reviewed = true;
  await fs.writeFile(path.join(root, 'i18n/manifest.json'), JSON.stringify(manifest));
  await fs.appendFile(path.join(root, 'React基础与组件.md'), '\n新的原文。\n');
  const outdated = await buildSite({ root });
  assert.equal(outdated.translations.find(item => item.language === 'ja').status, 'outdated');
  const translatedFile = path.join(root, 'i18n', 'ja', ja.file.split('/').at(-1));
  await fs.appendFile(translatedFile, '\n\u0060\u0060\u0060js\nbroken_code();\n\u0060\u0060\u0060\n');
  await assert.rejects(validateTranslations(root), /translation_structure_changed/);
  const isolated = await buildSite({ root });
  assert.equal(isolated.translations.length, 1);
  assert.ok(isolated.documents.length > 0);
  await validateSite(path.join(root, '.site-dist'));
  await fs.rename(path.join(root, 'React基础与组件.md'), path.join(root, 'Renamed.md'));
  const maintenance = await runTranslation({ root, state, translator: translator(state), glossary });
  assert.equal(maintenance.orphaned.length, 2);
  assert.ok((await fs.readFile(path.join(root, 'i18n/maintenance.md'), 'utf8')).includes('人工锁定'));
  assert.equal((await readManifest(root)).entries.find(item => item.language === 'ja').human_reviewed, true);
  await validateTranslations(root);
  await buildSite({ root });
  await validateSite(path.join(root, '.site-dist'));
});

test('actual three-article pilot completes structurally under a mocked API, without writing repository translations', async t => {
  const files = { 'README.md': '# Pilot fixture\n' };
  for (const name of pilotSources) files[name] = await fs.readFile(new URL('../../' + name, import.meta.url), 'utf8');
  const actualRoot = fileURLToPath(new URL('../..', import.meta.url));
  const actual = await loadNotes(actualRoot);
  const resolver = createResolver(actualRoot, actual.documents);
  for (const doc of actual.documents.filter(item => pilotSources.includes(item.source))) await transformDocument(doc, resolver);
  for (const link of resolver.checked) if (link.kind === 'media' || link.kind === 'github') {
    const stat = await fs.stat(path.join(actualRoot, link.target));
    files[stat.isDirectory() ? path.posix.join(link.target, '.fixture') : link.target] = 'fixture';
  }
  const root = await fixture(t, files);
  const state = await new TranslationState(path.join(root, '.translation-state')).load();
  const report = await runTranslation({ root, state, translator: translator(state), glossary });
  assert.equal(report.stop, null);
  assert.equal(report.completed.length, 6);
  assert.ok(report.used_this_run > 0 && report.used_this_run <= 1800000);
  t.diagnostic(`Mock pilot only: 3 sources, 6 translations, ${report.used_this_run} conservatively estimated characters; no Azure calls.`);
  for (const name of pilotSources) assert.equal(await fs.readFile(path.join(root, name), 'utf8'), files[name]);
  await validateTranslations(root);
});
