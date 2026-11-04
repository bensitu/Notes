import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import { parseFragment } from 'parse5';
import { parse as parseYaml } from 'yaml';
import GithubSlugger from 'github-slugger';
import { slugify } from 'docsify/src/core/render/slugify.js';

export const repositoryUrl = 'https://github.com/bensitu/Notes';
export const parser = unified().use(remarkParse).use(remarkGfm);
const printer = unified().use(remarkStringify, { bullet: '-', fences: true, listItemIndent: 'one' }).use(remarkGfm);
export const hash = (text, length = 12) => createHash('sha256').update(text).digest('hex').slice(0, length);
export const textOf = node => node.children ? node.children.map(textOf).join('') : node.type === 'html' ? '' : node.value || '';
export const escapeHtml = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const decodeOnce = value => decodeURIComponent(value.replace(/%(?![\da-f]{2})/gi, '%25'));

export function publicSlug(source) {
  const prefix = path.posix.basename(source, '.md').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 32) || 'note';
  return `${prefix}-${hash(source)}`;
}

export function splitUrl(url) {
  const anchorAt = url.indexOf('#');
  const beforeAnchor = anchorAt < 0 ? url : url.slice(0, anchorAt);
  const queryAt = beforeAnchor.indexOf('?');
  return {
    pathname: queryAt < 0 ? beforeAnchor : beforeAnchor.slice(0, queryAt),
    query: queryAt < 0 ? '' : beforeAnchor.slice(queryAt + 1),
    anchor: anchorAt < 0 ? '' : url.slice(anchorAt + 1),
  };
}

export function htmlAttributes(html, callback) {
  const fragment = parseFragment(html, { sourceCodeLocationInfo: true });
  const edits = [];
  function walk(node) {
    for (const attr of node.attrs || []) {
      const location = node.sourceCodeLocation?.attrs?.[attr.name];
      if (location) {
        const value = callback(node.tagName, attr.name, attr.value);
        if (value !== undefined && value !== attr.value) edits.push({ ...location, value: `${attr.name}="${escapeHtml(value)}"` });
      }
    }
    for (const child of node.childNodes || []) walk(child);
    if (node.content) walk(node.content);
  }
  walk(fragment);
  for (const edit of edits.sort((a, b) => b.startOffset - a.startOffset)) html = html.slice(0, edit.startOffset) + edit.value + html.slice(edit.endOffset);
  return html;
}

function readFrontmatter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { body: source, metadata: {} };
  const metadata = parseYaml(match[1]) || {};
  if (typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error(`Invalid frontmatter: ${filename}`);
  for (const key of ['title', 'category']) {
    if (metadata[key] !== undefined && (typeof metadata[key] !== 'string' || !metadata[key].trim())) throw new Error(`Invalid ${key}: ${filename}`);
  }
  if (metadata.order !== undefined && !Number.isFinite(metadata.order)) throw new Error(`Invalid order: ${filename}`);
  return { body: source.slice(match[0].length), metadata };
}

