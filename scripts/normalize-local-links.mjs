import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';
import { parser } from './site-lib.mjs';

export function normalizeLocalLinks(source) {
  const edits = [];
  const tree = parser.parse(source);
  visit(tree, node => {
    if (!['text', 'link'].includes(node.type) || !node.position) return;
    const raw = source.slice(node.position.start.offset, node.position.end.offset);
    if (node.type === 'link' && !/^https?:\/\//.test(raw)) return;
    if (node.type === 'text' && !raw.includes('http')) return;
    // Explicit links, code and HTML attributes are handled by their own syntax.
    for (const match of raw.matchAll(/https?:\/\/(?:127(?:\.\d{1,3}){3}|localhost|\[::1\])(?::\d+)?(?![a-zA-Z0-9_:-]|\.[a-zA-Z0-9])(?:[/?#][^\s<>`，。；！？、：]*)?/g)) {
      if (node.type === 'text') {
        const insideLink = treeContainsLink(tree, node);
        if (insideLink) continue;
      }
      const start = node.position.start.offset + match.index;
      if (!edits.some(edit => edit.start === start)) edits.push({ start, end: start + match[0].length, value: '<' + match[0] + '>' });
    }
  });
  for (const edit of edits.sort((a, b) => b.start - a.start)) source = source.slice(0, edit.start) + edit.value + source.slice(edit.end);
  return { source, changes: edits.length };
}

function treeContainsLink(tree, target) {
  let found = false;
  visit(tree, ['link', 'linkReference'], node => { if (node.children?.includes(target)) found = true; });
  return found;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const files = execFileSync('git', ['ls-files', '-z', '--', '*.md'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  let total = 0;
  for (const file of files) {
    const filename = path.join(root, file);
    const result = normalizeLocalLinks(await fs.readFile(filename, 'utf8'));
    if (!result.changes) continue;
    total += result.changes;
    console.log(`${file}: ${result.changes}`);
    if (process.argv.includes('--write')) await fs.writeFile(filename, result.source);
  }
  console.log(`${total} local URL boundaries ${process.argv.includes('--write') ? 'normalized' : 'need normalization'}.`);
  if (total && !process.argv.includes('--write')) process.exitCode = 1;
}
