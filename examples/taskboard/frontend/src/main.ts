import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import TaskPage from './TaskPage.vue';
import './style.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: TaskPage }]
});
createApp(App).use(createPinia()).use(router).mount('#app');
