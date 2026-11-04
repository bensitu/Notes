import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { hash, loadNotes, parser, printer } from '../site-lib.mjs';
import { sourceHash, structure, validateTranslation } from './markdown.mjs';
import { readManifest } from './pipeline.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const value = option => process.argv[process.argv.indexOf(option) + 1];
const source = process.argv.includes('--source') ? value('--source') : '';
const language = process.argv.includes('--language') ? value('--language') : '';
if (!source || !['en', 'ja'].includes(language)) throw new Error('Usage: review --source <source.md> --language <en|ja> [--unlock]');
const manifest = await readManifest(root);
const entry = manifest.entries.find(item => item.source === source && item.language === language);
if (!entry) throw new Error('No registered translation for this source and language');
if (process.argv.includes('--unlock')) entry.human_reviewed = false;
else {
  const { documents } = await loadNotes(root);
  const doc = documents.find(item => item.source === source);
  if (!doc) throw new Error('Source no longer exists');
  const updated = { ...entry, source_hash: sourceHash(doc), heading_ids: doc.headings.map(heading => heading.id), structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(doc.tree)))), 64), anchors: Object.fromEntries(doc.anchors), human_reviewed: true, source_revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim() };
  validateTranslation(await fs.readFile(path.join(root, 'i18n', language, entry.slug + '.md'), 'utf8'), updated);
  Object.assign(entry, updated);
}
await fs.writeFile(path.join(root, 'i18n/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(process.argv.includes('--unlock') ? 'Translation explicitly unlocked for future review PRs.' : 'Translation marked human reviewed against the current source.');
