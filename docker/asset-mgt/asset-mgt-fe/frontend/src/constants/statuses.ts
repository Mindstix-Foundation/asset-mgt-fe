/**
 * Status Constants
 * Centralized status definitions for type safety and consistency
 */

// Asset Status
export const ASSET_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ASSIGNED: 'ASSIGNED',
  IN_MAINTENANCE: 'IN_MAINTENANCE',
  RETIRED: 'RETIRED',
  LOST: 'LOST',
} as const

export type AssetStatus = (typeof ASSET_STATUS)[keyof typeof ASSET_STATUS]

// Asset Condition
export const ASSET_CONDITION = {
  NEW: 'NEW',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  POOR: 'POOR',
  DAMAGED: 'DAMAGED',
  REFURBISHED: 'REFURBISHED',
} as const

export type AssetCondition = (typeof ASSET_CONDITION)[keyof typeof ASSET_CONDITION]

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export type EmployeeStatus = (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS]

// Maintenance Status
export const MAINTENANCE_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type MaintenanceStatus = (typeof MAINTENANCE_STATUS)[keyof typeof MAINTENANCE_STATUS]

// Maintenance Type
export const MAINTENANCE_TYPE = {
  PREVENTIVE: 'PREVENTIVE',
  CORRECTIVE: 'CORRECTIVE',
  EMERGENCY: 'EMERGENCY',
  UPGRADE: 'UPGRADE',
} as const

export type MaintenanceType = (typeof MAINTENANCE_TYPE)[keyof typeof MAINTENANCE_TYPE]

// Vendor Type
export const VENDOR_TYPE = {
  SUPPLIER: 'SUPPLIER',
  SERVICE: 'SERVICE',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  MANUFACTURER: 'MANUFACTURER',
  DISTRIBUTOR: 'DISTRIBUTOR',
  CONTRACTOR: 'CONTRACTOR',
  BOTH: 'BOTH',
} as const

export type VendorType = (typeof VENDOR_TYPE)[keyof typeof VENDOR_TYPE]

// Vendor Status
export const VENDOR_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS]

// Status Labels for Display
export const STATUS_LABELS = {
  // Asset Status Labels
  [ASSET_STATUS.AVAILABLE]: 'Available',
  [ASSET_STATUS.ASSIGNED]: 'Assigned',
  [ASSET_STATUS.IN_MAINTENANCE]: 'In Maintenance',
  [ASSET_STATUS.RETIRED]: 'Retired',
  [ASSET_STATUS.LOST]: 'Lost',

  // Asset Condition Labels
  [ASSET_CONDITION.NEW]: 'New',
  [ASSET_CONDITION.GOOD]: 'Good',
  [ASSET_CONDITION.FAIR]: 'Fair',
  [ASSET_CONDITION.POOR]: 'Poor',
  [ASSET_CONDITION.DAMAGED]: 'Damaged',
  [ASSET_CONDITION.REFURBISHED]: 'Refurbished',

  // Employee Status Labels
  [EMPLOYEE_STATUS.ACTIVE]: 'Active',
  [EMPLOYEE_STATUS.INACTIVE]: 'Inactive',

  // Maintenance Status Labels
  [MAINTENANCE_STATUS.SCHEDULED]: 'Scheduled',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'In Progress',
  [MAINTENANCE_STATUS.COMPLETED]: 'Completed',
  [MAINTENANCE_STATUS.CANCELLED]: 'Cancelled',

  // Maintenance Type Labels
  [MAINTENANCE_TYPE.PREVENTIVE]: 'Preventive',
  [MAINTENANCE_TYPE.CORRECTIVE]: 'Corrective',
  [MAINTENANCE_TYPE.EMERGENCY]: 'Emergency',
  [MAINTENANCE_TYPE.UPGRADE]: 'Upgrade',

  // Vendor Type Labels
  [VENDOR_TYPE.SUPPLIER]: 'Supplier',
  [VENDOR_TYPE.SERVICE]: 'Service',
  [VENDOR_TYPE.SERVICE_PROVIDER]: 'Service Provider',
  [VENDOR_TYPE.MANUFACTURER]: 'Manufacturer',
  [VENDOR_TYPE.DISTRIBUTOR]: 'Distributor',
  [VENDOR_TYPE.CONTRACTOR]: 'Contractor',
  [VENDOR_TYPE.BOTH]: 'Both',

  // Vendor Status Labels (same values as Employee Status)
  // [VENDOR_STATUS.ACTIVE]: 'Active',  // Duplicate - same as EMPLOYEE_STATUS.ACTIVE
  // [VENDOR_STATUS.INACTIVE]: 'Inactive',  // Duplicate - same as EMPLOYEE_STATUS.INACTIVE
} as const

// Status Badge Classes for Bootstrap
export const STATUS_BADGE_CLASSES = {
  // Asset Status
  [ASSET_STATUS.AVAILABLE]: 'badge-available bg-success',
  [ASSET_STATUS.ASSIGNED]: 'badge-assigned bg-primary',
  [ASSET_STATUS.IN_MAINTENANCE]: 'badge-maintenance bg-warning',
  [ASSET_STATUS.RETIRED]: 'badge-retired bg-secondary',
  [ASSET_STATUS.LOST]: 'bg-danger',

  // Asset Condition
  [ASSET_CONDITION.NEW]: 'badge-condition-new bg-primary',
  [ASSET_CONDITION.GOOD]: 'badge-condition-good bg-success',
  [ASSET_CONDITION.FAIR]: 'badge-condition-fair bg-warning',
  [ASSET_CONDITION.POOR]: 'badge-condition-poor bg-danger',
  [ASSET_CONDITION.DAMAGED]: 'bg-danger',
  [ASSET_CONDITION.REFURBISHED]: 'badge-condition-refurbished bg-brown',

  // Employee Status
  [EMPLOYEE_STATUS.ACTIVE]: 'badge-active bg-success',
  [EMPLOYEE_STATUS.INACTIVE]: 'badge-inactive bg-danger',

  // Maintenance Status
  [MAINTENANCE_STATUS.SCHEDULED]: 'bg-info',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'bg-warning',
  [MAINTENANCE_STATUS.COMPLETED]: 'bg-success',
  [MAINTENANCE_STATUS.CANCELLED]: 'bg-danger',

  // Vendor Status (same values as Employee Status)
  // [VENDOR_STATUS.ACTIVE]: 'badge-active bg-success',  // Duplicate - same as EMPLOYEE_STATUS.ACTIVE
  // [VENDOR_STATUS.INACTIVE]: 'badge-inactive bg-danger',  // Duplicate - same as EMPLOYEE_STATUS.INACTIVE
} as const

