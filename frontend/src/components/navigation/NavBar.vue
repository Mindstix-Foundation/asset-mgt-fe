<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container-fluid">
      <!-- Logo and Brand -->
      <RouterLink to="/dashboard" class="navbar-brand fw-bold">
        Track<span class="brand-s">S</span>ti<span class="brand-x">x</span>
      </RouterLink>
      
      <!-- Mobile menu button -->
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="toggleMobileMenu"
        :aria-expanded="mobileMenuOpen"
        aria-controls="navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <!-- Navigation Menu -->
      <div class="collapse navbar-collapse" :class="{ 'show': mobileMenuOpen }" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-for="item in navigationItems" :key="item.name">
            <RouterLink
              :to="item.path"
              class="nav-link"
              :class="{ 'active': isActiveRoute(item.path) }"
              @click="closeMobileMenu"
            >
              <i :class="item.icon" class="me-2"></i>
              {{ item.name }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleQRScanner">
              <i class="fas fa-qrcode me-2"></i>
              QR Scanner
            </a>
          </li>
        </ul>
        
        <!-- User Info and Logout -->
        <div class="d-flex align-items-center">
          <span class="text-muted me-3">
            {{ authStore.getUsername() || 'Admin User' }}
          </span>
          <button
            @click="handleLogout"
            class="btn btn-outline-light btn-sm"
          >
            <i class="fas fa-sign-out-alt me-1"></i>
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
  router.push('/')
}

const handleQRScanner = () => {
  alert('QR Scanner functionality - to be implemented')
}

// Close mobile menu when route changes
import { watch } from 'vue'
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
/* TrackStix Color Variables */
:root {
  --bg-primary: #FFFFFF;
  --primary-light-gray: #F3F3F3;
  --primary-dark-gray: #666666;
  --secondary-yellow: #FF8C61;
  --accent-navy: #1A2A43;
  --element-gray: #E0E0E0;
  --primary-black: #0A0A0A;
  --secondary-purple: #331FEA;
  --secondary-red: #E97676;
}

/* TrackStix brand styling */
.brand-x {
  background: linear-gradient(to right, var(--secondary-purple) 50%, var(--primary-black) 50%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.brand-s {
  font-size: 0.8em;
}

/* Navbar styling */
.navbar {
  box-shadow: 0 2px 4px rgba(10, 10, 10, 0.1);
  z-index: 1000;
  background: var(--bg-primary) !important;
  border-bottom: 1px solid var(--element-gray);
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-black) !important;
}

.navbar-brand i {
  color: var(--secondary-yellow);
}

/* Navigation links styling */
.navbar-nav .nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 0 2px;
  color: var(--primary-dark-gray) !important;
  position: relative;
  padding: 0.75rem 1rem !important;
}

.navbar-nav .nav-link:hover {
  background-color: var(--primary-light-gray) !important;
  color: var(--primary-black) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-nav .nav-link.active {
  background-color: transparent !important;
  color: var(--primary-black) !important;
  font-weight: 700;
}

.navbar-nav .nav-link i {
  width: 16px;
  text-align: center;
}

/* User info styling */
.navbar .text-muted {
  font-size: 0.9rem;
  color: var(--primary-dark-gray) !important;
}

/* Logout button styling */
.btn-outline-light {
  border-width: 1px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border-color: var(--element-gray);
  color: var(--primary-dark-gray);
}

.btn-outline-light:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(10, 10, 10, 0.1);
  background-color: var(--primary-dark-gray) !important;
  border-color: var(--primary-dark-gray) !important;
  color: var(--bg-primary) !important;
}

/* Mobile responsiveness */
@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--element-gray);
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    margin: 2px 0;
  }
  
  .navbar .d-flex {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--element-gray);
    justify-content: space-between;
    width: 100%;
  }
}

/* Animation for navbar collapse */
.navbar-collapse {
  transition: all 0.3s ease;
}

/* Navbar toggler animation */
.navbar-toggler {
  border: none;
  padding: 4px 8px;
  border-color: var(--element-gray);
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  transition: all 0.3s ease;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2810, 10, 10, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
</style> 