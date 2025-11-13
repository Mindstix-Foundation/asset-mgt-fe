import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../stores/auth'
import { ROUTE_NAMES } from '@/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.LOGIN,
      component: LoginView,
    },
    {
      path: '/login',
      redirect: '/',
    },
    {
      path: '/forgot-password',
      name: ROUTE_NAMES.FORGOT_PASSWORD,
      component: () => import('../views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: ROUTE_NAMES.RESET_PASSWORD,
      component: () => import('../views/auth/ResetPasswordView.vue'),
    },
    {
      path: '/app',
      component: MainLayout,
      redirect: { name: ROUTE_NAMES.DASHBOARD },
      children: [
        {
          path: 'dashboard',
          name: ROUTE_NAMES.DASHBOARD,
          component: () => import('../views/dashboard/DashboardView.vue'),
        },
        {
          path: 'assets',
          name: ROUTE_NAMES.ASSETS,
          component: () => import('../views/assets/AssetsView.vue'),
        },
        {
          path: 'assets/add',
          name: ROUTE_NAMES.ADD_ASSET,
          component: () => import('../views/assets/AddAssetView.vue'),
        },
        {
          path: 'assets/edit/:id',
          name: ROUTE_NAMES.EDIT_ASSET,
          component: () => import('../views/assets/EditAssetView.vue'),
        },
        {
          path: 'assets/manage-categories',
          name: ROUTE_NAMES.MANAGE_ASSET_CATEGORIES,
          component: () => import('../views/assets/ManageAssetCategoriesView.vue'),
        },
        {
          path: 'assets/issue',
          name: ROUTE_NAMES.ISSUE_ASSET,
          component: () => import('../views/assets/IssueAssetView.vue'),
        },
        {
          path: 'assets/collect',
          name: ROUTE_NAMES.COLLECT_ASSET,
          component: () => import('../views/assets/CollectAssetView.vue'),
        },
        {
          path: 'assets/:id/history',
          name: ROUTE_NAMES.ASSET_HISTORY,
          component: () => import('../views/assets/AssetHistoryView.vue'),
        },
        {
          path: 'assets/bulk-upload',
          name: ROUTE_NAMES.BULK_ASSET_UPLOAD,
          component: () => import('../views/assets/BulkAssetUpload.vue'),
        },
        {
          path: 'employees',
          name: ROUTE_NAMES.EMPLOYEES,
          component: () => import('../views/employees/EmployeesView.vue'),
        },
        {
          path: 'employees/add',
          name: ROUTE_NAMES.ADD_EMPLOYEE,
          component: () => import('../views/employees/AddEmployeeView.vue'),
        },
        {
          path: 'employees/edit/:id',
          name: ROUTE_NAMES.EDIT_EMPLOYEE,
          component: () => import('../views/employees/EditEmployeeView.vue'),
        },
        {
          path: 'employees/:id/history',
          name: ROUTE_NAMES.EMPLOYEE_ASSET_HISTORY,
          component: () => import('../views/employees/EmployeeAssetHistory.vue'),
        },
        {
          path: 'employees/manage',
          name: ROUTE_NAMES.MANAGE_EMPLOYEES,
          component: () => import('../views/employees/ManageEmployeesView.vue'),
        },
        {
          path: 'employees/bulk-upload',
          name: ROUTE_NAMES.BULK_EMPLOYEE_UPLOAD,
          component: () => import('../views/employees/BulkEmployeeUpload.vue'),
        },
        {
          path: 'maintenance',
          name: ROUTE_NAMES.MAINTENANCE,
          component: () => import('../views/maintenance/MaintenanceView.vue'),
        },
        {
          path: 'maintenance/:assetId/history',
          name: ROUTE_NAMES.MAINTENANCE_HISTORY,
          component: () => import('../views/maintenance/MaintenanceHistoryView.vue'),
        },
        {
          path: 'maintenance/schedule',
          name: ROUTE_NAMES.SCHEDULE_MAINTENANCE,
          component: () => import('../views/maintenance/ScheduleMaintenanceView.vue'),
        },
        {
          path: 'maintenance/edit/:id',
          name: ROUTE_NAMES.EDIT_MAINTENANCE,
          component: () => import('../views/maintenance/EditMaintenanceView.vue'),
        },
        {
          path: 'vendors',
          name: ROUTE_NAMES.VENDORS,
          component: () => import('../views/vendors/VendorsView.vue'),
        },
        {
          path: 'vendors/add',
          name: ROUTE_NAMES.ADD_VENDOR,
          component: () => import('../views/vendors/AddVendorView.vue'),
        },
        {
          path: 'vendors/edit/:id',
          name: ROUTE_NAMES.EDIT_VENDOR,
          component: () => import('../views/vendors/EditVendorView.vue'),
        },
        {
          path: 'vendors/bulk-upload',
          name: ROUTE_NAMES.BULK_VENDOR_UPLOAD,
          component: () => import('../views/vendors/BulkVendorUpload.vue'),
        },
        {
          path: 'reports',
          name: ROUTE_NAMES.REPORTS,
          component: () => import('../views/reports/ReportsView.vue'),
        },
        {
          path: 'change-password',
          name: ROUTE_NAMES.CHANGE_PASSWORD,
          component: () => import('../views/auth/ChangePasswordView.vue'),
        },
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => import('../views/profile/ProfileView.vue'),
        },
        {
          path: 'notifications',
          name: ROUTE_NAMES.NOTIFICATIONS,
          component: () => import('../views/notifications/NotificationsView.vue'),
        },
        {
          path: 'manage-admins',
          name: ROUTE_NAMES.MANAGE_ADMINS,
          component: () => import('../views/admin/ManageAdminsView.vue'),
        },
      ],
    },
  ],
})

const publicRoutes = ['/', '/login', '/forgot-password', '/reset-password']

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuthStatus()
  const isAuthenticated = authStore.isAuthenticated

  if (to.name === ROUTE_NAMES.LOGIN && isAuthenticated) {
    next({ name: ROUTE_NAMES.DASHBOARD })
    return
  }

  const requiresAuth =
    to.matched.some(record => record.path.startsWith('/app') || record.meta?.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next({ name: ROUTE_NAMES.LOGIN })
    return
  }

  next()
})

export default router
