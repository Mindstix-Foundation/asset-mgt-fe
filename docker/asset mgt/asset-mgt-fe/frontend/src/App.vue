<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastNotification from '@/components/common/ToastNotification.vue'
</script>

<template>
  <div id="app">
    <RouterView />
    <ToastNotification />
  </div>
</template>

<style>
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  width: 100%;
}
</style>
