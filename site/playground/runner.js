/* User code runs only inside an opaque-origin sandbox, never in the article window. */
(() => {
  const payload = JSON.parse(document.getElementById('payload').textContent);
  const send = (type, value) => parent.postMessage({ channel: 'notes-playground', runId: payload.runId, type, value: String(value).slice(0, 4000) }, '*');
  const format = value => {
    try { return typeof value === 'string' ? value : JSON.stringify(value) ?? String(value); }
    catch { return String(value); }
  };
  let count = 0;
  for (const level of ['log', 'info', 'warn', 'error']) console[level] = (...args) => { if (++count <= 100) send(level, args.map(format).join(' ')); };
  addEventListener('error', event => send('error', event.message));
  addEventListener('unhandledrejection', event => send('error', event.reason?.stack || event.reason));
  const load = name => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => reject(new Error('运行库加载超时，请重新运行：' + name)), 15000);
    script.src = payload.assets + name;
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); reject(new Error('无法加载运行库：' + name)); };
    document.head.append(script);
  });
  (async () => {
    try {
      if (payload.kind === 'react') { await load('playground-react.js'); await load('playground-babel.js'); }
      if (payload.kind === 'vue') await load('playground-vue.js');
      const app = document.getElementById('app');
      if (payload.kind === 'html') {
        app.innerHTML = payload.files['index.html'];
        const style = document.createElement('style');
        style.textContent = payload.files['style.css'];
        document.head.append(style);
      }
      const code = payload.kind === 'html' ? payload.files['script.js'] : payload.kind === 'react'
        ? Babel.transform(payload.files['App.jsx'], { filename: 'App.jsx', presets: [['react', { runtime: 'classic' }]], sourceType: 'script' }).code
        : payload.files['app.js'];
      new Function(code)();
      send('ready', '运行完成');
    } catch (error) { send('error', error.stack || error.message); }
  })();
})();
