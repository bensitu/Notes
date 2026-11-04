import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { buildSite, normalizeBase } from '../../scripts/build-site.mjs';
import { validateSite } from '../../scripts/validate-site.mjs';
import { fixture } from './helpers.mjs';

test('one new file automatically enters navigation and homepage; edits preserve its URL', async t => {
  const readme = '# Home\n\nOriginal introduction.\n\n## Frontend\n\n| 文档 | 内容 |\n| --- | --- |\n| [First](First.md) | example |\n';
  const root = await fixture(t, { 'README.md': readme, 'First.md': '# First\n', 'Resources/test.png': 'fixture' });
  await fs.writeFile(path.join(root, '新文章 &+%,.md'), '# New note\n\nSearchable text.\n');
  const first = await buildSite({ root, basePath: '/Notes/' });
  const fresh = first.documents.find(doc => doc.source === '新文章 &+%,.md');
  assert.equal(fresh.category, '其他笔记');
  const outDir = path.join(root, '.site-dist');
  for (const file of ['README.md', '_sidebar.md']) {
    const content = await fs.readFile(path.join(outDir, file), 'utf8');
    assert.ok(content.includes(fresh.route));
    assert.ok(content.includes('New note'));
  }
  assert.ok((await fs.readFile(path.join(outDir, 'README.md'), 'utf8')).includes('Original introduction.'));
  assert.equal(await fs.readFile(path.join(root, 'README.md'), 'utf8'), readme);
  await validateSite(outDir);
  await fs.writeFile(path.join(root, fresh.source), '---\ntitle: Updated title\ncategory: Custom\norder: 1\n---\n# Changed heading\n\nChanged body.\n');
  const second = await buildSite({ root, basePath: '/Notes/' });
  const edited = second.documents.find(doc => doc.source === fresh.source);
  assert.equal(edited.route, fresh.route);
  assert.equal(edited.category, 'Custom');
  assert.notEqual(first.version, second.version);
  const search = await fs.readFile(path.join(outDir, 'assets/app', second.version, 'search-index.json'), 'utf8');
  assert.ok(search.includes('Changed body.'));
  assert.ok(!search.includes('Searchable text.'));
  await validateSite(outDir);
});

test('root and project bases are explicit, and output deletion cannot target source files', async t => {
  assert.equal(normalizeBase('/'), '/');
  assert.equal(normalizeBase('/Notes'), '/Notes/');
  for (const value of ['https://example.com/', '/Notes/../', '/Notes?x=1', '//host/', '/Notes//nested/']) assert.throws(() => normalizeBase(value));
  const root = await fixture(t, { 'README.md': '# Home\n', 'Resources/test.png': 'fixture' });
  await assert.rejects(buildSite({ root, outDir: root }), /Output must/);
  await assert.rejects(buildSite({ root, outDir: path.join(root, 'Resources') }), /Output must/);
  const built = await buildSite({ root, basePath: '/' });
  assert.equal(built.basePath, '/');
  await validateSite(path.join(root, '.site-dist'));
});