export async function loadNotes(root) {
  const names = (await fs.readdir(root, { withFileTypes: true })).filter(e => e.isFile() && /\.md$/i.test(e.name)).map(e => e.name).sort();
  const folded = new Set();
  const routes = new Set();
  const documents = [];
  for (const source of names) {
    const identity = source.normalize('NFC').toLowerCase();
    if (folded.has(identity)) throw new Error(`Case or Unicode path collision: ${source}`);
    folded.add(identity);
    const original = await fs.readFile(path.join(root, source), 'utf8');
    const { body, metadata } = readFrontmatter(original, source);
    const tree = parser.parse(body);
    const slug = publicSlug(source);
    const route = source === 'README.md' ? '/' : `/zh/${slug}`;
    if (routes.has(route)) throw new Error(`Route collision: ${source}`);
    routes.add(route);
    const doc = { source, original, body, metadata, tree, slug, route, headings: [], anchors: new Map(), explicitIds: new Set() };
    visit(tree, 'html', node => htmlAttributes(node.value, (_tag, name, value) => {
      if (name === 'id' || name === 'name') {
        if (doc.explicitIds.has(value)) throw new Error(`Duplicate explicit anchor ${value}: ${source}`);
        doc.explicitIds.add(value);
        doc.anchors.set(value, value);
      }
    }));
    const github = new GithubSlugger();
    slugify.clear();
    const counts = new Map();
    visit(tree, 'heading', node => {
      const title = textOf(node).replace(/\s*\{docsify[^}]*\}\s*/g, '').trim();
      const number = counts.get(title) || 0;
      counts.set(title, number + 1);
      const id = `h-${hash(source + '\0' + title + '\0' + number)}`;
      if (doc.explicitIds.has(id)) throw new Error(`Heading ID collision: ${source}`);
      const aliases = [github.slug(title), slugify(title), id];
      for (const alias of aliases) if (!doc.anchors.has(alias)) doc.anchors.set(alias, id);
      doc.headings.push({ node, title, id, depth: node.depth });
    });
    doc.title = metadata.title || doc.headings[0]?.title || path.basename(source, '.md');
    documents.push(doc);
  }
  const readme = documents.find(doc => doc.source === 'README.md');
  if (!readme) throw new Error('README.md is required');
  const categories = new Map();
  let category = '';
  let ordinal = 0;
  for (const node of readme.tree.children) {
    if (node.type === 'heading' && node.depth === 2) category = textOf(node);
    if (node.type !== 'table') continue;
    visit(node, 'link', link => {
      try {
        const source = decodeOnce(splitUrl(link.url).pathname).replace(/^\.\//, '');
        if (documents.some(doc => doc.source === source)) categories.set(source, { category, ordinal: ordinal++, label: textOf(link) });
      } catch { /* Invalid URLs are recorded by the audit resolver. */ }
    });
  }
  for (const doc of documents) {
    const found = categories.get(doc.source);
    doc.category = doc.metadata.category || found?.category || '其他笔记';
    doc.order = doc.metadata.order ?? found?.ordinal ?? Number.MAX_SAFE_INTEGER;
    doc.label = doc.metadata.title || found?.label || doc.title;
  }
  return { documents, readme };
}

