import assert from 'node:assert/strict';
import { test } from 'node:test';
import { visit } from 'unist-util-visit';
import { parser } from '../../scripts/site-lib.mjs';
import { normalizeLocalLinks } from '../../scripts/normalize-local-links.mjs';

test('Chinese punctuation stays outside local links and normalization is idempotent', () => {
  const source = '访问 http://127.0.0.1:3001。生产构建会报告动态首页。打开 http://localhost:8080/api?name=张三&age=18，再继续。\n';
  const normalized = normalizeLocalLinks(source);
  const links = [];
  visit(parser.parse(normalized.source), 'link', node => { links.push(node.url); });
  assert.deepEqual(links, ['http://127.0.0.1:3001', 'http://localhost:8080/api?name=张三&age=18']);
  assert.ok(normalized.source.includes('>。生产构建'));
  assert.equal(normalizeLocalLinks(normalized.source).changes, 0);
});

test('explicit links, inline code, fenced code and HTML attributes remain unchanged', () => {
  const source = '[本机 http://localhost:3001](https://example.com)\n\n<http://127.0.0.1:3001>\n\n\u0060http://localhost:8080\u0060\n\n\u0060\u0060\u0060sh\ncurl http://localhost:8080\n\u0060\u0060\u0060\n\n<img src="http://localhost:8080/image.png">\n';
  assert.equal(normalizeLocalLinks(source).source, source);
});

test('remote hostnames starting with localhost or loopback text are not rewritten', () => {
  const source = '访问 http://localhost.example.com/path 或 http://localhost-api.example.com。\n';
  assert.equal(normalizeLocalLinks(source).source, source);
});
