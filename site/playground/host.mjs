const drafts = new Map();
let catalogPromise;
let navigationPromise;
const copy = {
  zh: { choose: '选择示例', run: '运行', reset: '重置示例', stop: '停止', preview: '预览', console: '控制台', clear: '清空', editing: '修改后请运行 · Ctrl / ⌘ + Enter', running: '正在加载运行库…', ready: '已运行', stopped: '已停止', error: '运行出错，请查看控制台', empty: '代码中的 console.log 和错误会显示在这里。', related: '配套阅读', editor: '代码编辑器', hint: '运行会重新创建预览，组件状态也会重置。草稿仅在当前页面会话中保留，刷新后恢复示例。' },
  en: { choose: 'Choose example', run: 'Run', reset: 'Reset example', stop: 'Stop', preview: 'Preview', console: 'Console', clear: 'Clear', editing: 'Run after editing · Ctrl / ⌘ + Enter', running: 'Loading runtime…', ready: 'Running', stopped: 'Stopped', error: 'Execution failed; see console', empty: 'console.log output and errors appear here.', related: 'Related articles', editor: 'Code editor', hint: 'Running recreates the preview and resets component state. Drafts last for this page session; reloading restores the examples.' },
  ja: { choose: 'サンプルを選択', run: '実行', reset: 'サンプルをリセット', stop: '停止', preview: 'プレビュー', console: 'コンソール', clear: '消去', editing: '編集後に実行 · Ctrl / ⌘ + Enter', running: 'ランタイムを読み込み中…', ready: '実行済み', stopped: '停止済み', error: '実行エラー。コンソールを確認してください', empty: 'console.log とエラーがここに表示されます。', related: '関連記事', editor: 'コードエディター', hint: '実行するとプレビューを作り直し、状態をリセットします。下書きは現在のページセッション中だけ保持され、再読み込みで元に戻ります。' },
};
const simulationCopy = {
  zh: {
    next: '下一步', restart: '重新开始', disableJS: '模拟禁用 JavaScript',
    labels: ['等待响应', '收到初始 HTML', '浏览器 JavaScript 就绪', 'SSR 水合完成'],
    explanations: [
      '还没有收到页面内容。点“下一步”模拟 HTML 到达浏览器。步骤只表示先后关系，不代表真实耗时。',
      'CSR 的初始 HTML 只有挂载容器，正文要等脚本生成。SSR 的初始 HTML 已有正文，浏览器可以先显示；按钮仍需脚本绑定事件。',
      'CSR 现在已渲染组件并绑定事件。SSR 一侧把“脚本就绪”和“水合完成”拆开来展示：框架还要接管已有 DOM，交互才能就绪。',
      '水合使已有 HTML 与组件状态、事件处理连接起来。此时两个按钮都能交互。这是简化流程；真实框架还可能流式发送内容、分批水合。',
    ],
    csr: 'CSR · 客户端渲染', ssr: 'SSR · 服务器端渲染', initialHTML: '初始 HTML（省略脚本标签和状态数据）', browserView: '模拟浏览器看到的内容',
    hint: '“模拟禁用”只改变本演示的流程，并没有关闭当前网站的 JavaScript。服务器数据请求、网络速度、SEO 和真实水合错误，请结合配套文章及本地 Next.js / Nuxt 工程验证。',
    noJS: '没有浏览器 JavaScript：SSR 仍能显示初始正文；这个计数器无法交互。CSR 只有空容器。表单和普通链接等原生 HTML 功能是否可用，取决于真实页面如何编写。',
    waitingHTML: '等待 HTML…', waitingJS: '空容器，等待 JavaScript…', counter: '练习计数器', increment: '完成一次练习', completed: n => `已完成 ${n} 次练习`, pending: '正文可读，交互尚未就绪', interactive: '事件已绑定，可以交互',
  },
  en: {
    next: 'Next step', restart: 'Start over', disableJS: 'Simulate disabled JavaScript',
    labels: ['Waiting for response', 'Initial HTML received', 'Browser JavaScript ready', 'SSR hydration complete'],
    explanations: [
      'No page content has arrived yet. Select “Next step” to simulate HTML reaching the browser. These steps show sequence, not actual elapsed time.',
      'The initial CSR HTML contains only a mount container; scripts must generate its content. The initial SSR HTML already contains readable content, but buttons still need scripts to attach event handlers.',
      'CSR has now rendered its components and attached events. The SSR side shows “scripts ready” and “hydration complete” separately: the framework must take over the existing DOM before interaction is ready.',
      'Hydration connects the existing HTML to component state and event handlers. Both buttons now work. This is a simplified flow; real frameworks may also stream content and hydrate in stages.',
    ],
    csr: 'CSR · Client-side rendering', ssr: 'SSR · Server-side rendering', initialHTML: 'Initial HTML (scripts and state data omitted)', browserView: 'Simulated browser content',
    hint: 'The simulation changes only this demo; it does not disable JavaScript on this site. Use the related articles and local Next.js / Nuxt projects to verify server data requests, network speed, SEO, and actual hydration errors.',
    noJS: 'Without browser JavaScript, SSR still displays its initial content, but this counter cannot respond to clicks. CSR has only an empty container. Whether native HTML features such as forms and ordinary links work depends on how the real page is built.',
    waitingHTML: 'Waiting for HTML…', waitingJS: 'Empty container, waiting for JavaScript…', counter: 'Practice counter', increment: 'Complete one exercise', completed: n => `Exercises completed: ${n}`, pending: 'Content is readable; interaction is not ready', interactive: 'Events attached; ready to interact',
  },
  ja: {
    next: '次のステップ', restart: '最初から', disableJS: 'JavaScriptの無効化をシミュレート',
    labels: ['応答を待機', '初期HTMLを受信', 'ブラウザーのJavaScriptが準備完了', 'SSRのハイドレーションが完了'],
    explanations: [
      'ページの内容はまだ届いていません。「次のステップ」でHTMLの到着を再現します。手順は順序を表し、実際の所要時間は表しません。',
      'CSRの初期HTMLにはマウント先のコンテナーだけがあり、本文はスクリプトが生成します。SSRの初期HTMLには本文があり、先に読めますが、ボタンにはスクリプトによるイベントの登録が必要です。',
      'CSRはコンポーネントを描画し、イベントを登録しました。SSR側ではスクリプトの準備とハイドレーションの完了を分けています。操作可能になるには、フレームワークが既存のDOMを引き継ぐ必要があります。',
      'ハイドレーションは既存のHTMLにコンポーネントの状態とイベント処理を結び付けます。両方のボタンを操作できます。これは簡略化した流れで、実際にはストリーミングや段階的なハイドレーションもあります。',
    ],
    csr: 'CSR · クライアント側レンダリング', ssr: 'SSR · サーバー側レンダリング', initialHTML: '初期HTML（スクリプトと状態データは省略）', browserView: 'ブラウザーの表示をシミュレート',
    hint: 'この設定はデモの流れだけを変え、このサイトのJavaScriptは無効にしません。サーバーのデータ取得、通信速度、SEO、実際のハイドレーションエラーは、関連記事とローカルのNext.js / Nuxtプロジェクトで検証してください。',
    noJS: 'ブラウザーのJavaScriptがなくてもSSRの初期本文は表示されますが、このカウンターは操作できません。CSRには空のコンテナーだけが残ります。フォームや通常のリンクなど、HTML標準の機能が使えるかは実際のページの実装次第です。',
    waitingHTML: 'HTMLを待機中…', waitingJS: '空のコンテナーでJavaScriptを待機中…', counter: '練習カウンター', increment: '練習を1回完了', completed: n => `完了した練習：${n}回`, pending: '本文は読めますが、操作はまだできません', interactive: 'イベント登録済み、操作できます',
  },
};
const extraCopy = {
  zh: { files: '文件', loadError: '无法加载练习示例，请刷新页面重试。', original: '中文原文' },
  en: { files: 'Files', loadError: 'Could not load the examples. Reload the page to try again.', original: 'Chinese original' },
  ja: { files: 'ファイル', loadError: 'サンプルを読み込めませんでした。ページを再読み込みしてください。', original: '中国語の原文' },
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function button(text, action, className = '') {
  const node = element('button', className, text);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

export async function mountPlayground(root, { assetPath, language }) {
  language = Object.hasOwn(copy, language) ? language : 'zh';
  const t = { ...copy[language], ...extraCopy[language] };
  catalogPromise ||= fetch(assetPath + 'playground-samples.json').then(response => { if (!response.ok) throw new Error('Sample catalog unavailable'); return response.json(); }).catch(error => { catalogPromise = undefined; throw error; });
  navigationPromise ||= fetch(assetPath + 'navigation.json').then(response => { if (!response.ok) throw new Error('Navigation unavailable'); return response.json(); }).catch(() => { navigationPromise = undefined; return null; });
  let samples, navigation;
  try {
    const [catalog, loadedNavigation] = await Promise.all([catalogPromise, navigationPromise]);
    samples = catalog.map(sample => ({ ...sample, ...sample.locales?.[language] }));
    navigation = loadedNavigation;
  } catch {
    if (root.isConnected) { const error = element('p', 'pg-error', t.loadError); error.setAttribute('role', 'alert'); root.replaceChildren(error); }
    return () => {};
  }
  if (!root.isConnected) return () => {};
  let frame;
  let runId;
  let current;
  let activeFile;
  let disposed = false;
  const selector = element('select', 'pg-select');
  selector.id = 'pg-sample';
  for (const sample of samples) selector.add(new Option(sample.title, sample.id));
  const label = element('label', '', t.choose);
  label.htmlFor = selector.id;
  const toolbar = element('div', 'pg-toolbar');
  toolbar.append(label, selector);
  const description = element('p', 'pg-description');
  const related = element('nav', 'pg-related');
  related.setAttribute('aria-label', t.related);
  const workspace = element('div', 'pg-workspace');
  const editorPanel = element('section', 'pg-panel');
  editorPanel.setAttribute('aria-label', t.editor);
  const files = element('div', 'pg-files');
  files.setAttribute('role', 'group');
  files.setAttribute('aria-label', t.files);
  const editor = element('textarea', 'pg-editor');
  editor.spellcheck = false;
  editor.autocapitalize = 'off';
  editor.autocomplete = 'off';
  editor.setAttribute('wrap', 'off');
  const status = element('span', 'pg-status');
  status.setAttribute('role', 'status');
  const actions = element('div', 'pg-actions');
  const runButton = button(t.run, run, 'pg-primary');
  runButton.setAttribute('aria-keyshortcuts', 'Control+Enter Meta+Enter');
  const stopButton = button(t.stop, () => { stop(); status.textContent = t.stopped; });
  stopButton.disabled = true;
  const draftKey = () => language + ':' + current.id;
  actions.append(runButton, button(t.reset, () => { drafts.delete(draftKey()); select(current.id); }), stopButton, status);
  editorPanel.append(files, editor, actions);
  const resultPanel = element('section', 'pg-panel pg-result');
  const previewTitle = element('div', 'pg-panel-title', t.preview);
  const preview = element('div', 'pg-preview');
  const consoleHead = element('div', 'pg-panel-title');
  const consoleTitle = element('span', '', t.console);
  const logs = element('div', 'pg-logs');
  logs.setAttribute('role', 'log');
  logs.setAttribute('aria-label', t.console);
  const clearLogs = () => { logs.replaceChildren(element('p', 'pg-log-empty', t.empty)); };
  clearLogs();
  consoleHead.append(consoleTitle, button(t.clear, clearLogs));
  resultPanel.append(previewTitle, preview, consoleHead, logs);
  workspace.append(editorPanel, resultPanel);
  const hint = element('p', 'pg-hint', t.hint);
  const simulation = element('div', 'pg-simulation');
  root.replaceChildren(toolbar, description, related, workspace, hint, simulation);

  function stop() {
    runId = null;
    frame?.remove();
    frame = null;
    stopButton.disabled = true;
  }
  function run() {
    if (disposed || !current || current.kind === 'ssr') return;
    stop();
    clearLogs();
    runId = crypto.randomUUID();
    status.textContent = t.running;
    const payload = { runId, assets: new URL(assetPath, location.origin).href, kind: current.kind, language, files: drafts.get(draftKey()) };
    const assetUrl = new URL(assetPath, location.origin).href;
    const escaped = JSON.stringify(payload).replaceAll('<', '\\u003c');
    frame = element('iframe', 'pg-frame');
    frame.title = t.preview + ' · ' + current.title;
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.referrerPolicy = 'no-referrer';
    const policy = `default-src 'none'; script-src 'unsafe-eval' ${assetUrl}; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none'`;
    frame.srcdoc = `<!doctype html><html lang="${language === 'zh' ? 'zh-CN' : language}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;background:#fff;color:#24324b;font:16px/1.7 system-ui,sans-serif}button{font:inherit;cursor:pointer}*{box-sizing:border-box}</style></head><body><div id="app"></div><script id="payload" type="application/json">${escaped}</script><script src="${assetUrl}playground-runner.js"></script></body></html>`;
    preview.replaceChildren(frame);
    stopButton.disabled = false;
  }
  const receive = event => {
    const data = event.data;
    if (disposed || event.source !== frame?.contentWindow || data?.channel !== 'notes-playground' || data.runId !== runId || typeof data.value !== 'string') return;
    if (data.type === 'ready') { if (status.dataset.error !== runId) status.textContent = t.ready; return; }
    if (!['log', 'info', 'warn', 'error'].includes(data.type) || logs.childElementCount >= 100) return;
    logs.querySelector('.pg-log-empty')?.remove();
    logs.append(element('pre', 'pg-log pg-log-' + data.type, data.value.slice(0, 4000)));
    if (data.type === 'error') { status.textContent = t.error; status.dataset.error = runId; }
  };
  window.addEventListener('message', receive);
  function showFile(name) {
    activeFile = name;
    editor.value = drafts.get(draftKey())[name];
    editor.setAttribute('aria-label', name + ' · ' + t.editor);
    for (const item of files.children) item.setAttribute('aria-pressed', String(item.textContent === name));
  }
  editor.addEventListener('input', () => { drafts.get(draftKey())[activeFile] = editor.value; status.textContent = t.editing; });
  editor.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); run(); }
  });
  function select(id) {
    stop();
    current = samples.find(item => item.id === id) || samples[0];
    selector.value = current.id;
    if (!drafts.has(draftKey())) drafts.set(draftKey(), { ...current.files });
    const url = new URL(location.href);
    url.hash = url.hash.split('?')[0] + '?demo=' + current.id;
    history.replaceState(null, '', url);
    description.textContent = current.description;
    related.replaceChildren(element('span', '', t.related + '：'));
    for (const doc of current.articles) {
      const source = navigation?.documents.find(item => item.route === doc.route);
      const translated = navigation?.locales[language]?.find(item => item.source === source?.source);
      const title = translated && !translated.fallback ? translated.label : language === 'zh' ? doc.title : `${t.original} · ${doc.title}`;
      const link = element('a', '', title);
      link.href = '#' + (translated?.route || doc.route);
      related.append(link);
    }
    const isSimulation = current.kind === 'ssr';
    workspace.hidden = isSimulation;
    hint.hidden = isSimulation;
    simulation.hidden = !isSimulation;
    if (isSimulation) { renderSimulation(simulation, language); return; }
    simulation.replaceChildren();
    files.replaceChildren();
    for (const name of Object.keys(current.files)) files.append(button(name, () => showFile(name)));
    showFile(Object.keys(current.files)[0]);
    run();
  }
  selector.addEventListener('change', () => select(selector.value));
  select(new URLSearchParams(location.hash.split('?')[1]).get('demo'));
  return () => { disposed = true; stop(); window.removeEventListener('message', receive); };
}