export async function listFiles(root, relative) {
  const result = [];
  for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
    const filename = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not publishable: ${filename}`);
    if (entry.isDirectory()) result.push(...await listFiles(root, filename));
    else if (entry.isFile()) result.push(filename);
  }
  return result.sort();
}

export function createResolver(root, documents, { revision = 'main', basePath = '/', version = '' } = {}) {
  const bySource = new Map(documents.map(doc => [doc.source, doc]));
  const issues = [];
  const media = new Map();
  const checked = [];
  const directoryEntries = new Map();
  const github = (source, directory, query, anchor) => `${repositoryUrl}/${directory ? 'tree' : 'blob'}/${encodeURIComponent(revision)}/${source.split('/').map(encodeURIComponent).join('/')}${query ? '?' + query : ''}${anchor ? '#' + anchor : ''}`;
  async function rewrite(url, doc, { image = false } = {}) {
    if (/^(?:https?:|mailto:|tel:|\/\/)/i.test(url)) return url;
    const fail = reason => { issues.push({ source: doc.source, url, reason }); return url; };
    if (/^[a-z][a-z\d+.-]*:/i.test(url)) return fail('unsupported URL scheme');
    const parts = splitUrl(url);
    let decoded;
    try { decoded = decodeOnce(parts.pathname); } catch { return fail('invalid URL encoding'); }
    if (/[\\\x00-\x1f]/.test(decoded)) return fail('unsafe local path');
    const source = decoded ? path.posix.normalize(decoded.startsWith('/') ? decoded.slice(1) : path.posix.join(path.posix.dirname(doc.source), decoded)) : doc.source;
    if (source === '..' || source.startsWith('../') || path.posix.isAbsolute(source)) return fail('path escapes repository');
    const absolute = path.join(root, source);
    let stat;
    try {
      stat = await fs.lstat(absolute);
      const actual = await fs.realpath(absolute);
      const relative = path.relative(await fs.realpath(root), actual);
      if (relative.startsWith('..') || path.isAbsolute(relative) || stat.isSymbolicLink()) return fail('unsafe symbolic link');
      let parent = root;
      for (const segment of source.split('/')) {
        if (!directoryEntries.has(parent)) directoryEntries.set(parent, await fs.readdir(parent));
        if (!directoryEntries.get(parent).includes(segment)) return fail('path case mismatch');
        parent = path.join(parent, segment);
      }
    } catch { return fail('missing local target'); }
    const target = bySource.get(source);
    if (target && !image) {
      const query = new URLSearchParams(parts.query);
      const inputId = parts.anchor || query.get('id');
      if (inputId) {
        let anchor;
        try { anchor = decodeOnce(inputId); } catch { return fail('invalid anchor encoding'); }
        const id = target.anchors.get(anchor);
        if (!id) return fail(`missing anchor: ${anchor}`);
        query.set('id', id);
      }
      const result = target.route + (query.size ? '?' + query.toString() : '');
      checked.push({ source: doc.source, url, target: source, result, kind: 'document' });
      return result;
    }
    if (source.startsWith('Resources/') || (image && !source.startsWith('examples/'))) {
      if (!stat.isFile()) return fail('media target is not a file');
      const extension = path.posix.extname(source).toLowerCase();
      if (!/^\.[a-z\d]{1,10}$/.test(extension)) return fail('unsafe media extension');
      const published = `assets/media/${hash(source, 24)}${extension}`;
      media.set(source, published);
      const query = new URLSearchParams(parts.query);
      if (version) query.set('v', version);
      const result = basePath + published + (query.size ? '?' + query.toString() : '') + (parts.anchor ? '#' + parts.anchor : '');
      checked.push({ source: doc.source, url, target: source, result, kind: 'media' });
      return result;
    }
    const result = github(source, stat.isDirectory(), parts.query, parts.anchor);
    checked.push({ source: doc.source, url, target: source, result, kind: 'github' });
    return result;
  }
  return { rewrite, issues, media, checked };
}

export async function transformDocument(doc, resolver) {
  const tree = structuredClone(doc.tree);
  const work = [];
  visit(tree, node => {
    if (['link', 'image', 'definition'].includes(node.type)) work.push(async () => { node.url = await resolver.rewrite(node.url, doc, { image: node.type === 'image' }); });
    if (node.type === 'html') work.push(async () => {
      const values = new Map();
      htmlAttributes(node.value, (tag, name, value) => {
        if ((tag === 'a' && name === 'href') || (['img', 'source', 'video', 'audio'].includes(tag) && ['src', 'poster'].includes(name))) values.set(value, name !== 'href');
      });
      const replacements = new Map();
      for (const [value, image] of values) {
        let result = await resolver.rewrite(value, doc, { image });
        if (!image && (result === '/' || result.startsWith('/?') || result.startsWith('/zh/'))) result = '#' + result;
        replacements.set(value, result);
      }
      node.value = htmlAttributes(node.value, (tag, name, value) => {
        if ((tag === 'a' && name === 'href') || (['img', 'source', 'video', 'audio'].includes(tag) && ['src', 'poster'].includes(name))) return replacements.get(value);
      });
    });
  });
  for (const run of work) await run();
  let heading = 0;
  visit(tree, 'heading', node => {
    const info = doc.headings[heading++];
    node.children.push({ type: 'text', value: ` :id=${info.id}` });
  });
  return printer.stringify(tree);
}

export function uniqueIssues(issues) {
  return [...new Map(issues.map(issue => [JSON.stringify(issue), issue])).values()].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'));
}
