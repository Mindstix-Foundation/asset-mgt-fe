/**
 * Route Constants
 * Centralized route name definitions for type-safe navigation
 */

// Route Names (must match router/index.ts)
export const ROUTE_NAMES = {
  // Auth Routes
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  CHANGE_PASSWORD: 'change-password',

  // Dashboard
  DASHBOARD: 'dashboard',

  // Asset Routes
  ASSETS: 'assets',
  ADD_ASSET: 'add-asset',
  EDIT_ASSET: 'edit-asset',
  ASSET_HISTORY: 'asset-history',
  BULK_ASSET_UPLOAD: 'bulk-asset-upload',
  ISSUE_ASSET: 'issue-asset',
  COLLECT_ASSET: 'collect-asset',
  MANAGE_ASSET_CATEGORIES: 'manage-asset-categories',

  // Employee Routes
  EMPLOYEES: 'employees',
  ADD_EMPLOYEE: 'add-employee',
  EDIT_EMPLOYEE: 'edit-employee',
  EMPLOYEE_ASSET_HISTORY: 'employee-asset-history',
  BULK_EMPLOYEE_UPLOAD: 'bulk-employee-upload',
  MANAGE_EMPLOYEES: 'manage-employees',

  // Vendor Routes
  VENDORS: 'vendors',
  ADD_VENDOR: 'add-vendor',
  EDIT_VENDOR: 'edit-vendor',
  BULK_VENDOR_UPLOAD: 'bulk-vendor-upload',

  // Maintenance Routes
  MAINTENANCE: 'maintenance',
  SCHEDULE_MAINTENANCE: 'schedule-maintenance',
  EDIT_MAINTENANCE: 'edit-maintenance',
  MAINTENANCE_HISTORY: 'maintenance-history',

  // Report Routes
  REPORTS: 'reports',

  // Admin Routes
  MANAGE_ADMINS: 'manage-admins',
  ADMIN_AUDIT: 'admin-audit',

  // Notification Routes
  NOTIFICATIONS: 'notifications',

  // Profile Routes
  PROFILE: 'profile',
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

// Route Paths
export const ROUTE_PATHS = {
  // Auth
  [ROUTE_NAMES.LOGIN]: '/login',
  [ROUTE_NAMES.FORGOT_PASSWORD]: '/forgot-password',
  [ROUTE_NAMES.RESET_PASSWORD]: '/reset-password',
  [ROUTE_NAMES.CHANGE_PASSWORD]: '/change-password',

  // Dashboard
  [ROUTE_NAMES.DASHBOARD]: '/',

  // Assets
  [ROUTE_NAMES.ASSETS]: '/assets',
  [ROUTE_NAMES.ADD_ASSET]: '/assets/add',
  [ROUTE_NAMES.EDIT_ASSET]: '/assets/edit/:id',
  [ROUTE_NAMES.ASSET_HISTORY]: '/assets/history/:id',
  [ROUTE_NAMES.BULK_ASSET_UPLOAD]: '/assets/bulk-upload',
  [ROUTE_NAMES.ISSUE_ASSET]: '/assets/issue',
  [ROUTE_NAMES.COLLECT_ASSET]: '/assets/collect',
  [ROUTE_NAMES.MANAGE_ASSET_CATEGORIES]: '/assets/manage-categories',

  // Employees
  [ROUTE_NAMES.EMPLOYEES]: '/employees',
  [ROUTE_NAMES.ADD_EMPLOYEE]: '/employees/add',
  [ROUTE_NAMES.EDIT_EMPLOYEE]: '/employees/edit/:id',
  [ROUTE_NAMES.EMPLOYEE_ASSET_HISTORY]: '/employees/asset-history/:id',
  [ROUTE_NAMES.BULK_EMPLOYEE_UPLOAD]: '/employees/bulk-upload',
  [ROUTE_NAMES.MANAGE_EMPLOYEES]: '/employees/manage',

  // Vendors
  [ROUTE_NAMES.VENDORS]: '/vendors',
  [ROUTE_NAMES.ADD_VENDOR]: '/vendors/add',
  [ROUTE_NAMES.EDIT_VENDOR]: '/vendors/edit/:id',
  [ROUTE_NAMES.BULK_VENDOR_UPLOAD]: '/vendors/bulk-upload',

  // Maintenance
  [ROUTE_NAMES.MAINTENANCE]: '/maintenance',
  [ROUTE_NAMES.SCHEDULE_MAINTENANCE]: '/maintenance/schedule',
  [ROUTE_NAMES.EDIT_MAINTENANCE]: '/maintenance/edit/:id',
  [ROUTE_NAMES.MAINTENANCE_HISTORY]: '/maintenance/history',

  // Reports
  [ROUTE_NAMES.REPORTS]: '/reports',

  // Admin
  [ROUTE_NAMES.MANAGE_ADMINS]: '/admin/manage-admins',
  [ROUTE_NAMES.ADMIN_AUDIT]: '/admin/activity',

  // Notifications
  [ROUTE_NAMES.NOTIFICATIONS]: '/notifications',

  // Profile
  [ROUTE_NAMES.PROFILE]: '/profile',
} as const

// Route Titles (for breadcrumbs, page titles, etc.)
export const ROUTE_TITLES = {
  [ROUTE_NAMES.LOGIN]: 'Login',
  [ROUTE_NAMES.FORGOT_PASSWORD]: 'Forgot Password',
  [ROUTE_NAMES.RESET_PASSWORD]: 'Reset Password',
  [ROUTE_NAMES.CHANGE_PASSWORD]: 'Change Password',
  [ROUTE_NAMES.DASHBOARD]: 'Dashboard',
  [ROUTE_NAMES.ASSETS]: 'Assets',
  [ROUTE_NAMES.ADD_ASSET]: 'Add Asset',
  [ROUTE_NAMES.EDIT_ASSET]: 'Edit Asset',
  [ROUTE_NAMES.ASSET_HISTORY]: 'Asset History',
  [ROUTE_NAMES.BULK_ASSET_UPLOAD]: 'Bulk Asset Upload',
  [ROUTE_NAMES.ISSUE_ASSET]: 'Issue Asset',
  [ROUTE_NAMES.COLLECT_ASSET]: 'Collect Asset',
  [ROUTE_NAMES.MANAGE_ASSET_CATEGORIES]: 'Manage Categories',
  [ROUTE_NAMES.EMPLOYEES]: 'Employees',
  [ROUTE_NAMES.ADD_EMPLOYEE]: 'Add Employee',
  [ROUTE_NAMES.EDIT_EMPLOYEE]: 'Edit Employee',
  [ROUTE_NAMES.EMPLOYEE_ASSET_HISTORY]: 'Employee Asset History',
  [ROUTE_NAMES.BULK_EMPLOYEE_UPLOAD]: 'Bulk Employee Upload',
  [ROUTE_NAMES.MANAGE_EMPLOYEES]: 'Manage Employees',
  [ROUTE_NAMES.VENDORS]: 'Vendors',
  [ROUTE_NAMES.ADD_VENDOR]: 'Add Vendor',
  [ROUTE_NAMES.EDIT_VENDOR]: 'Edit Vendor',
  [ROUTE_NAMES.BULK_VENDOR_UPLOAD]: 'Bulk Vendor Upload',
  [ROUTE_NAMES.MAINTENANCE]: 'Maintenance',
  [ROUTE_NAMES.SCHEDULE_MAINTENANCE]: 'Schedule Maintenance',
  [ROUTE_NAMES.EDIT_MAINTENANCE]: 'Edit Maintenance',
  [ROUTE_NAMES.MAINTENANCE_HISTORY]: 'Maintenance History',
  [ROUTE_NAMES.REPORTS]: 'Reports',
  [ROUTE_NAMES.MANAGE_ADMINS]: 'Manage Admins',
  [ROUTE_NAMES.ADMIN_AUDIT]: 'Admin Audit',
  [ROUTE_NAMES.NOTIFICATIONS]: 'Notifications',
  [ROUTE_NAMES.PROFILE]: 'Profile',
} as const

// Helper function to get route path with params
export function getRoutePath(routeName: RouteName, params?: Record<string, string | number>): string {
  let path: string = ROUTE_PATHS[routeName]
  
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, String(value))
    }
  }
  
  return path
}

// Helper function to check if current route matches
export function isCurrentRoute(currentName: string, routeName: RouteName): boolean {
  return currentName === routeName
}

