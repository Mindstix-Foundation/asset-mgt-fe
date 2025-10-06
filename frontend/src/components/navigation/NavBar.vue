<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top" aria-label="Main navigation">
    <div class="container-fluid">
      <!-- Logo and Brand -->
      <RouterLink to="/app/dashboard" class="navbar-brand fw-bold">
        Track<span class="brand-s">S</span>ti<span class="brand-x">x</span>
      </RouterLink>
      
      <!-- Mobile menu button -->
      <button 
        class="navbar-toggler d-lg-none" 
        type="button" 
        @click="toggleMobileMenu"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobileSidebar"
        :class="{ 'active': mobileMenuOpen }"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <!-- Desktop Navigation Menu -->
      <div class="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-for="item in navigationItems" :key="item.name">
            <RouterLink
              :to="item.path"
              class="nav-link"
              :class="{ 'active': isActiveRoute(item.path) }"
            >
              {{ item.name }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">
              QR Scanner
            </a>
          </li>
        </ul>
        
        <!-- User Info and Logout -->
        <div class="navbar-user-section d-flex align-items-center">
          <!-- Notification Dropdown -->
          <NotificationDropdown class="me-3" />
          
          <div class="user-info d-flex align-items-center" @click="handleProfile" style="cursor: pointer;" title="View Profile">
            <i class="fas fa-user-circle me-2 user-icon"></i>
            <span class="username">
              {{ authStore.getUsername() || 'Admin User' }}
            </span>
          </div>
          <button
            @click="handleLogout"
            class="btn btn-logout"
          >
            <i class="fas fa-sign-out-alt me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="mobileMenuOpen" 
      class="mobile-sidebar-overlay"
      @click="closeMobileMenu"
    ></div>
    
    <!-- Mobile Sidebar Menu -->
    <div class="mobile-sidebar" :class="{ 'open': mobileMenuOpen }">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="sidebar-brand">
          Track<span class="brand-s">S</span>ti<span class="brand-x">x</span>
        </div>
        <button class="sidebar-close-btn" @click="closeMobileMenu">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Sidebar Navigation -->
      <nav class="sidebar-nav" aria-label="Mobile navigation menu">
        <ul class="sidebar-nav-list">
          <li class="sidebar-nav-item" v-for="item in navigationItems" :key="item.name">
            <RouterLink
              :to="item.path"
              class="sidebar-nav-link"
              :class="{ 'active': isActiveRoute(item.path) }"
              @click="closeMobileMenu"
            >
              <i :class="getNavIcon(item.name)" class="sidebar-nav-icon"></i>
              {{ item.name }}
            </RouterLink>
          </li>
          <li class="sidebar-nav-item">
            <a class="sidebar-nav-link disabled" href="#" tabindex="-1" aria-disabled="true">
              <i class="fas fa-qrcode sidebar-nav-icon"></i>
              QR Scanner
            </a>
          </li>
        </ul>
      </nav>
      
      <!-- Sidebar Footer with User Info -->
      <div class="sidebar-footer">
        <div class="sidebar-user-info" @click="handleProfile" style="cursor: pointer;">
          <i class="fas fa-user-circle sidebar-user-icon"></i>
          <div class="sidebar-user-details">
            <span class="sidebar-username">{{ authStore.getUsername() || 'Admin User' }}</span>
            <span class="sidebar-user-role">Administrator</span>
          </div>
        </div>
        
        <!-- Mobile Notifications -->
        <div class="sidebar-notifications">
          <NotificationDropdown />
        </div>
        
        <button @click="handleProfile" class="sidebar-profile-btn">
          <i class="fas fa-user me-2"></i>
          My Profile
        </button>
        <button @click="handleLogout" class="sidebar-logout-btn">
          <i class="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NotificationDropdown from '@/components/notifications/NotificationDropdown.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    path: '/app/dashboard'
  },
  {
    name: 'Assets & Inventory',
    path: '/app/assets'
  },
  {
    name: 'Employees',
    path: '/app/employees'
  },
  {
    name: 'Maintenance',
    path: '/app/maintenance'
  },
  {
    name: 'Vendors',
    path: '/app/vendors'
  },
  {
    name: 'Reports',
    path: '/app/reports'
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

const handleProfile = () => {
  router.push('/app/profile')
}

// QR scanner disabled - keep placeholder without action
const handleQRScanner = () => {}

const getNavIcon = (itemName: string) => {
  const icons: Record<string, string> = {
    'Dashboard': 'fas fa-tachometer-alt',
    'Assets & Inventory': 'fas fa-boxes',
    'Employees': 'fas fa-users',
    'Maintenance': 'fas fa-tools',
    'Vendors': 'fas fa-handshake',
    'Reports': 'fas fa-chart-bar'
  }
  return icons[itemName] || 'fas fa-circle'
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

/* User section styling */
.navbar-user-section {
  gap: 1rem;
}

.user-info {
  color: var(--primary-dark-gray);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.user-icon {
  font-size: 1.2rem;
  color: var(--secondary-purple);
}

.username {
  font-size: 0.9rem;
  font-weight: 500;
}


/* Logout button styling */
.btn-logout {
  border: 1px solid var(--element-gray);
  background-color: transparent;
  color: var(--primary-dark-gray);
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-logout:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(10, 10, 10, 0.1);
  background-color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  color: white !important;
}

/* Mobile Sidebar Overlay */
.mobile-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile Sidebar */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: -320px;
  width: 320px;
  height: 100vh;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--primary-light-gray) 100%);
  z-index: 1050;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--element-gray);
}

