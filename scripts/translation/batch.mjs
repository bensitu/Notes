import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { hash, loadNotes, parser, printer } from '../site-lib.mjs';
import { readManifest } from './catalog.mjs';
import { applyUnit, finishDocument, prepareDocument, sourceHash, structure, validateTranslation } from './markdown.mjs';

// This file exchange uses the publication checks without a service client or credentials.
export async function exportBatch(root) {
  const { documents } = await loadNotes(root);
  const glossary = JSON.parse(await fs.readFile(path.join(root, 'scripts/translation/glossary.json'), 'utf8'));
  const docs = [];
  for (const doc of documents.filter(doc => doc.source !== 'README.md')) for (const language of ['en', 'ja']) {
    const prepared = prepareDocument(doc, language, glossary);
    docs.push({ source: doc.source, slug: doc.slug, source_hash: sourceHash(doc), language, units: prepared.units.map(unit => ({ id: unit.fingerprint, text: unit.template, protected: Object.fromEntries(unit.tokens.filter(token => token.kind === 'atom' && typeof token.node?.value === 'string' && token.node.value.length < 160).map(token => [token.id, token.node.value])), pairs: unit.tokens.filter(token => token.kind === 'close').map(token => [token.open, token.id]) })) });
  }
  return { version: 1, documents: docs };
}

export async function importBatch(root, batch, { method = 'file-import', revision } = {}) {
  if (batch.version !== 1 || !Array.isArray(batch.documents)) throw new Error('Invalid translation batch');
  const { documents } = await loadNotes(root);
  const glossary = JSON.parse(await fs.readFile(path.join(root, 'scripts/translation/glossary.json'), 'utf8'));
  const manifest = await readManifest(root);
  revision ||= execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const pending = [];
  const seen = new Set();
  for (const item of batch.documents) {
    const key = item.language + ':' + item.source;
    if (seen.has(key)) throw new Error('Duplicate translation: ' + key);
    seen.add(key);
    if (!['en', 'ja'].includes(item.language)) throw new Error('Unsupported language');
    const doc = documents.find(doc => doc.source === item.source && doc.source !== 'README.md');
    if (!doc || item.slug !== doc.slug || item.source_hash !== sourceHash(doc)) throw new Error('Source changed: ' + item.source);
    if (manifest.entries.some(entry => entry.language === item.language && entry.source === item.source && entry.human_reviewed)) throw new Error('Human-reviewed translation is locked: ' + key);
    const prepared = prepareDocument(doc, item.language, glossary);
    if (item.units?.length !== prepared.units.length) throw new Error('Translation block count changed: ' + key);
    prepared.units.forEach((unit, index) => {
      const translated = item.units[index];
      if (translated.id !== unit.fingerprint || translated.text !== unit.template || typeof translated.translated !== 'string' || !translated.translated.trim()) throw new Error('Invalid translation block: ' + key + '/' + index);
      applyUnit(unit, translated.translated);
    });
    const markdown = finishDocument(prepared);
    const entry = { source: doc.source, slug: doc.slug, language: item.language, source_hash: sourceHash(doc), source_revision: revision, human_reviewed: false, translation_method: method, heading_ids: doc.headings.map(heading => heading.id), anchors: Object.fromEntries(doc.anchors), structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(doc.tree)))), 64) };
    validateTranslation(markdown, entry);
    pending.push({ entry, markdown });
  }
  // Validate the entire batch before writing any of its files.
  for (const { entry, markdown } of pending) {
    await fs.mkdir(path.join(root, 'i18n', entry.language), { recursive: true });
    await fs.writeFile(path.join(root, 'i18n', entry.language, entry.slug + '.md'), markdown);
    const index = manifest.entries.findIndex(item => item.language === entry.language && item.source === entry.source);
    if (index < 0) manifest.entries.push(entry);
    else manifest.entries[index] = entry;
  }
  manifest.entries.sort((a, b) => a.source.localeCompare(b.source, 'en') || a.language.localeCompare(b.language, 'en'));
  await fs.writeFile(path.join(root, 'i18n/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return pending.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const [action, filename] = process.argv.slice(2);
  if (!filename || !['export', 'import'].includes(action)) throw new Error('Usage: batch.mjs export|import <JSON file>');
  if (action === 'export') {
    const batch = await exportBatch(root);
    await fs.mkdir(path.dirname(path.resolve(filename)), { recursive: true });
    await fs.writeFile(filename, JSON.stringify(batch, null, 2) + '\n');
    console.log(`Exported ${batch.documents.length} translation documents.`);
  } else console.log(`Imported ${await importBatch(root, JSON.parse(await fs.readFile(filename, 'utf8')), { method: process.argv[4] || 'file-import' })} translation documents.`);
}
