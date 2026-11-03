<script setup lang="ts">
import type { Article } from '../../../shared/types/article';

const route = useRoute();
const slug = computed(() => String(route.params.slug));
const { data: article, error } = await useFetch<Article>(
  () => '/api/articles/' + encodeURIComponent(slug.value)
);
if (error.value) throw createError({
  statusCode: error.value.statusCode ?? 500,
  statusMessage: 'Article could not be loaded'
});
useSeoMeta({ title: () => article.value?.title ?? '文章不存在' });
</script>

<template>
  <article v-if="article"><h1>{{ article.title }}</h1><p>{{ article.body }}</p></article>
</template>
