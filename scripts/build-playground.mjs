import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import { samples, playgroundRoute } from '../site/playground/samples.mjs';

export function playgroundPages() {
  return ['zh', 'en', 'ja'].map(language => ({ route: playgroundRoute(language), file: language === 'zh' ? 'playground.md' : `${language}/playground.md`, language }));
}

export async function buildPlayground({ toolingRoot, assets, destination, documents }) {
  const files = [];
  const write = async (name, content) => { files.push(`${assets}/${name}`); await destination(`${assets}/${name}`, content); };
  const bundled = await build({ stdin: { contents: 'import * as React from "react"; import { createRoot } from "react-dom/client"; window.React = React; window.ReactDOM = { createRoot };', resolveDir: toolingRoot }, bundle: true, minify: true, format: 'iife', platform: 'browser', define: { 'process.env.NODE_ENV': '"production"' }, write: false });
  await write('playground-react.js', bundled.outputFiles[0].contents);
  for (const [source, target] of [
    ['@babel/standalone/babel.min.js', 'playground-babel.js'],
    ['vue/dist/vue.global.prod.js', 'playground-vue.js'],
    ['react/LICENSE', 'react-LICENSE.txt'], ['react-dom/LICENSE', 'react-dom-LICENSE.txt'],
    ['scheduler/LICENSE', 'scheduler-LICENSE.txt'],
    ['@babel/standalone/LICENSE', 'babel-LICENSE.txt'], ['vue/LICENSE', 'vue-LICENSE.txt'],
  ]) await write(target, await fs.readFile(path.join(toolingRoot, 'node_modules', source)));
  for (const [source, target] of [['host.mjs', 'playground-host.js'], ['runner.js', 'playground-runner.js'], ['playground.css', 'playground.css']]) await write(target, await fs.readFile(path.join(toolingRoot, 'site/playground', source)));
  const catalog = samples.map(sample => ({ ...sample, articles: sample.sources.map(source => documents.find(doc => doc.source === source)).filter(Boolean).map(doc => ({ title: doc.label, route: doc.route })) }));
  await write('playground-samples.json', JSON.stringify(catalog));
  return files;
}
