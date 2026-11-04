import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { createResolver, loadNotes, parser, publicSlug, transformDocument } from '../../scripts/site-lib.mjs';
import { fixture } from './helpers.mjs';

test('encoded filenames, references, HTML media, anchors and examples resolve without touching code', async t => {
  const unusual = '中文 空格, &+%.md';
  const code = '```md\n[unchanged](missing.md)\n```';
  const body = `# Start\n\n[encoded](${encodeURIComponent(unusual)}?mode=a%2Bb#${encodeURIComponent('你好-世界')})\n\n[reference][ref]\n\n[ref]: ${encodeURIComponent(unusual)}#section-1\n\n<img src="Resources/图%25.png" alt="test">\n\n[code](examples/demo/a.ts)\n\n${code}\n`;
  const root = await fixture(t, {
    'README.md': body,
    [unusual]: '# 你好 世界\n\n<a id="section-1"></a>\n\n## Next\n',
    'Resources/图%.png': 'fixture',
    'examples/demo/a.ts': 'export const value = 1;',
  });
  const { documents, readme } = await loadNotes(root);
  const resolver = createResolver(root, documents);
  const published = await transformDocument(readme, resolver);
  assert.deepEqual(resolver.issues, []);
  const link = parser.parse(published).children[1].children[0];
  assert.match(link.url, /mode=a%2Bb&id=h-[a-f\d]+/);
  assert.match(published, /\?id=section-1/);
  assert.match(published, /src="\/assets\/media\/[a-f\d]+\.png"/);
  assert.match(published, /github\.com\/bensitu\/Notes\/blob\/main\/examples\/demo\/a\.ts/);
  assert.ok(published.includes(code));
  assert.equal(await fs.readFile(path.join(root, 'README.md'), 'utf8'), body);
  assert.match(publicSlug(unusual), /^[a-z\d-]+$/);
  assert.equal(publicSlug(unusual), publicSlug(unusual));
});

test('bad links and repository escapes fail explicitly', async t => {
  const root = await fixture(t, { 'README.md': '# Home\n', 'Note.md': '# Note\n' });
  const { documents, readme } = await loadNotes(root);
  const resolver = createResolver(root, documents);
  for (const link of ['../outside.md', '%2e%2e/outside.md', 'missing.md', 'Note.md#missing', 'javascript:alert(1)']) await resolver.rewrite(link, readme);
  assert.equal(resolver.issues.length, 5);
  assert.equal(await resolver.rewrite('https://example.com/a%20b#x', readme), 'https://example.com/a%20b#x');
  assert.equal(await resolver.rewrite('mailto:reader@example.com', readme), 'mailto:reader@example.com');
});

test('case collisions cannot produce ambiguous public routes', async t => {
  const root = await fixture(t, { 'README.md': '# Home\n', 'Note.md': '# One\n' });
  const stat = await fs.stat(path.join(root, 'Note.md'));
  assert.ok(stat.isFile());
  const first = publicSlug('Note.md');
  assert.notEqual(first, publicSlug('note.md'));
  const { documents } = await loadNotes(root);
  const resolver = createResolver(root, documents);
  await resolver.rewrite('note.md', documents[0]);
  assert.equal(resolver.issues.length, 1);
});
