<script setup lang="ts">
const count = useState<number>('demo-counter', () => 0);
const hydrated = ref(false);
onMounted(() => { hydrated.value = true; });
</script>
<template>
  <button :data-hydrated="String(hydrated)" @click="count++">点击次数：{{ count }}</button>
</template>
