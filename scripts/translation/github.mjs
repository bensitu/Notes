import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function createGithub({ env = process.env, fetchImpl = fetch } = {}) {
  const repository = env.GITHUB_REPOSITORY;
  const token = env.GH_TOKEN;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository || '') || !token) throw new Error('GitHub workflow credentials are unavailable');
  const prefix = 'https://api.github.com/repos/' + repository;
  async function request(method, suffix, body, optional = false) {
    const response = await fetchImpl(prefix + suffix, { method, redirect: 'error', headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000) });
    if (optional && response.status === 404) return null;
    if (!response.ok) throw new Error('GitHub API HTTP ' + response.status);
    return response.json();
  }
  async function pages(suffix) {
    const entries = [];
    for (let page = 1; page <= 50; page++) {
      const items = await request('GET', suffix + (suffix.includes('?') ? '&' : '?') + 'per_page=100&page=' + page);
      entries.push(...items);
      if (items.length < 100) return entries;
    }
    throw new Error('GitHub pagination limit exceeded');
  }
  async function pendingPr() {
    for (const pr of await pages('/pulls?state=open')) {
      if (pr.head?.ref?.startsWith('automation/translation-') || pr.labels?.some(label => label.name === 'translation')) return pr;
      const files = await pages(`/pulls/${pr.number}/files`);
      if (files.some(file => file.filename.startsWith('i18n/'))) return pr;
    }
    return null;
  }
  async function writeRef(branch, sha, exists) {
    if (branch !== 'translation-state' && !/^automation\/translation-[a-z\d-]+$/.test(branch)) throw new Error('Ref writes are restricted to machine state and review branches');
    return exists ? request('PATCH', '/git/refs/heads/' + branch, { sha, force: false }) : request('POST', '/git/refs', { ref: 'refs/heads/' + branch, sha });
  }
  return { repository, request, pages, pendingPr, writeRef };
}

const stateFile = name => name === 'usage.json' || /^cache\/[a-f\d]{2}\.json$/.test(name);
const blobSha = content => createHash('sha1').update('blob ' + Buffer.byteLength(content) + '\0').update(content).digest('hex');
async function stateTree(api) {
  const ref = await api.request('GET', '/git/ref/heads/translation-state', undefined, true);
  if (!ref) return { ref: null, files: [] };
  const commit = await api.request('GET', '/git/commits/' + ref.object.sha);
  const tree = await api.request('GET', '/git/trees/' + commit.tree.sha + '?recursive=1');
  if (tree.truncated) throw new Error('State tree is too large');
  const files = tree.tree.filter(entry => entry.type === 'blob');
  if (files.some(file => !stateFile(file.path))) throw new Error('Unexpected file in machine-state branch');
  return { ref: ref.object.sha, files };
}

export async function restoreState(api, directory) {
  const tree = await stateTree(api);
  for (const file of tree.files) {
    const blob = await api.request('GET', '/git/blobs/' + file.sha);
    const value = Buffer.from(blob.content, 'base64').toString('utf8');
    JSON.parse(value);
    const filename = path.join(directory, file.path);
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, value);
  }
  return tree;
}

