<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const authStore = useAuthStore()

// Compute whether to show navigation
const showNavigation = computed(() => {
  return route.name !== 'login'
})

// Initialize auth on app mount
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation Header - Only show when not on login page -->
    <NavBar v-if="showNavigation" />

    <!-- Main Content -->
    <main :class="showNavigation ? 'pt-0' : ''">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
.router-link-active {
  @apply text-purple-600 bg-purple-50;
}
</style>