.mobile-sidebar.open {
  left: 0;
}

/* Sidebar Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid var(--element-gray);
  background-color: var(--bg-primary);
}

.sidebar-brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-black);
}

.sidebar-close-btn {
  background: none;
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: var(--primary-dark-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-close-btn:hover {
  background-color: var(--secondary-red);
  border-color: var(--secondary-red);
  color: white;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav-item {
  margin: 0;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: var(--primary-dark-gray);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-nav-link:hover {
  background-color: var(--primary-light-gray);
  color: var(--primary-black);
  border-left-color: var(--secondary-purple);
  padding-left: 2rem;
}

.sidebar-nav-link.active {
  background-color: var(--secondary-purple);
  color: white;
  border-left-color: var(--accent-navy);
  font-weight: 600;
}

.sidebar-nav-link.active:hover {
  background-color: var(--secondary-purple);
  color: white;
  padding-left: 2rem;
}

.sidebar-nav-icon {
  width: 20px;
  margin-right: 1rem;
  text-align: center;
  font-size: 1.1rem;
}

/* Sidebar Footer */
.sidebar-footer {
  border-top: 1px solid var(--element-gray);
  padding: 1.5rem;
  background-color: var(--primary-light-gray);
}

.sidebar-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  border: 1px solid var(--element-gray);
}

.sidebar-user-icon {
  font-size: 2.5rem;
  color: var(--secondary-purple);
  margin-right: 1rem;
}

.sidebar-user-details {
  display: flex;
  flex-direction: column;
}

.sidebar-username {
  font-weight: 600;
  color: var(--primary-black);
  font-size: 1rem;
  line-height: 1.2;
}

.sidebar-user-role {
  font-size: 0.85rem;
  color: var(--primary-dark-gray);
  margin-top: 0.25rem;
}

.sidebar-user-info:hover {
  background-color: rgba(102, 126, 234, 0.05);
  border-radius: 0.5rem;
}

.sidebar-notifications {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.sidebar-profile-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #667eea;
  border: 1px solid #667eea;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.sidebar-profile-btn:hover {
  background-color: #5469d4;
  border-color: #5469d4;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}


.sidebar-logout-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--secondary-red);
  border: 1px solid var(--secondary-red);
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-logout-btn:hover {
  background-color: #d63447;
  border-color: #d63447;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(214, 52, 71, 0.3);
}

/* Mobile responsiveness adjustments */
@media (max-width: 991.98px) {
  .navbar .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 576px) {
  .navbar .container-fluid {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .navbar-brand {
    font-size: 1rem;
  }
  
  .mobile-sidebar {
    width: 280px;
    left: -280px;
  }
  
  .sidebar-header {
    padding: 1rem 1rem 0.75rem 1rem;
  }
  
  .sidebar-brand {
    font-size: 1.1rem;
  }
  
  .sidebar-nav-link {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }
  
  .sidebar-nav-link:hover {
    padding-left: 1.5rem;
  }
  
  .sidebar-nav-link.active:hover {
    padding-left: 1.5rem;
  }
  
  .sidebar-footer {
    padding: 1rem;
  }
  
  .sidebar-user-info {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .sidebar-user-icon {
    font-size: 2rem;
    margin-right: 0.75rem;
  }
}

/* Animation for navbar collapse */
.navbar-collapse {
  transition: all 0.3s ease;
}

/* Hamburger menu button styling */
.navbar-toggler {
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
  background-color: transparent;
}

.navbar-toggler:hover {
  background-color: var(--primary-light-gray);
  border-color: var(--primary-dark-gray);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.25rem rgba(51, 31, 234, 0.25);
  border-color: var(--secondary-purple);
}

.navbar-toggler.active {
  background-color: var(--secondary-purple);
  border-color: var(--secondary-purple);
}

.navbar-toggler.active .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='white' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M6 18L18 6M6 6l12 12'/%3e%3c/svg%3e");
}

.navbar-toggler-icon {
  transition: all 0.3s ease;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2810, 10, 10, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  width: 1.2rem;
  height: 1.2rem;
}

/* Slide down animation for mobile menu */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 