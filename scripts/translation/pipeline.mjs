import fs from 'node:fs/promises';
import path from 'node:path';
import { hash, loadNotes, parser, printer } from '../site-lib.mjs';
import { applyUnit, finishDocument, prepareDocument, sourceHash, splitUnit, structure, validateMarkers, validateTranslation } from './markdown.mjs';
import { wireText } from './azure.mjs';
import { readManifest } from './catalog.mjs';
export { readManifest } from './catalog.mjs';

export const pilotSources = ['JSF 基础.md', 'MyBatis的使用.md', 'React基础与组件.md'];
export function makeQueue(documents, manifest, { approved = false, knownSources = [], batchSize = 3 } = {}) {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 3) throw new Error('Batch size must be from 1 to 3 documents');
  const known = new Set(knownSources.length ? knownSources : documents.map(doc => doc.source));
  const eligible = documents.filter(doc => doc.source !== 'README.md' && (approved || pilotSources.includes(doc.source)));
  const tasks = [];
  for (const doc of eligible) for (const language of ['en', 'ja']) {
    const entry = manifest.entries.find(item => item.source === doc.source && item.language === language);
    if (entry?.human_reviewed || entry?.source_hash === sourceHash(doc)) continue;
    tasks.push({ doc, language, priority: !known.has(doc.source) ? 0 : entry ? 1 : 2 });
  }
  tasks.sort((a, b) => a.priority - b.priority || a.doc.source.localeCompare(b.doc.source, 'en') || a.language.localeCompare(b.language, 'en'));
  const selected = [...new Set(tasks.map(task => task.doc.source))].slice(0, batchSize);
  return tasks.filter(task => selected.includes(task.doc.source));
}

