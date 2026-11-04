import fs from 'node:fs/promises';
import path from 'node:path';

export async function readManifest(root) {
  try {
    const manifest = JSON.parse(await fs.readFile(path.join(root, 'i18n/manifest.json'), 'utf8'));
    if (manifest.version !== 1 || !Array.isArray(manifest.entries)) throw new Error('Invalid translation manifest');
    const keys = new Set();
    for (const entry of manifest.entries) {
      const key = entry.language + ':' + entry.source;
      if (keys.has(key) || !['en', 'ja'].includes(entry.language) || typeof entry.source !== 'string' || !/^[a-z\d-]+$/.test(entry.slug) || !/^[a-f\d]{64}$/.test(entry.source_hash) || typeof entry.human_reviewed !== 'boolean' || !Array.isArray(entry.heading_ids) || !entry.anchors || !/^[a-f\d]{64}$/.test(entry.structure_hash)) throw new Error('Invalid translation metadata');
      keys.add(key);
    }
    return manifest;
  } catch (error) { if (error.code === 'ENOENT') return { version: 1, entries: [] }; throw error; }
}
