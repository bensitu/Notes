import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createResolver, hash, listFiles, loadNotes, textOf, transformDocument, uniqueIssues } from './site-lib.mjs';
import { generateNav } from './generate-nav.mjs';
import { loadPublished } from './translation/published.mjs';
import { locales } from './site-locales.mjs';
import { buildPlayground, playgroundPages } from './build-playground.mjs';
import { samples } from '../site/playground/samples.mjs';

export function normalizeBase(value = '/Notes/') {
  if (!value.startsWith('/') || /[?#\\]/.test(value) || value.includes('..') || value.includes('//') || !/^\/[a-zA-Z\d/_-]*$/.test(value)) throw new Error(`Unsafe site base path: ${value}`);
  return value.replace(/\/+$/, '') + '/';
}

export async function buildSite({ root, outDir, basePath = '/Notes/', revision = 'main' } = {}) {
  root = path.resolve(root || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
  outDir = path.resolve(outDir || path.join(root, '.site-dist'));
  const relativeOut = path.relative(root, outDir);
  if (!relativeOut || relativeOut.startsWith('..') || path.isAbsolute(relativeOut) || path.basename(outDir) !== '.site-dist') throw new Error('Output must be a .site-dist directory within the source workspace');
  basePath = normalizeBase(basePath);
  const { documents, readme } = await loadNotes(root);
  const published = await loadPublished(root, documents);
  const resources = await listFiles(root, 'Resources');
  const toolingRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const inputs = [...documents.map(doc => doc.source + '\0' + doc.original), basePath, revision];
  for (const language of ['en', 'ja']) for (const doc of published[language].values()) inputs.push(language + '\0' + doc.original + '\0' + JSON.stringify(doc.entry));
  for (const resource of resources) inputs.push(resource + '\0' + hash(await fs.readFile(path.join(root, resource)), 64));
  for (const relative of ['package-lock.json', 'site/index.html', 'site/custom.css', 'site/custom.js', 'scripts/site-lib.mjs', 'scripts/build-site.mjs', 'scripts/generate-nav.mjs', 'scripts/site-locales.mjs', 'scripts/translation/published.mjs']) inputs.push(await fs.readFile(path.join(toolingRoot, relative), 'utf8'));
  for (const relative of ['scripts/build-playground.mjs', ...(await listFiles(toolingRoot, 'site/playground'))]) inputs.push(await fs.readFile(path.join(toolingRoot, relative), 'utf8'));
  const version = hash(inputs.join('\0'), 20);
  const resolver = createResolver(root, documents, { basePath, revision, version });
  const transformed = new Map();
  for (const doc of documents) transformed.set(doc.source, await transformDocument(doc, resolver));
  const issues = uniqueIssues(resolver.issues);
  if (issues.length) throw new Error('Invalid source links:\n' + JSON.stringify(issues, null, 2));
  const nav = generateNav(documents);
  const localePages = {};
  for (const language of ['en', 'ja']) {
    let converted;
    let localResolver;
    do {
      converted = new Map();
      localResolver = createResolver(root, documents, { basePath, revision, version, language, translations: published[language] });
      for (const [source, doc] of published[language]) converted.set(source, await transformDocument(doc, localResolver));
      for (const issue of localResolver.issues) {
        published.warnings.push(`${language}/${issue.source}: invalid_translation_link`);
        published[language].delete(issue.source);
      }
    } while (localResolver.issues.length);
    for (const [source, target] of localResolver.media) resolver.media.set(source, target);
    resolver.checked.push(...localResolver.checked);
    localePages[language] = { converted, nav: generateNav(documents, { language, translations: published[language] }) };
  }
  for (const warning of published.warnings) console.warn(warning);
  const assets = `assets/app/${version}`;
  const destination = async (name, content) => {
    const filename = path.join(outDir, name);
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, content);
  };
  // Only the checked, dedicated output directory is cleared.
  const realRoot = await fs.realpath(root);
  await fs.mkdir(outDir, { recursive: true });
  const actualOut = await fs.realpath(outDir);
  if (path.relative(realRoot, actualOut) !== relativeOut || (await fs.lstat(outDir)).isSymbolicLink()) throw new Error('Output directory resolves outside the workspace');
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir);
  for (const doc of documents) if (doc !== readme) await destination(`zh/${doc.slug}.md`, transformed.get(doc.source));
  await destination('README.md', nav.index + '\n---\n\n<details class="source-readme">\n<summary>仓库 README：说明与原始目录</summary>\n\n' + transformed.get('README.md') + '\n</details>\n');
  await destination('_sidebar.md', nav.sidebar);
  const specialPages = playgroundPages();
  for (const page of specialPages) await destination(page.file, '# Playground :id=playground\n\n<div id="playground-root" aria-busy="true">Loading…</div>\n');
  for (const language of ['en', 'ja']) {
    await destination(`${language}/README.md`, localePages[language].nav.index);
    await destination(`${language}/_sidebar.md`, localePages[language].nav.sidebar);
    for (const doc of published[language].values()) await destination(`${language}/${doc.slug}.md`, localePages[language].converted.get(doc.source));
  }
  await destination('_404.md', '# 未找到这篇笔记\n\n地址可能有误，或文章已从源仓库移除。请使用全文搜索，或[返回全部笔记](/)。\n');
  await destination('.nojekyll', '');
  for (const source of resources) {
    const extension = path.extname(source).toLowerCase();
    if (!/^\.[a-z\d]{1,10}$/.test(extension)) throw new Error(`Unsafe resource extension: ${source}`);
    resolver.media.set(source, `assets/media/${hash(source, 24)}${extension}`);
  }
  for (const [source, target] of resolver.media) await destination(target, await fs.readFile(path.join(root, source)));
  const vendor = [
    ['docsify/dist/docsify.min.js', 'docsify.min.js'],
    ['docsify/dist/themes/core.min.css', 'core.min.css'],
    ['docsify/LICENSE', 'docsify-LICENSE.txt'],
    ['prismjs/LICENSE', 'prism-LICENSE.txt'],
  ];
  const languages = ['java', 'sql', 'python', 'bash', 'powershell', 'json', 'yaml', 'typescript', 'jsx', 'tsx', 'docker', 'ini', 'properties', 'diff', 'http', 'css-extras'];
  for (const lang of languages) vendor.push([`prismjs/components/prism-${lang}.min.js`, `prism-${lang}.min.js`]);
  for (const [source, target] of vendor) await destination(`${assets}/${target}`, await fs.readFile(path.join(toolingRoot, 'node_modules', source)));
  for (const filename of ['custom.css', 'custom.js']) await destination(`${assets}/${filename}`, await fs.readFile(path.join(toolingRoot, 'site', filename)));
  const playgroundAssets = await buildPlayground({ toolingRoot, assets, destination, documents });
  const manifest = {
    version, basePath, repository: 'https://github.com/bensitu/Notes', revision,
    specialPages, playgroundAssets,
    documents: nav.ordered.map(doc => ({ source: doc.source, route: doc.route, title: doc.title, label: doc.label, category: doc.category, file: `zh/${doc.slug}.md`, headings: doc.headings.map(({ node, ...heading }) => heading), anchors: Object.fromEntries(doc.anchors), digest: hash(doc.original, 64), playground: samples.find(sample => sample.sources.includes(doc.source))?.id })),
    translations: ['en', 'ja'].flatMap(language => [...published[language].values()].map(doc => ({ source: doc.source, language, route: doc.route, file: `${language}/${doc.slug}.md`, title: doc.title, label: doc.label, category: doc.category, status: doc.status, anchors: Object.fromEntries(doc.anchors), headings: doc.headings.map(({ node, ...heading }) => heading) }))),
    translationWarnings: published.warnings,
    media: Object.fromEntries(resolver.media), checkedLinks: resolver.checked,
  };
  await destination('site-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  const navigation = { version, documents: manifest.documents, locales: { zh: manifest.documents } };
  for (const language of ['en', 'ja']) navigation.locales[language] = manifest.documents.map(doc => ({ ...doc, ...(manifest.translations.find(item => item.source === doc.source && item.language === language) || { fallback: true }), category: locales[language].categories[doc.category] || doc.category }));
  await destination(`${assets}/navigation.json`, JSON.stringify(navigation));
  const search = [];
  for (const doc of [readme, ...nav.ordered]) {
    let section = { route: doc.route, title: doc.label, category: doc === readme ? '首页说明' : doc.category, heading: '', text: '' };
    let headingIndex = 0;
    for (const node of doc.tree.children) {
      if (node.type === 'heading') {
        if (section.text.trim()) search.push(section);
        const heading = doc.headings[headingIndex++];
        section = { route: `${doc.route}?id=${heading.id}`, title: doc.label, category: doc === readme ? '首页说明' : doc.category, heading: heading.title, text: '' };
      } else section.text += textOf(node) + '\n';
    }
    if (section.text.trim()) search.push(section);
  }
  for (const language of ['en', 'ja']) for (const doc of published[language].values()) {
    let section = { route: doc.route, title: doc.title, category: locales[language].categories[doc.category] || doc.category, heading: '', text: '' };
    let headingIndex = 0;
    for (const node of doc.tree.children) {
      if (node.type === 'heading') {
        if (section.text.trim()) search.push(section);
        const heading = doc.headings[headingIndex++];
        section = { ...section, route: `${doc.route}?id=${heading.id}`, heading: heading.title, text: '' };
      } else section.text += textOf(node) + '\n';
    }
    if (section.text.trim()) search.push(section);
  }
  await destination(`${assets}/search-index.json`, JSON.stringify(search));
  const config = { basePath, version, assetPath: basePath + assets + '/', repository: manifest.repository, revision, languages };
  const html = (await fs.readFile(path.join(toolingRoot, 'site/index.html'), 'utf8'))
    .replaceAll('@@BASE@@', basePath).replaceAll('@@ASSETS@@', basePath + assets + '/').replace('@@CONFIG@@', JSON.stringify(config).replaceAll('<', '\\u003c'))
    .replace('@@LANGUAGES@@', languages.map(lang => `<script defer src="${basePath}${assets}/prism-${lang}.min.js"></script>`).join('\n'));
  await destination('index.html', html);
  console.log(`Built ${nav.ordered.length} articles, ${resolver.media.size} resources at ${basePath}; version ${version}`);
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildSite({ basePath: process.env.SITE_BASE_PATH || '/Notes/', revision: process.env.SITE_REVISION || 'main' });
}
