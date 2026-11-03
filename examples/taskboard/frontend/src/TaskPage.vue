<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ApiError, login, logout } from './api';
import { useTasks } from './tasks';

const tasks = useTasks();
const password = ref('');
const title = ref('');
const loggedIn = ref(false);
const busy = ref(false);
const error = ref('');

async function run(action: () => Promise<void>) {
  if (busy.value) return;
  busy.value = true;
  error.value = '';
  try { await action(); }
  catch (reason) {
    if (reason instanceof ApiError && reason.status === 401) loggedIn.value = false;
    error.value = reason instanceof Error ? reason.message : '操作失败';
  } finally { busy.value = false; }
}
async function signIn() {
  await run(async () => {
    await login(password.value);
    password.value = '';
    loggedIn.value = true;
    await tasks.load();
  });
}
async function add() {
  const text = title.value.trim();
  if (!text || text.length > 100) { error.value = '请输入 1 到 100 个字符'; return; }
  await run(async () => { await tasks.add(text); title.value = ''; });
}
onMounted(() => run(async () => {
  await tasks.load();
  loggedIn.value = true;
}));
</script>

<template>
  <p v-if="error" role="alert">{{ error }}</p>
  <form v-if="!loggedIn" @submit.prevent="signIn">
    <p>演示账户：admin；密码使用启动后端时设置的 APP_PASSWORD。</p>
    <label for="password">密码</label>
    <input id="password" v-model="password" type="password" autocomplete="current-password" required>
    <button :disabled="busy">登录</button>
  </form>
  <section v-else aria-label="任务列表">
    <form @submit.prevent="add">
      <label for="title">任务标题</label>
      <input id="title" v-model="title" maxlength="100" required>
      <button :disabled="busy">新增</button>
    </form>
    <p aria-live="polite">{{ busy ? '处理中' : '共 ' + tasks.items.length + ' 条任务（最多显示最新 100 条）' }}</p>
    <ul>
      <li v-for="task in tasks.items" :key="task.id">
        <span :class="{ done: task.done }">{{ task.title }}</span>
        <button :disabled="busy" :aria-label="(task.done ? '恢复：' : '完成：') + task.title"
          @click="run(() => tasks.toggle(task))">{{ task.done ? '恢复' : '完成' }}</button>
      </li>
    </ul>
    <button :disabled="busy" @click="run(async () => {
      await logout(); loggedIn = false; tasks.items = [];
    })">退出登录</button>
  </section>
</template>
