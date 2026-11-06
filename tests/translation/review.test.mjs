import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { fixture } from '../site/helpers.mjs';
import { hash, loadNotes, parser, printer } from '../../scripts/site-lib.mjs';
import { applyUnit, finishDocument, prepareDocument, sourceHash, structure, validateTranslation } from '../../scripts/translation/markdown.mjs';
import { readManifest } from '../../scripts/translation/catalog.mjs';
import { reviewTranslation } from '../../scripts/translation/review.mjs';

async function setup(t) {
  const source = 'Note.md';
  const root = await fixture(t, { 'README.md': '# Home\n', [source]: '# Note\n\nOriginal statement.\n' });
  const { documents } = await loadNotes(root);
  const doc = documents.find(item => item.source === source);
  const manifest = { version: 1, entries: [] };
  for (const language of ['en', 'ja']) {
    const prepared = prepareDocument(doc, language, { terms: [] });
    for (const unit of prepared.units) {
      applyUnit(unit, unit.template.replace('Original statement.', language === 'en' ? 'Translated statement.' : '翻訳した本文。'));
    }
    await fs.mkdir(path.join(root, 'i18n', language), { recursive: true });
    await fs.writeFile(path.join(root, 'i18n', language, doc.slug + '.md'), finishDocument(prepared));
    manifest.entries.push({
      source, slug: doc.slug, language, source_hash: sourceHash(doc), source_revision: 'previous-revision',
      human_reviewed: false, heading_ids: doc.headings.map(heading => heading.id), anchors: Object.fromEntries(doc.anchors),
      structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(doc.tree)))), 64),
    });
  }
  const manifestFile = path.join(root, 'i18n/manifest.json');
  await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  return { root, source, manifest, manifestFile };
}

for (const language of ['en', 'ja']) {
  test(`review rejects stale ${language} text even when its Markdown structure still matches`, async t => {
    const { root, source, manifest, manifestFile } = await setup(t);
    const entry = manifest.entries.find(item => item.language === language);
    const before = await fs.readFile(manifestFile, 'utf8');
    const translationFile = path.join(root, 'i18n', language, entry.slug + '.md');
    const translation = await fs.readFile(translationFile, 'utf8');
    await fs.writeFile(path.join(root, source), '# Note\n\nChanged statement.\n');
    const { documents } = await loadNotes(root);
    const current = documents.find(item => item.source === source);
    assert.notEqual(entry.source_hash, sourceHash(current));
    validateTranslation(translation, {
      heading_ids: current.headings.map(heading => heading.id),
      structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(current.tree)))), 64),
    });

    await assert.rejects(reviewTranslation({ root, source, language }), /out of date.*Synchronize the translation/s);

    assert.equal(await fs.readFile(manifestFile, 'utf8'), before);
    assert.equal(await fs.readFile(translationFile, 'utf8'), translation);
  });

  test(`review accepts a current ${language} translation and records the revision`, async t => {
    const { root, source, manifest } = await setup(t);
    execFileSync('git', ['init', '-q'], { cwd: root });
    execFileSync('git', ['-c', 'user.name=Translation Test', '-c', 'user.email=translation@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '-qm', 'Fixture revision'], { cwd: root });
    const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();

    assert.match(await reviewTranslation({ root, source, language }), /marked human reviewed/);

    const reviewed = await readManifest(root);
    const original = manifest.entries.find(item => item.language === language);
    assert.deepEqual(reviewed.entries.find(item => item.language === language), { ...original, human_reviewed: true, source_revision: revision });
    assert.deepEqual(reviewed.entries.find(item => item.language !== language), manifest.entries.find(item => item.language !== language));
  });

  test(`explicit unlock still works for a stale ${language} translation`, async t => {
    const { root, source, manifest, manifestFile } = await setup(t);
    const entry = manifest.entries.find(item => item.language === language);
    entry.human_reviewed = true;
    await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    await fs.writeFile(path.join(root, source), '# Note\n\nChanged statement.\n');

    assert.match(await reviewTranslation({ root, source, language, unlock: true }), /explicitly unlocked/);

    entry.human_reviewed = false;
    assert.deepEqual(await readManifest(root), manifest);
  });
}
