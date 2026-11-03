<script setup lang="ts">
import type { Article } from '../../shared/types/article';

const renderedAt = useState<string>('rendered-at', () => new Date().toISOString());
const { data: articles, error, refresh } = await useFetch<Article[]>('/api/articles', {
  key: 'public-articles'
});
useSeoMeta({ title: 'Nuxt 服务端渲染', description: '观察服务端 HTML 与客户端水合' });
</script>

<template>
  <section>
    <h1>Nuxt 服务端渲染</h1>
    <p>首次服务端渲染时间：<time data-testid="rendered-at">{{ renderedAt }}</time></p>
    <div v-if="error" role="alert">读取失败 <button @click="refresh()">重试</button></div>
    <ul v-else>
      <li v-for="article in articles ?? []" :key="article.slug">
        <NuxtLink :to="'/articles/' + article.slug">{{ article.title }}</NuxtLink>
      </li>
    </ul>
    <Counter />
  </section>
</template>
