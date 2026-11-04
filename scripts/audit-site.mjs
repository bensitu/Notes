import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadNotes, createResolver, transformDocument, uniqueIssues, listFiles } from './site-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { documents } = await loadNotes(root);
const resolver = createResolver(root, documents);
for (const doc of documents) await transformDocument(doc, resolver);
const resources = await listFiles(root, 'Resources');
const report = { documents: documents.length - 1, readme: 1, resources: resources.length, checkedLinks: resolver.checked.length, externalImages: documents.reduce((count, doc) => count + [...doc.body.matchAll(/(?:!\[[^\]]*\]\(|<img[^>]*src=["'])https?:/g)].length, 0), issues: uniqueIssues(resolver.issues) };
console.log(JSON.stringify(report, null, 2));
if (process.argv.includes('--record')) {
  await fs.writeFile(path.join(root, 'site/audit-baseline.json'), JSON.stringify(report, null, 2) + '\n');
}
