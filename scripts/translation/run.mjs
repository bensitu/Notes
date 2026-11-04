import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, loadNotes } from '../site-lib.mjs';
import { azureEnabled, createAzureTranslator, wireText } from './azure.mjs';
import { prepareDocument, splitUnit } from './markdown.mjs';
import { makeQueue, readManifest, runTranslation } from './pipeline.mjs';
import { TranslationState } from './state.mjs';
import { validateTranslations } from './validate.mjs';
import { createGithub, persistState } from './github.mjs';

export async function runCli({ root, env = process.env, plan = false } = {}) {
  root ||= path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const state = await new TranslationState(path.join(root, '.translation-state'), { budget: Number(env.BUDGET_CHARS || 1800000), day: Number(env.BILLING_CYCLE_DAY || 1), timezone: env.BILLING_CYCLE_TIMEZONE || 'UTC' }).load();
  if (!plan && env.TRANSLATION_PERSIST_STATE === 'true') {
    const api = createGithub({ env });
    state.checkpoint = () => persistState(api, state.directory);
  }
  const glossary = JSON.parse(await fs.readFile(path.join(root, 'scripts/translation/glossary.json'), 'utf8'));
  const approved = env.TRANSLATION_PILOT_APPROVED === 'true';
  const batchSize = Number(env.TRANSLATION_BATCH_SIZE || 3);
  let report;
  if (plan) {
    const { documents } = await loadNotes(root);
    const manifest = await readManifest(root);
    const tasks = makeQueue(documents, manifest, { approved, knownSources: state.usage.known_sources, batchSize });
    let estimate = 0;
    for (const task of tasks) for (const unit of prepareDocument(task.doc, task.language, glossary).units) {
      const chunks = splitUnit(unit.template);
      for (let index = 0; index < chunks.length; index++) {
        const key = hash(unit.fingerprint + '\0' + index + '\0' + chunks[index], 64);
        if (await state.cache(key) === undefined) estimate += wireText(chunks[index]).length;
      }
    }
    const untranslated = Object.fromEntries(['en', 'ja'].map(language => [language, documents.filter(doc => doc.source !== 'README.md' && !manifest.entries.some(entry => entry.source === doc.source && entry.language === language)).length]));
    report = { mode: approved ? 'batch' : 'pilot', selected: tasks.map(task => ({ source: task.doc.source, language: task.language })), untranslated, estimated_characters: estimate, cycle: state.cycle, estimated_used: state.usage.estimated_used, paused_for_quota: state.usage.paused_for_quota, real_api_enabled: azureEnabled(env), note: 'Read-only estimate. No API calls and no translation files written.' };
  } else if (!azureEnabled(env)) report = { stop: 'translation_disabled_or_f0_confirmation_missing', completed: [], used_this_run: 0 };
  else {
    report = await runTranslation({ root, state, translator: createAzureTranslator({ env, state }), glossary, approved, batchSize, revision: env.GITHUB_SHA || 'local-review' });
    if (report.completed.length) await validateTranslations(root);
  }
  if (!plan) {
    await fs.mkdir(path.join(root, '.translation-run'), { recursive: true });
    await fs.writeFile(path.join(root, '.translation-run/report.json'), JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
  return report;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await runCli({ plan: process.argv.includes('--plan') }); }
  catch { console.error('Translation stopped: configuration, state or validation error. No credentials are printed.'); process.exitCode = 1; }
}
