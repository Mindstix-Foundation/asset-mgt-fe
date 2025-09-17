import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'

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
          path: 'employees',
          name: 'employees',
          component: () => import('../views/employees/EmployeesView.vue'),
        },
        {
          path: 'maintenance',
          name: 'maintenance',
          component: () => import('../views/maintenance/MaintenanceView.vue'),
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
          component: () => import('../views/vendors/AddVendorView.vue'),
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

export default router
