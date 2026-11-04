import { visit } from 'unist-util-visit';
import { parseFragment } from 'parse5';
import { hash, parser, printer, textOf, escapeHtml } from '../site-lib.mjs';

export const conversionVersion = 1;
export const canonical = text => text.replace(/\r\n?/g, '\n');
export const sourceHash = doc => hash(canonical(doc.original), 64);
const markerPattern = /\[\[NT\d+\]\]/g;
const stripPosition = value => JSON.parse(JSON.stringify(value, (key, item) => key === 'position' ? undefined : item));

function htmlTextRanges(html) {
  const ranges = [];
  function walk(node) {
    if (node.nodeName === '#text' && node.sourceCodeLocation) ranges.push({ ...node.sourceCodeLocation, text: node.value });
    for (const child of node.childNodes || []) walk(child);
    if (node.content) walk(node.content);
  }
  walk(parseFragment(html, { sourceCodeLocationInfo: true }));
  return ranges.sort((a, b) => a.startOffset - b.startOffset);
}

function htmlShape(html) {
  for (const range of htmlTextRanges(html).reverse()) html = html.slice(0, range.startOffset) + '<TEXT>' + html.slice(range.endOffset);
  return html;
}

export function structure(tree) {
  function shape(node) {
    if (node.type === 'text') return null;
    if (node.type === 'html') return { type: 'html', value: htmlShape(node.value) };
    const base = {};
    for (const key of ['type', 'depth', 'ordered', 'start', 'spread', 'checked', 'align', 'lang', 'meta', 'value', 'url', 'identifier', 'title', 'alt', 'label']) {
      if (node[key] !== undefined && !(key === 'alt' && ['image', 'imageReference'].includes(node.type))) base[key] = node[key];
    }
    if (node.children) {
      base.children = node.children.map(shape).filter(Boolean);
      if (['paragraph', 'heading', 'tableCell'].includes(node.type)) base.children.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'));
    }
    return base;
  }
  return shape(tree);
}

export function headingIds(tree) {
  const result = [];
  visit(tree, 'heading', node => { result.push(textOf(node).match(/\s+:id=([\w%-]+)\s*$/)?.[1] || null); });
  return result;
}

