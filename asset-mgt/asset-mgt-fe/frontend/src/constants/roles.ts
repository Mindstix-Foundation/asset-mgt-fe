/**
 * User Roles and Permissions Constants
 * Centralized role and permission definitions
 */

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Role Labels
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.HR]: 'Human Resources',
  [USER_ROLES.EMPLOYEE]: 'Employee',
  [USER_ROLES.MANAGER]: 'Manager',
} as const

// Permissions
export const PERMISSIONS = {
  // Asset Permissions
  ASSET_CREATE: 'asset:create',
  ASSET_READ: 'asset:read',
  ASSET_UPDATE: 'asset:update',
  ASSET_DELETE: 'asset:delete',
  ASSET_ISSUE: 'asset:issue',
  ASSET_COLLECT: 'asset:collect',
  ASSET_EXPORT: 'asset:export',
  ASSET_BULK_UPLOAD: 'asset:bulk_upload',

  // Employee Permissions
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_UPDATE: 'employee:update',
  EMPLOYEE_DELETE: 'employee:delete',
  EMPLOYEE_EXPORT: 'employee:export',
  EMPLOYEE_BULK_UPLOAD: 'employee:bulk_upload',

  // Vendor Permissions
  VENDOR_CREATE: 'vendor:create',
  VENDOR_READ: 'vendor:read',
  VENDOR_UPDATE: 'vendor:update',
  VENDOR_DELETE: 'vendor:delete',
  VENDOR_BULK_UPLOAD: 'vendor:bulk_upload',

  // Maintenance Permissions
  MAINTENANCE_CREATE: 'maintenance:create',
  MAINTENANCE_READ: 'maintenance:read',
  MAINTENANCE_UPDATE: 'maintenance:update',
  MAINTENANCE_DELETE: 'maintenance:delete',
  MAINTENANCE_COMPLETE: 'maintenance:complete',
  MAINTENANCE_CANCEL: 'maintenance:cancel',

  // Report Permissions
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // Admin Permissions
  ADMIN_MANAGE_USERS: 'admin:manage_users',
  ADMIN_MANAGE_ROLES: 'admin:manage_roles',
  ADMIN_VIEW_LOGS: 'admin:view_logs',
  ADMIN_SYSTEM_SETTINGS: 'admin:system_settings',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: [
    // All permissions for admin
    PERMISSIONS.ASSET_CREATE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_UPDATE,
    PERMISSIONS.ASSET_DELETE,
    PERMISSIONS.ASSET_ISSUE,
    PERMISSIONS.ASSET_COLLECT,
    PERMISSIONS.ASSET_EXPORT,
    PERMISSIONS.ASSET_BULK_UPLOAD,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.EMPLOYEE_BULK_UPLOAD,
    PERMISSIONS.VENDOR_CREATE,
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.VENDOR_UPDATE,
    PERMISSIONS.VENDOR_DELETE,
    PERMISSIONS.VENDOR_BULK_UPLOAD,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.MAINTENANCE_DELETE,
    PERMISSIONS.MAINTENANCE_COMPLETE,
    PERMISSIONS.MAINTENANCE_CANCEL,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.ADMIN_MANAGE_USERS,
    PERMISSIONS.ADMIN_MANAGE_ROLES,
    PERMISSIONS.ADMIN_VIEW_LOGS,
    PERMISSIONS.ADMIN_SYSTEM_SETTINGS,
  ],
  [USER_ROLES.HR]: [
    // HR permissions
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_ISSUE,
    PERMISSIONS.ASSET_COLLECT,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.EMPLOYEE_BULK_UPLOAD,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
  ],
  [USER_ROLES.MANAGER]: [
    // Manager permissions
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_ISSUE,
    PERMISSIONS.ASSET_COLLECT,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.REPORT_VIEW,
  ],
  [USER_ROLES.EMPLOYEE]: [
    // Employee permissions (limited)
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.EMPLOYEE_READ,
  ],
} as const

// Helper function to check if a role has a permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

// Helper function to check if a role has any of the permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

// Helper function to check if a role has all permissions
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

