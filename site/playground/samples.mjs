const sourceSamples = [
  {
    id: 'html-basics', title: 'HTML / CSS / JavaScript', kind: 'html',
    description: 'HTML 定义内容，CSS 控制外观，JavaScript 响应点击。先修改标题或颜色，再点“运行”观察变化。',
    sources: ['前端基础_HTML&CSS.md', '前端基础-js.md'],
    files: {
      'index.html': '<main class="card">\n  <p class="eyebrow">我的第一个交互页面</p>\n  <h1>每天进步一点点</h1>\n  <p>已完成 <strong id="count">0</strong> 次练习</p>\n  <button id="add" type="button">完成一次练习</button>\n</main>',
      'style.css': 'body { margin: 0; padding: 32px 20px; background: #f3f5fa; color: #24324b; font: 16px/1.7 system-ui, sans-serif; }\n.card { max-width: 420px; margin: auto; padding: 28px; background: white; border: 1px solid #dae1ed; border-radius: 16px; }\n.eyebrow { color: #65738a; font-size: 13px; }\nh1 { font-size: 25px; }\nbutton { padding: 10px 16px; border: 0; border-radius: 8px; background: #3451b2; color: white; font: inherit; cursor: pointer; }',
      'script.js': 'let count = 0;\nconst output = document.querySelector("#count");\ndocument.querySelector("#add").addEventListener("click", () => {\n  count += 1;\n  output.textContent = String(count);\n  console.log("已完成的练习：", count);\n});',
    },
  },
  {
    id: 'react-counter', title: 'React', kind: 'react',
    description: 'useState 保存组件状态。点击按钮更新状态后，React 会更新页面。修改 JSX 后运行即可看到结果。已提供全局 React 和 ReactDOM，可直接使用；这里不支持 import 或 TypeScript。',
    sources: ['React基础与组件.md', 'React工程化与测试.md'],
    files: { 'App.jsx': 'const { useState } = React;\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <main style={{ padding: 28, fontFamily: "system-ui, sans-serif" }}>\n      <h1>React 练习计数器</h1>\n      <p>已完成 {count} 次练习</p>\n      <button onClick={() => setCount(value => value + 1)}>完成一次练习</button>\n    </main>\n  );\n}\n\nReactDOM.createRoot(document.getElementById("app")).render(<App />);' },
  },
  {
    id: 'vue-counter', title: 'Vue', kind: 'vue',
    description: 'ref 保存响应式数据。数据变化后，Vue 会更新模板中对应的内容。已提供全局 Vue，使用浏览器模板编译版本；这里不编译 .vue 单文件组件，也不支持 import。',
    sources: ['前端基础-vue3.md', 'VUE基础.md'],
    files: { 'app.js': 'const { createApp, ref, computed } = Vue;\n\ncreateApp({\n  setup() {\n    const count = ref(0);\n    const message = computed(() => count.value >= 3 ? "今天的目标已完成" : "继续练习吧");\n    const increment = () => { count.value += 1; };\n    return { count, message, increment };\n  },\n  template: `\n    <main style="padding: 28px; font-family: system-ui, sans-serif">\n      <h1>Vue 练习计数器</h1>\n      <p>已完成 {{ count }} 次练习</p>\n      <p>{{ message }}</p>\n      <button @click="increment">完成一次练习</button>\n    </main>\n  `,\n}).mount("#app");' },
  },
  {
    id: 'ssr-compare', title: 'CSR / SSR / 水合', kind: 'ssr',
    description: '这是浏览器内的原理模拟。按步骤观察：初始 HTML 是否包含正文，按钮何时能交互，以及水合如何接管已有页面。它没有启动 Node 服务，也没有运行 Next.js 或 Nuxt。',
    sources: ['SSR与水合原理.md', 'Next.js与AppRouter实践.md', 'Nuxt全栈与SSR实践.md', 'SSR部署与缓存安全.md'],
    files: {},
  },
];

const translations = {
  'html-basics': {
    en: { description: 'HTML defines content, CSS controls appearance, and JavaScript responds to clicks. Change the heading or color, then select “Run” to see the result.' },
    ja: { description: 'HTMLは内容を定義し、CSSは見た目を整え、JavaScriptはクリックに応答します。見出しや色を変更し、「実行」で結果を確認しましょう。' },
  },
  'react-counter': {
    en: { description: 'useState stores component state. React updates the page after a button changes that state. Edit the JSX and run to see the result. Global React and ReactDOM are provided; import and TypeScript are not supported here.' },
    ja: { description: 'useStateはコンポーネントの状態を保持します。ボタンで状態を変えるとReactが画面を更新します。JSXを編集して実行しましょう。グローバルのReactとReactDOMが利用でき、importとTypeScriptには対応していません。' },
  },
  'vue-counter': {
    en: { description: 'ref stores reactive data. Vue updates the corresponding template content when it changes. Global Vue is provided with the browser template compiler; this playground does not compile .vue single-file components or support import.' },
    ja: { description: 'refはリアクティブなデータを保持し、変化するとVueが対応するテンプレートの内容を更新します。テンプレートコンパイラー付きのグローバルVueを利用します。.vue単一ファイルコンポーネントのコンパイルとimportには対応していません。' },
  },
  'ssr-compare': {
    en: { title: 'CSR / SSR / Hydration', description: 'This browser simulation demonstrates the principles. Follow the steps to see whether initial HTML contains readable content, when buttons become interactive, and how hydration takes over the existing page. It does not start a Node server or run Next.js or Nuxt.' },
    ja: { title: 'CSR / SSR / ハイドレーション', description: 'ブラウザー内で仕組みを再現するデモです。初期HTMLに本文があるか、ボタンがいつ操作可能になるか、ハイドレーションが既存のページをどう引き継ぐかを順に確認します。Nodeサーバーの起動やNext.js、Nuxtの実行は行いません。' },
  },
};
const interfaceStrings = {
  en: {
    '我的第一个交互页面': 'My first interactive page', '每天进步一点点': 'A little progress every day',
    '已完成的练习：': 'Completed exercises:', '已完成 ': 'Exercises completed: ', ' 次练习': '',
    '完成一次练习': 'Complete one exercise', '练习计数器': 'practice counter',
    '今天的目标已完成': "Today's goal is complete", '继续练习吧': 'Keep practicing',
  },
  ja: {
    '我的第一个交互页面': '初めての操作できるページ', '每天进步一点点': '毎日少しずつ上達',
    '已完成的练习：': '完了した練習：', '已完成 ': '完了した練習：', ' 次练习': '回',
    '完成一次练习': '練習を1回完了', '练习计数器': '練習カウンター',
    '今天的目标已完成': '今日の目標を達成しました', '继续练习吧': '練習を続けましょう',
  },
};
export const samples = sourceSamples.map(sample => ({
  ...sample,
  locales: Object.fromEntries(['en', 'ja'].map(language => [language, {
    ...translations[sample.id][language],
    files: Object.fromEntries(Object.entries(sample.files).map(([name, source]) => [name,
      Object.entries(interfaceStrings[language]).reduce((text, [original, translated]) => text.replaceAll(original, translated), source),
    ])),
  }])),
}));

export const playgroundRoute = language => (language === 'zh' ? '' : '/' + language) + '/playground';
