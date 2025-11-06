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
import { NavBar } from '@/components/ui'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: var(--primary-white);
}

.main-content {
  padding-top: 0; /* NavBar is sticky, so no extra padding needed */
  min-height: calc(100vh - 60px); /* Approximate navbar height */
  /* Add left and right margins to match prototype */
  margin-left: 1rem;
  margin-right: 1rem;
}

/* Ensure proper spacing and background */
:deep(.container-fluid) {
  max-width: none;
}

/* Media queries for responsive margins */
@media (min-width: 576px) {
  .main-content {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 2rem;
    margin-right: 2rem;
  }
}

@media (min-width: 992px) {
  .main-content {
    margin-left: 2.5rem;
    margin-right: 2.5rem;
  }
}
</style> 