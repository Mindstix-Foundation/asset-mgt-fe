import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assets',
      name: 'assets',
      component: () => import('../views/assets/AssetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/employees/EmployeesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      component: () => import('../views/maintenance/MaintenanceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vendors',
      name: 'vendors',
      component: () => import('../views/vendors/VendorsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/reports/ReportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initializeAuth()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next('/dashboard')
  } else {
    next()
  }
})

export default router
