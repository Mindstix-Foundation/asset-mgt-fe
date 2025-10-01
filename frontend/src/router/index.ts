import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/login',
      redirect: '/'
    },
    {
      path: '/app',
      component: MainLayout,
      redirect: '/app/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/DashboardView.vue'),
        },
        {
          path: 'assets',
          name: 'assets',
          component: () => import('../views/assets/AssetsView.vue'),
        },
        {
          path: 'assets/add',
          name: 'add-asset',
          component: () => import('../views/assets/AddAssetView.vue'),
        },
        {
          path: 'assets/edit/:id',
          name: 'edit-asset',
          component: () => import('../views/assets/EditAssetView.vue'),
        },
        {
          path: 'assets/manage-categories',
          name: 'manage-asset-categories',
          component: () => import('../views/assets/ManageAssetCategoriesView.vue'),
        },
        {
          path: 'assets/issue',
          name: 'issue-asset',
          component: () => import('../views/assets/IssueAssetView.vue'),
        },
        {
          path: 'assets/collect',
          name: 'collect-asset',
          component: () => import('../views/assets/CollectAssetView.vue'),
        },
        {
          path: 'assets/:id/history',
          name: 'asset-history',
          component: () => import('../views/assets/AssetHistoryView.vue'),
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('../views/employees/EmployeesView.vue'),
        },
        {
          path: 'employees/add',
          name: 'add-employee',
          component: () => import('../views/employees/AddEmployeeView.vue'),
        },
        {
          path: 'employees/edit/:id',
          name: 'edit-employee',
          component: () => import('../views/employees/EditEmployeeView.vue'),
        },
        {
          path: 'employees/:id/history',
          name: 'employee-asset-history',
          component: () => import('../views/employees/EmployeeAssetHistory.vue'),
        },
        {
          path: 'maintenance',
          name: 'maintenance',
          component: () => import('../views/maintenance/MaintenanceView.vue'),
        },
        {
          path: 'maintenance/:assetId/history',
          name: 'maintenance-history',
          component: () => import('../views/maintenance/MaintenanceHistoryView.vue'),
        },
        {
          path: 'maintenance/schedule',
          name: 'schedule-maintenance',
          component: () => import('../views/maintenance/ScheduleMaintenanceView.vue'),
        },
        {
          path: 'maintenance/edit/:id',
          name: 'edit-maintenance',
          component: () => import('../views/maintenance/EditMaintenanceView.vue'),
        },
        {
          path: 'vendors',
          name: 'vendors',
          component: () => import('../views/vendors/VendorsView.vue'),
        },
        {
          path: 'vendors/add',
          name: 'add-vendor',
          component: () => import('../views/vendors/AddVendorView.vue'),
        },
        {
          path: 'vendors/edit/:id',
          name: 'edit-vendor',
          component: () => import('../views/vendors/EditVendorView.vue'),
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('../views/reports/ReportsView.vue'),
        },
      ],
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  const isAuthenticated = authStore.isAuthenticated
  
  // If going to login page but already authenticated, redirect to dashboard
  if (to.path === '/' && isAuthenticated) {
    next('/app/dashboard')
    return
  }
  
  // If going to protected routes but not authenticated, redirect to login
  if (to.path.startsWith('/app') && !isAuthenticated) {
    next('/')
    return
  }
  
  // Otherwise, allow navigation
  next()
})

export default router
