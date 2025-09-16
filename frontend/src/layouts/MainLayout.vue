<template>
  <div class="main-layout">
    <!-- Navigation Bar -->
    <NavBar />
    
    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/navigation/NavBar.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.main-content {
  padding-top: 0; /* NavBar is sticky, so no extra padding needed */
  min-height: calc(100vh - 60px); /* Approximate navbar height */
}

/* Ensure proper spacing and background */
:deep(.container-fluid) {
  max-width: none;
}
</style> 