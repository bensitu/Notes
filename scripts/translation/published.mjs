import fs from 'node:fs/promises';
import path from 'node:path';
import { htmlAttributes, textOf } from '../site-lib.mjs';
import { sourceHash, validateTranslation } from './markdown.mjs';
import { readManifest } from './catalog.mjs';

export async function loadPublished(root, documents, { strict = false } = {}) {
  const result = { en: new Map(), ja: new Map(), warnings: [], maintenance: [] };
  let manifest;
  try { manifest = await readManifest(root); }
  catch (error) {
    if (strict) throw error;
    result.warnings.push('Translation metadata is invalid; Chinese publication continues.');
    return result;
  }
  for (const entry of manifest.entries) {
    try {
      const source = documents.find(doc => doc.source === entry.source);
      if (!source) { result.maintenance.push({ source: entry.source, language: entry.language }); continue; }
      if (source.source === 'README.md' || source.slug !== entry.slug) throw new Error('source_slug_mismatch');
      const original = await fs.readFile(path.join(root, 'i18n', entry.language, entry.slug + '.md'), 'utf8');
      const tree = validateTranslation(original, entry);
      const headingNodes = [];
      const ids = new Set(entry.heading_ids);
      function collect(node) {
        if (node.type === 'heading') headingNodes.push(node);
        if (node.type === 'html') htmlAttributes(node.value, (_tag, name, value) => {
          if (name === 'id' || name === 'name') {
            if (ids.has(value)) throw new Error('duplicate_translation_id');
            ids.add(value);
          }
        });
        for (const child of node.children || []) collect(child);
      }
      collect(tree);
      if (Object.values(entry.anchors).some(id => !ids.has(id))) throw new Error('invalid_translation_anchor_map');
      const headings = headingNodes.map((node, index) => ({ node, id: entry.heading_ids[index], depth: node.depth, title: textOf(node).replace(/\s+:id=[\w%-]+\s*$/, '') }));
      const title = headings[0]?.title || source.title;
      const outdated = sourceHash(source) !== entry.source_hash;
      result[entry.language].set(source.source, { ...source, original, body: original, tree, title, label: title, headings, route: `/${entry.language}/${entry.slug}`, anchors: new Map(Object.entries(entry.anchors)), language: entry.language, entry, status: outdated ? 'outdated' : entry.human_reviewed ? 'human_reviewed' : 'published' });
    } catch (error) {
      result.warnings.push(`${entry.language}/${entry.slug}: ${error.code === 'ENOENT' ? 'translation_file_missing' : error.message}`);
    }
  }
  for (const language of ['en', 'ja']) {
    let files = [];
    try { files = await fs.readdir(path.join(root, 'i18n', language)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    for (const name of files) if (name.endsWith('.md') && !manifest.entries.some(entry => entry.language === language && name === entry.slug + '.md')) result.warnings.push(`${language}/${name}: unregistered_translation`);
  }
  if (strict && result.warnings.length) throw new Error(result.warnings.join('\n'));
  return result;
}