export function prepareDocument(doc, language, glossary) {
  const tree = stripPosition(doc.tree);
  const units = [];
  let headingIndex = 0;
  const termMap = new Map(glossary.terms.map(term => [term.source, term[language]]));
  const alternatives = [...termMap.keys()].sort((a, b) => b.length - a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const protectedWords = new RegExp(['\\[\\[NT\\d+\\]\\]', ...alternatives, '\\b(?:[A-Z][A-Z0-9_]{1,}|[A-Za-z_$]+[A-Z][A-Za-z\\d_$]*|[A-Za-z_$]+(?:[._/][A-Za-z\\d_$+-]+)+|v?\\d+(?:\\.\\d+)+)\\b'].join('|'), 'g');

  function unit(node, mode) {
    const tokens = [];
    const token = data => { const id = `[[NT${String(tokens.length).padStart(4, '0')}]]`; tokens.push({ id, ...data }); return id; };
    const protectText = text => text.replace(protectedWords, word => token({ kind: 'atom', node: { type: 'text', value: termMap.get(word) || word } }));
    function inline(child) {
      if (child.type === 'text') return protectText(child.value);
      if (['image', 'imageReference'].includes(child.type)) {
        const shell = { ...child, children: [] };
        if (child.type === 'imageReference') shell.referenceType = 'full';
        const open = token({ kind: 'open', node: shell });
        const body = protectText(child.alt || '');
        return open + body + token({ kind: 'close', open });
      }
      if (child.children) {
        const shell = { ...child, children: [] };
        if (child.type === 'linkReference') shell.referenceType = 'full';
        const open = token({ kind: 'open', node: shell });
        const body = child.children.map(inline).join('');
        const close = token({ kind: 'close', open });
        return open + body + close;
      }
      return token({ kind: 'atom', node: child });
    }
    let template;
    if (mode === 'html') {
      let offset = 0;
      template = '';
      for (const range of htmlTextRanges(node.value)) {
        if (range.startOffset > offset) template += token({ kind: 'raw', value: node.value.slice(offset, range.startOffset) });
        template += protectText(range.text);
        offset = range.endOffset;
      }
      if (offset < node.value.length) template += token({ kind: 'raw', value: node.value.slice(offset) });
    } else template = node.children.map(inline).join('');
    if (!template.replace(markerPattern, '').trim()) { applyUnit({ node, mode, template, tokens }, template); return; }
    units.push({ node, mode, template, tokens, fingerprint: hash(JSON.stringify({ template: canonical(template).replace(/\s+/g, ' ').trim(), tokens, language, glossary, conversionVersion }), 64) });
  }
  visit(tree, node => {
    if (node.type === 'heading') {
      const last = node.children.at(-1);
      if (last?.type === 'text') last.value = last.value.replace(/\s+:id=[\w%-]+\s*$/, '');
      node.data = { headingId: doc.headings[headingIndex++].id };
    }
    if (['paragraph', 'heading', 'tableCell'].includes(node.type)) unit(node, 'inline');
    if (node.type === 'html' && htmlTextRanges(node.value).some(range => range.text.trim())) unit(node, 'html');
  });
  return { tree, units };
}

export function splitUnit(template, limit = 1800) {
  const atoms = template.match(/\[\[NT\d+\]\]|[^]/gu) || [];
  const result = [];
  let part = '';
  let wireSize = 11;
  for (const atom of atoms) {
    const cost = atom.startsWith('[[NT') ? atom.length + '<span class="notranslate" translate="no"></span>'.length : escapeHtml(atom).length;
    if (part.length + atom.length > limit || wireSize + cost > 7000 || (part.length > limit / 2 && /[。！？.!?\n]$/.test(part))) { result.push(part); part = ''; wireSize = 11; }
    part += atom;
    wireSize += cost;
  }
  if (part) result.push(part);
  return result;
}

export function validateMarkers(source, translated) {
  const expected = source.match(markerPattern) || [];
  const actual = translated.match(markerPattern) || [];
  if (expected.length !== actual.length || new Set(actual).size !== actual.length || expected.some(id => !actual.includes(id)) || /\[\[NT/.test(translated.replace(markerPattern, ''))) throw new Error('placeholder_integrity');
}

export function applyUnit(unit, translated) {
  validateMarkers(unit.template, translated);
  const tokens = new Map(unit.tokens.map(token => [token.id, token]));
  const parts = translated.split(/(\[\[NT\d+\]\])/);
  if (unit.mode === 'inline') {
    const htmlTokens = unit.tokens.filter(token => token.kind === 'atom' && token.node.type === 'html').map(token => token.id);
    if (parts.filter(part => htmlTokens.includes(part)).join() !== htmlTokens.join()) throw new Error('html_token_order');
  }
  if (unit.mode === 'html') {
    const originalOrder = unit.tokens.filter(token => token.kind === 'raw').map(token => token.id);
    if (parts.filter(part => tokens.get(part)?.kind === 'raw').join() !== originalOrder.join()) throw new Error('html_token_order');
    unit.node.value = parts.map(part => tokens.has(part) ? tokens.get(part).kind === 'raw' ? tokens.get(part).value : escapeHtml(tokens.get(part).node.value) : escapeHtml(part)).join('');
    return;
  }
  const root = { children: [] };
  const stack = [{ id: null, node: root }];
  for (const part of parts) {
    const current = stack.at(-1).node;
    const token = tokens.get(part);
    if (!token) { if (part) current.children.push({ type: 'text', value: part }); continue; }
    if (token.kind === 'atom') current.children.push(structuredClone(token.node));
    else if (token.kind === 'open') {
      const node = structuredClone(token.node);
      current.children.push(node);
      stack.push({ id: token.id, node });
    } else if (token.kind === 'close') {
      if (stack.at(-1).id !== token.open) throw new Error('placeholder_nesting');
      if (['image', 'imageReference'].includes(current.type)) { current.alt = textOf(current); delete current.children; }
      stack.pop();
    }
  }
  if (stack.length !== 1) throw new Error('placeholder_nesting');
  unit.node.children = root.children;
}

export function finishDocument(prepared) {
  visit(prepared.tree, 'heading', node => { node.children.push({ type: 'text', value: ' :id=' + node.data.headingId }); });
  return printer.stringify(prepared.tree);
}

export function validateTranslation(markdown, entry) {
  const tree = parser.parse(markdown);
  if (hash(JSON.stringify(structure(tree)), 64) !== entry.structure_hash) throw new Error('translation_structure_changed');
  const ids = headingIds(tree);
  if (ids.some(id => !id) || new Set(ids).size !== ids.length || ids.join() !== entry.heading_ids.join()) throw new Error('translation_heading_ids_changed');
  return tree;
}
