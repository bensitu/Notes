<template>
  <NuxtRouteAnnouncer />
  <main>
    <nav><NuxtLink to="/">首页</NuxtLink></nav>
    <NuxtPage />
  </main>
</template>

<style>
body { margin: 0; font: 1rem/1.6 system-ui, sans-serif; background: #f4f6fa; color: #172033; }
main { width: min(100% - 2rem, 48rem); margin: 2rem auto; padding: 1rem; background: white; }
button { font: inherit; padding: .6rem; }
:focus-visible { outline: 3px solid #1c58b7; outline-offset: 3px; }
</style>
