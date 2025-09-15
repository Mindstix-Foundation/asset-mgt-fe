<template>
  <nav class="navbar bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <RouterLink to="/dashboard" class="flex items-center space-x-2">
            <div class="text-gray-900 text-xl font-bold">
              Track<span class="text-sm">S</span>ti<span class="brand-x">x</span>
            </div>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="nav-link text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
            :class="{ 'active bg-gray-100 text-gray-900 font-bold': isActiveRoute(item.path) }"
          >
            <i :class="item.icon" class="mr-2"></i>
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- User Info and Logout (Desktop) -->
        <div class="hidden md:flex items-center space-x-4">
          <span class="text-gray-600 text-sm">
            {{ authStore.getUsername() || 'User' }}
          </span>
          <button
            @click="handleLogout"
            class="logout-btn bg-transparent border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white"
          >
            <i class="fas fa-sign-out-alt mr-1"></i>
            Logout
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out"
          >
            <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="h-6 w-6"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 transition-all duration-300"
          :class="{ 'bg-gray-100 text-gray-900 font-bold': isActiveRoute(item.path), 'hover:bg-gray-50': !isActiveRoute(item.path) }"
        >
          <i :class="item.icon" class="mr-2"></i>
          {{ item.name }}
        </RouterLink>
      </div>
      
      <!-- Mobile User Info and Logout -->
      <div class="border-t border-gray-200 pt-4 pb-3">
        <div class="flex items-center px-5">
          <div class="text-gray-600 text-sm">
            {{ authStore.getUsername() || 'User' }}
          </div>
          <button
            @click="handleLogout"
            class="ml-auto bg-transparent border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white"
          >
            <i class="fas fa-sign-out-alt mr-1"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    name: 'Assets & Inventory',
    path: '/assets',
    icon: 'fas fa-laptop'
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: 'fas fa-users'
  },
  {
    name: 'Maintenance',
    path: '/maintenance',
    icon: 'fas fa-tools'
  },
  {
    name: 'Vendors',
    path: '/vendors',
    icon: 'fas fa-store'
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: 'fas fa-chart-bar'
  }
]

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Close mobile menu when route changes
import { watch } from 'vue'
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
/* TrackStix brand styling */
.brand-x {
  background: linear-gradient(to right, #1A2A43 50%, #0A0A0A 50%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Navbar styling */
.navbar {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Navigation link hover effects */
.nav-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link.active {
  background-color: #f3f4f6 !important;
  color: #111827 !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Logout button special styling */
.logout-btn:hover {
  background-color: #EF4444 !important;
  border-color: #EF4444 !important;
  color: white !important;
  transition: all 0.2s ease !important;
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 