import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router';
import { TaskPage } from './TaskPage';
import './style.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element is missing');
createRoot(root).render(<StrictMode>
  <BrowserRouter>
    <main>
      <nav aria-label="主导航"><NavLink to="/">任务</NavLink> · <NavLink to="/about">关于</NavLink></nav>
      <Routes>
        <Route path="/" element={<TaskPage />} />
        <Route path="/about" element={<section><h1>关于示例</h1><p>这是浏览器端渲染的 React SPA。</p></section>} />
        <Route path="*" element={<h1>页面不存在</h1>} />
      </Routes>
    </main>
  </BrowserRouter>
</StrictMode>);