export async function persistState(api, directory) {
  let usage;
  try { usage = await fs.readFile(path.join(directory, 'usage.json'), 'utf8'); } catch (error) { if (error.code === 'ENOENT') return { saved: false }; throw error; }
  const previous = await stateTree(api);
  const values = new Map([['usage.json', usage]]);
  let shards = [];
  try { shards = await fs.readdir(path.join(directory, 'cache')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  for (const name of shards) {
    if (!stateFile('cache/' + name)) throw new Error('Invalid cache shard');
    values.set('cache/' + name, await fs.readFile(path.join(directory, 'cache', name), 'utf8'));
  }
  const tree = [];
  let changed = values.size !== previous.files.length;
  for (const [name, value] of values) {
    const previousFile = previous.files.find(file => file.path === name);
    let sha = blobSha(value);
    if (previousFile?.sha !== sha) {
      changed = true;
      sha = (await api.request('POST', '/git/blobs', { content: value, encoding: 'utf-8' })).sha;
    }
    tree.push({ path: name, mode: '100644', type: 'blob', sha });
  }
  if (!changed) return { saved: false };
  const created = await api.request('POST', '/git/trees', { tree });
  const commit = await api.request('POST', '/git/commits', { message: 'chore(i18n): save translation budget and block cache', tree: created.sha, parents: previous.ref ? [previous.ref] : [] });
  await api.writeRef('translation-state', commit.sha, !!previous.ref);
  return { saved: true };
}

export function prBody(report) {
  return `## 翻译审核批次\n\n模式：${report.mode}。本次保守估算：${report.estimated_characters} 字符；实际请求预留计数：${report.used_this_run} 字符（含重试，英文与日文合计）。这不是 Azure 实际账单。\n\n` +
    report.completed.map(item => `- ${JSON.stringify(item.source)} → ${item.language}: \u0060${item.file}\u0060`).join('\n') +
    `\n\n待处理：英文 ${report.remaining.en ?? '?'}，日文 ${report.remaining.ja ?? '?'}。停止原因：${report.stop || '无'}。\n\n` +
    (report.orphaned?.length ? '源文改名或删除待检查：\n' + report.orphaned.map(item => '- ' + JSON.stringify(item.source) + ' (' + item.language + ')').join('\n') + '\n\n' : '') +
    '- [ ] 检查至少一篇长文的日语技术术语与语义。\n- [ ] 检查代码、表格、图片、章节与跨语言链接。\n- [ ] 人工校阅后使用 review 命令标记 human_reviewed；该标记会锁定译文。\n\n试点经人工验收后，所有者才设置 TRANSLATION_PILOT_APPROVED=true。自动 PR 的工作流可能等待仓库写入者选择 Approve workflows to run；创建前已运行必要校验，不绕过分支保护。\n';
}

export async function openTranslationPr(api, root, report, { baseSha, runId } = {}) {
  if (await api.pendingPr()) return { skipped: 'open_translation_pr' };
  const changed = new Set([
    ...execFileSync('git', ['diff', '--name-only', '-z', 'HEAD', '--', 'i18n'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean),
    ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z', '--', 'i18n'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean),
  ]);
  if (!changed.size) return { skipped: 'no_complete_translation' };
  if (!/^[a-f\d]{40}$/.test(baseSha) || !/^[\da-z-]+$/.test(runId)) throw new Error('Invalid review branch base');
  const parent = await api.request('GET', '/git/commits/' + baseSha);
  const tree = [];
  for (const filename of changed) {
    if (!/^i18n\/(?:manifest\.json|maintenance\.md|(?:en|ja)\/[a-z\d-]+\.md)$/.test(filename)) throw new Error('Unexpected file in translation PR');
    let content;
    try { content = await fs.readFile(path.join(root, filename), 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const sha = content === undefined ? null : (await api.request('POST', '/git/blobs', { content, encoding: 'utf-8' })).sha;
    tree.push({ path: filename, mode: '100644', type: 'blob', sha });
  }
  const created = await api.request('POST', '/git/trees', { base_tree: parent.tree.sha, tree });
  const commit = await api.request('POST', '/git/commits', { message: 'docs(i18n): propose reviewed translation batch', tree: created.sha, parents: [baseSha] });
  const branch = 'automation/translation-' + runId;
  await api.writeRef(branch, commit.sha, false);
  const pr = await api.request('POST', '/pulls', { title: `docs(i18n): review ${report.mode} English and Japanese translations`, head: branch, base: 'main', body: prBody(report) });
  return { url: pr.html_url };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const api = createGithub();
    const action = process.argv[2];
    let result;
    if (action === 'pending') {
      const pr = await api.pendingPr();
      result = { blocked: !!pr, url: pr?.html_url || null };
      if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, 'blocked=' + String(!!pr) + '\n');
    } else if (action === 'restore') result = { restored: (await restoreState(api, path.join(root, '.translation-state'))).files.length };
    else if (action === 'persist') result = await persistState(api, path.join(root, '.translation-state'));
    else if (action === 'pr') {
      const report = JSON.parse(await fs.readFile(path.join(root, '.translation-run/report.json'), 'utf8'));
      result = await openTranslationPr(api, root, report, { baseSha: process.env.GITHUB_SHA, runId: process.env.GITHUB_RUN_ID + '-' + process.env.GITHUB_RUN_ATTEMPT });
    } else throw new Error('Unknown GitHub operation');
    console.log(JSON.stringify(result));
  } catch { console.error('GitHub translation operation failed. Credentials and API response bodies are not printed.'); process.exitCode = 1; }
}