export async function runTranslation({ root, state, translator, glossary, approved = false, batchSize = 3, openPr = false, revision = 'main', maxRunMs = 1200000 }) {
  const deadline = Date.now() + maxRunMs;
  const report = { mode: approved ? 'batch' : 'pilot', selected: [], completed: [], protected: [], orphaned: [], remaining: {}, estimated_characters: 0, used_this_run: 0, stop: null };
  if (openPr) { report.stop = 'open_translation_pr'; return report; }
  const { documents } = await loadNotes(root);
  const manifest = await readManifest(root);
  const sourceNames = documents.map(doc => doc.source);
  report.orphaned = manifest.entries.filter(entry => !sourceNames.includes(entry.source)).map(entry => ({ source: entry.source, language: entry.language, human_reviewed: entry.human_reviewed, possible_replacement: documents.find(doc => sourceHash(doc) === entry.source_hash)?.source || null }));
  report.protected = manifest.entries.filter(entry => entry.human_reviewed).map(entry => ({ source: entry.source, language: entry.language, outdated: sourceHash(documents.find(doc => doc.source === entry.source) || { original: '' }) !== entry.source_hash }));
  const tasks = makeQueue(documents, manifest, { approved, knownSources: state.usage.known_sources, batchSize });
  report.selected = tasks.map(task => ({ source: task.doc.source, language: task.language, priority: task.priority }));
  if (!state.usage.known_sources?.length) { state.usage.known_sources = sourceNames; await state.save(); }
  const planned = [];
  for (const task of tasks) {
    const prepared = prepareDocument(task.doc, task.language, glossary);
    const pieces = [];
    for (const unit of prepared.units) {
      const chunks = splitUnit(unit.template);
      const parts = [];
      for (let index = 0; index < chunks.length; index++) {
        const text = chunks[index];
        const key = hash(unit.fingerprint + '\0' + index + '\0' + text, 64);
        const cached = await state.cache(key);
        if (cached !== undefined) validateMarkers(text, cached);
        else report.estimated_characters += wireText(text).length;
        parts.push({ text, key, translated: cached });
      }
      pieces.push({ unit, parts });
    }
    planned.push({ ...task, prepared, pieces });
  }
  const before = state.usage.estimated_used;
  for (const task of planned) {
    try {
      const missing = task.pieces.flatMap(piece => piece.parts).filter(part => part.translated === undefined);
      while (missing.length) {
        if (Date.now() >= deadline) throw new Error('run_time_limit');
        const batch = [];
        let size = 0;
        while (missing.length && batch.length < 100 && size + wireText(missing[0].text).length <= 8000) {
          const part = missing.shift();
          size += wireText(part.text).length;
          batch.push(part);
        }
        if (!batch.length) throw new Error('oversize_protected_block');
        const translated = await translator.translate(batch.map(part => part.text), task.language);
        if (!Array.isArray(translated) || translated.length !== batch.length) throw new Error('placeholder_integrity');
        batch.forEach((part, index) => validateMarkers(part.text, translated[index]));
        for (let index = 0; index < batch.length; index++) {
          batch[index].translated = translated[index];
          await state.cache(batch[index].key, translated[index]);
        }
        await state.checkpoint?.();
      }
      for (const { unit, parts } of task.pieces) {
        applyUnit(unit, parts.map(part => part.translated).join(''));
      }
      const markdown = finishDocument(task.prepared);
      const entry = {
        source: task.doc.source, slug: task.doc.slug, language: task.language,
        source_hash: sourceHash(task.doc), source_revision: revision, human_reviewed: false,
        heading_ids: task.doc.headings.map(heading => heading.id), anchors: Object.fromEntries(task.doc.anchors),
        structure_hash: hash(JSON.stringify(structure(parser.parse(printer.stringify(task.doc.tree)))), 64),
      };
      validateTranslation(markdown, entry);
      const filename = `i18n/${task.language}/${task.doc.slug}.md`;
      await fs.mkdir(path.join(root, 'i18n', task.language), { recursive: true });
      await fs.writeFile(path.join(root, filename), markdown);
      const previous = manifest.entries.findIndex(item => item.source === entry.source && item.language === entry.language);
      if (previous >= 0) manifest.entries[previous] = entry;
      else manifest.entries.push(entry);
      report.completed.push({ source: entry.source, language: entry.language, file: filename });
    } catch (error) {
      report.stop = ['run_time_limit', 'cycle_quota_exhausted', 'soft_budget_exhausted', 'rate_limited', 'service_error', 'network_or_timeout', 'authorization_failed', 'placeholder_or_response_integrity', 'placeholder_integrity', 'placeholder_nesting', 'html_token_order', 'translation_structure_changed', 'translation_heading_ids_changed'].includes(error.message) ? error.message : 'translation_validation_failed';
      if (report.stop.includes('integrity') || report.stop.includes('nesting') || report.stop.includes('structure') || report.stop.includes('heading') || report.stop === 'html_token_order') {
        for (const piece of task.pieces) for (const part of piece.parts) await state.cache(part.key, null);
      }
      break;
    }
  }
  manifest.entries.sort((a, b) => a.source.localeCompare(b.source, 'en') || a.language.localeCompare(b.language, 'en'));
  if (report.completed.length) await fs.writeFile(path.join(root, 'i18n/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  if (report.orphaned.length) {
    await fs.mkdir(path.join(root, 'i18n'), { recursive: true });
    await fs.writeFile(path.join(root, 'i18n/maintenance.md'), '# 源文变更待人工处理\n\n以下译文对应的源路径已不存在。请在本翻译 PR 中确认是改名还是删除，并调整元信息、链接或清理文件。程序没有自动改写或删除人工审校译文；站点暂时不发布这些失去源路径的译文。\n\n' + report.orphaned.map(entry => '- ' + JSON.stringify(entry.source) + ' → ' + entry.language + (entry.human_reviewed ? '（人工锁定）' : '') + (entry.possible_replacement ? '；同内容新路径：' + JSON.stringify(entry.possible_replacement) : '')).join('\n') + '\n');
  }
  // Keep newly discovered sources until both languages are published or protected.
  state.usage.known_sources = sourceNames.filter(source => state.usage.known_sources.includes(source) || ['en', 'ja'].every(language => manifest.entries.some(entry => entry.source === source && entry.language === language)));
  await state.save();
  report.used_this_run = state.usage.estimated_used - before;
  for (const language of ['en', 'ja']) report.remaining[language] = documents.filter(doc => doc.source !== 'README.md' && !manifest.entries.some(entry => entry.source === doc.source && entry.language === language && (entry.human_reviewed || entry.source_hash === sourceHash(doc)))).length;
  return report;
}
