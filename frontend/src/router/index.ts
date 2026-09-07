import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../stores/auth'
import { ROUTE_NAMES } from '@/constants'
import { isPlatformUser } from '@/types/auth.types'

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
      redirect: '/'
    },
    {
      path: '/forgot-password',
      name: ROUTE_NAMES.FORGOT_PASSWORD,
      component: () => import('../views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/register-organization',
      name: ROUTE_NAMES.REGISTER_ORGANIZATION,
      component: () => import('../views/auth/RegisterOrganizationView.vue'),
    },
    {
      path: '/reset-password',
      name: ROUTE_NAMES.RESET_PASSWORD,
      component: () => import('../views/auth/ResetPasswordView.vue'),
    },
    {
      path: '/a/:token',
      name: ROUTE_NAMES.PUBLIC_ASSET,
      component: () => import('../views/public/PublicAssetView.vue'),
      meta: { public: true },
    },
    {
      path: '/app',
      component: MainLayout,
      redirect: '/app/dashboard',
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
          path: 'qr-scanner',
          name: ROUTE_NAMES.QR_SCANNER,
          component: () => import('../views/assets/QrScannerView.vue'),
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
          path: 'employees/manage-designations',
          name: ROUTE_NAMES.MANAGE_DESIGNATIONS,
          component: () => import('../views/employees/ManageDesignationsView.vue'),
        },
        {
          path: 'employees/bulk-upload',
          name: ROUTE_NAMES.BULK_EMPLOYEE_UPLOAD,
          component: () => import('../views/employees/BulkEmployeeUpload.vue'),
        },
        {
          path: 'licenses',
          name: ROUTE_NAMES.SOFTWARE_LICENSES,
          component: () => import('../views/licenses/SoftwareLicensesView.vue'),
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
        {
          path: 'admin/activity',
          name: ROUTE_NAMES.ADMIN_AUDIT,
          component: () => import('../views/admin/AdminAuditView.vue'),
        },
        {
          path: 'platform/organizations',
          name: ROUTE_NAMES.PLATFORM_ORGANIZATIONS,
          component: () => import('../views/platform/OrganizationsView.vue'),
          meta: { roles: ['SUPER_ADMIN'] },
        },
      ],
    },
  ],
})

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/register-organization',
]

const isPublicRoute = (path: string) =>
  publicRoutes.includes(path) || path.startsWith('/a/')

const homeForUser = (authStore: ReturnType<typeof useAuthStore>) => {
  if (isPlatformUser(authStore.user)) {
    return '/app/platform/organizations'
  }
  return '/app/dashboard'
}

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Ensure auth status is up to date
  authStore.checkAuthStatus()
  
  // Check if user is authenticated
  const isAuthenticated = authStore.isAuthenticated

  // If going to login page but already authenticated, redirect to home
  if (to.path === '/' && isAuthenticated) {
    next(homeForUser(authStore))
    return
  }

  // Public asset pages never require auth
  if (isPublicRoute(to.path) || to.meta?.public) {
    next()
    return
  }

  const requiresAuth = to.path.startsWith('/app') || to.matched.some(record => record.meta?.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next('/')
    return
  }

  const requiredRoles = to.matched
    .map((r) => r.meta?.roles as string[] | undefined)
    .find((roles) => Array.isArray(roles) && roles.length > 0)

  if (requiredRoles && isAuthenticated) {
    const userRoles: string[] = authStore.user?.roles || []
    const allowed = requiredRoles.some((role) => userRoles.includes(role))
    if (!allowed) {
      next(homeForUser(authStore))
      return
    }
  }

  // Super-admin should stay on platform pages (no company ops UI)
  if (
    isAuthenticated &&
    isPlatformUser(authStore.user) &&
    to.path.startsWith('/app') &&
    !to.path.startsWith('/app/platform') &&
    to.path !== '/app/profile' &&
    to.path !== '/app/change-password'
  ) {
    next('/app/platform/organizations')
    return
  }
  
  // Otherwise, allow navigation
  next()
})

export default router
