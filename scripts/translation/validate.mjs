import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createResolver, loadNotes, transformDocument } from '../site-lib.mjs';
import { loadPublished } from './published.mjs';

export async function validateTranslations(root, { complete = false } = {}) {
  root = root || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const { documents } = await loadNotes(root);
  const published = await loadPublished(root, documents, { strict: true });
  if (complete) for (const language of ['en', 'ja']) {
    const missing = documents.filter(doc => doc.source !== 'README.md' && !published[language].has(doc.source));
    const outdated = [...published[language].values()].filter(doc => doc.status === 'outdated');
    if (missing.length || outdated.length) throw new Error(`${language}: ${missing.length} missing, ${outdated.length} outdated translations`);
  }
  for (const language of ['en', 'ja']) {
    const resolver = createResolver(root, documents, { language, translations: published[language] });
    for (const doc of published[language].values()) await transformDocument(doc, resolver);
    if (resolver.issues.length) throw new Error(JSON.stringify(resolver.issues));
  }
  console.log(`Validated translations: en=${published.en.size}, ja=${published.ja.size}`);
  return published;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await validateTranslations(undefined, { complete: process.argv.includes('--complete') });
