/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

// Base API URL - can be overridden by environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    google: '/auth/google',
    googleLogin: '/auth/google-login',
    googleCodeLogin: '/auth/google-code-login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },

  // Asset endpoints
  assets: {
    base: '/assets',
    byId: (id: number) => `/assets/${id}`,
    stats: '/assets/stats',
    available: '/assets/available',
    generateId: '/assets/generate-asset-id',
    bulkUpload: '/assets/bulk-upload',
    export: '/assets/export',
  },

  // Employee endpoints
  employees: {
    base: '/employees',
    byId: (id: string) => `/employees/${id}`,
    available: '/employees/available',
    assetHistory: (id: string) => `/employees/${id}/asset-history`,
    assetEvents: (id: string) => `/employees/${id}/asset-events`,
    bulkUpload: '/employees/bulk-upload',
    export: '/employees/export',
  },

  // Vendor endpoints
  vendors: {
    base: '/vendors',
    byId: (id: number) => `/vendors/${id}`,
    search: '/vendors/search',
    checkName: '/vendors/check-name',
    bulkUpload: '/vendors/bulk-upload',
  },

  // Maintenance endpoints
  maintenance: {
    base: '/maintenance',
    byId: (id: string) => `/maintenance/${id}`,
    stats: '/maintenance/stats',
    complete: (id: string) => `/maintenance/${id}/complete`,
    cancel: (id: string) => `/maintenance/${id}/cancel`,
    history: (assetId: string) => `/maintenance/asset/${assetId}/history`,
  },

  // Assignment endpoints
  assignments: {
    base: '/assignments',
    byId: (id: number) => `/assignments/${id}`,
    active: '/assignments/active',
    return: (id: number) => `/assignments/${id}/return`,
  },

  // Asset Categories, Types, Brands, Models
  assetCategories: {
    base: '/asset-categories',
    byId: (id: number) => `/asset-categories/${id}`,
    merge: '/asset-categories/merge',
  },

  assetTypes: {
    base: '/asset-types',
    byId: (id: number) => `/asset-types/${id}`,
    byCategory: (categoryId: number) => `/asset-types/by-category/${categoryId}`,
    merge: '/asset-types/merge',
  },

  brands: {
    base: '/brands',
    byId: (id: number) => `/brands/${id}`,
    merge: '/brands/merge',
  },

  models: {
    base: '/models',
    byId: (id: number) => `/models/${id}`,
    byBrand: (brandId: number) => `/models/by-brand/${brandId}`,
    byBrandAndType: (brandId: number, typeId: number) => 
      `/models/by-brand/${brandId}/asset-type/${typeId}`,
    merge: '/models/merge',
  },

  // Reports endpoints
  reports: {
    analytics: '/reports/analytics',
    assetInventory: '/reports/asset-inventory',
    employeeAssets: '/reports/employee-assets',
    maintenance: '/reports/maintenance',
    preview: '/reports/preview',
    export: {
      assets: '/reports/export/asset-inventory',
      employees: '/reports/export/employee-assets',
      maintenance: '/reports/export/maintenance',
    },
  },

  // Dashboard endpoints
  dashboard: {
    stats: '/dashboard/stats',
    analytics: '/dashboard/analytics',
  },

  // Asset History endpoints
  assetHistory: {
    base: '/asset-history',
    byAssetId: (assetId: string) => `/asset-history/${assetId}`,
    summary: (assetId: string) => `/asset-history/${assetId}/summary`,
  },

  // Notification endpoints
  notifications: {
    base: '/notifications',
    unreadCount: '/notifications/unread-count',
    markAsRead: (id: number) => `/notifications/${id}/mark-as-read`,
    markAllAsRead: '/notifications/mark-all-as-read',
  },

  // Admin endpoints
  admin: {
    users: '/admin/users',
    createAdmin: '/admin/create-admin',
    removeAdmin: (employeeId: string) => `/admin/remove-admin/${employeeId}`,
  },
} as const

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
} as const

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
}

