import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';
import { decodeOnce, htmlAttributes, listFiles, parser, splitUrl } from './site-lib.mjs';

export async function validateSite(outDir) {
  outDir = path.resolve(outDir || path.join(path.dirname(fileURLToPath(import.meta.url)), '../.site-dist'));
  const manifest = JSON.parse(await fs.readFile(path.join(outDir, 'site-manifest.json'), 'utf8'));
  const issues = [];
  if (manifest.translationWarnings?.length) issues.push('Translation publication warnings are not allowed');
  const files = await listFiles(outDir, '');
  if (files.some(file => !/^[\x20-\x7e]+$/.test(file))) issues.push('Non-ASCII output filename');
  if (files.filter(file => file.endsWith('.html')).join() !== 'index.html') issues.push('The site must contain exactly one HTML entry');
  const allDocuments = [...manifest.documents, ...(manifest.translations || []), ...(manifest.specialPages || [])];
  for (const asset of manifest.playgroundAssets || []) if (!files.includes(asset)) issues.push(`Missing playground asset: ${asset}`);
  const routeFiles = new Map([['/', 'README.md'], ['/en/', 'en/README.md'], ['/ja/', 'ja/README.md'], ...allDocuments.map(doc => [doc.route, doc.file])]);
  const parsed = new Map();
  for (const file of ['README.md', '_sidebar.md', '_404.md', 'en/_404.md', 'ja/_404.md', 'en/README.md', 'ja/README.md', 'en/_sidebar.md', 'ja/_sidebar.md', ...allDocuments.map(doc => doc.file)]) {
    const tree = parser.parse(await fs.readFile(path.join(outDir, file), 'utf8'));
    const ids = new Set();
    const addId = id => { if (ids.has(id)) issues.push(`Duplicate ID ${id}: ${file}`); ids.add(id); };
    visit(tree, 'heading', node => {
      const value = node.children.map(child => child.value || '').join('');
      const match = value.match(/ :id=([\w%-]+)\s*$/);
      if (match) addId(match[1]);
    });
    visit(tree, 'html', node => htmlAttributes(node.value, (_tag, name, value) => { if (name === 'id' || name === 'name') addId(value); }));
    parsed.set(file, { tree, ids });
  }
  let links = 0;
  async function check(url, from) {
    if (/^(https?:|mailto:|tel:|\/\/)/i.test(url)) return;
    links++;
    let route = url;
    if (url.startsWith('#/')) route = url.slice(1);
    const { pathname, query } = splitUrl(route);
    if (routeFiles.has(pathname)) {
      const id = new URLSearchParams(query).get('id');
      if (id && !parsed.get(routeFiles.get(pathname)).ids.has(id)) issues.push(`Missing output anchor ${id}: ${from}`);
      return;
    }
    if (pathname.startsWith(manifest.basePath + 'assets/')) {
      try { await fs.access(path.join(outDir, decodeOnce(pathname.slice(manifest.basePath.length)))); }
      catch { issues.push(`Missing output resource ${url}: ${from}`); }
      return;
    }
    issues.push(`Unresolved output URL ${url}: ${from}`);
  }
  for (const [file, { tree }] of parsed) {
    const work = [];
    visit(tree, node => {
      if (['link', 'image', 'definition'].includes(node.type)) work.push(check(node.url, file));
      if (node.type === 'html') htmlAttributes(node.value, (tag, name, value) => {
        if ((tag === 'a' && name === 'href') || (['img', 'source', 'video', 'audio'].includes(tag) && ['src', 'poster'].includes(name))) work.push(check(value, file));
      });
    });
    await Promise.all(work);
  }
  const html = await fs.readFile(path.join(outDir, 'index.html'), 'utf8');
  const assets = [];
  htmlAttributes(html, (tag, name, value) => {
    if ((tag === 'script' && name === 'src') || (tag === 'link' && name === 'href' && !value.startsWith('data:'))) assets.push(value);
  });
  for (const url of assets) await check(url, 'index.html');
  if (html.includes('@@')) issues.push('Unresolved HTML template variable');
  await fs.access(path.join(outDir, '.nojekyll'));
  if (issues.length) throw new Error(issues.join('\n'));
  console.log(`Validated ${manifest.documents.length} articles, ${files.length} ASCII output paths and ${links} internal links/resources.`);
  return { articles: manifest.documents.length, files: files.length, links };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await validateSite();