function renderSimulation(root, language) {
  const t = simulationCopy[language];
  let phase = 0;
  let disabledJS = false;
  const counts = { csr: 0, ssr: 0 };
  const controls = element('div', 'pg-sim-controls');
  const next = button(t.next, () => { phase = Math.min(3, phase + 1); draw(); }, 'pg-primary');
  const restart = button(t.restart, () => { phase = 0; counts.csr = counts.ssr = 0; draw(); });
  const checkbox = element('input');
  checkbox.type = 'checkbox';
  const label = element('label');
  label.append(checkbox, document.createTextNode(t.disableJS));
  checkbox.addEventListener('change', () => { disabledJS = checkbox.checked; phase = 0; counts.csr = counts.ssr = 0; draw(); });
  controls.append(next, restart, label);
  const steps = element('ol', 'pg-steps');
  const explanation = element('p', 'pg-explanation');
  explanation.setAttribute('role', 'status');
  const columns = element('div', 'pg-sim-columns');
  const views = {};
  for (const key of ['csr', 'ssr']) {
    const panel = element('section', 'pg-panel pg-sim-card');
    const heading = element('h2', '', t[key]);
    const html = key === 'csr' ? '<div id="app"></div>' : `<div id="app"><h1>${t.counter}</h1><p>${t.completed(0)}</p><button>${t.increment}</button></div>`;
    const code = element('pre', 'pg-initial-html', html);
    const view = element('div', 'pg-sim-view');
    panel.append(heading, element('p', 'pg-caption', t.initialHTML), code, element('p', 'pg-caption', t.browserView), view);
    columns.append(panel);
    views[key] = view;
  }
  root.replaceChildren(controls, steps, explanation, columns, element('p', 'pg-hint', t.hint));
  function draw() {
    next.disabled = phase === 3 || (disabledJS && phase >= 1);
    steps.replaceChildren();
    t.labels.forEach((text, index) => {
      const step = element('li', index <= phase ? 'is-reached' : '', `${index + 1}. ${text}`);
      if (index === phase) step.setAttribute('aria-current', 'step');
      steps.append(step);
    });
    explanation.textContent = disabledJS && phase === 1 ? t.noJS : t.explanations[phase];
    for (const key of ['csr', 'ssr']) {
      const view = views[key];
      view.replaceChildren();
      const visible = key === 'ssr' ? phase >= 1 : phase >= 2;
      if (!visible) { view.append(element('p', 'pg-waiting', phase === 0 ? t.waitingHTML : t.waitingJS)); continue; }
      const counter = element('p', '', t.completed(counts[key]));
      const increment = button(t.increment, () => { counts[key]++; counter.textContent = t.completed(counts[key]); });
      increment.disabled = disabledJS || phase < (key === 'ssr' ? 3 : 2);
      view.append(element('h3', '', t.counter), counter, increment, element('p', 'pg-caption', increment.disabled ? t.pending : t.interactive));
    }
  }
  draw();
}
