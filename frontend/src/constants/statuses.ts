/**
 * Status Constants
 * Centralized status definitions for type safety and consistency
 */

// Asset Status
export const ASSET_STATUS = {
  NON_ASSIGNED: 'NON_ASSIGNED',
  ASSIGNED: 'ASSIGNED',
  IN_MAINTENANCE: 'IN_MAINTENANCE',
  RETIRED: 'RETIRED',
  LOST: 'LOST',
  DONATED: 'DONATED',
} as const

export type AssetStatus = (typeof ASSET_STATUS)[keyof typeof ASSET_STATUS]

// Asset Condition
export const ASSET_CONDITION = {
  NEW: 'NEW',
  WORKING_CONDITION: 'WORKING_CONDITION',
  SOFTWARE_ISSUE: 'SOFTWARE_ISSUE',
  HARDWARE_ISSUE: 'HARDWARE_ISSUE',
  NEEDS_REPAIR: 'NEEDS_REPAIR',
  TRASH: 'TRASH',
  REFURBISHED: 'REFURBISHED',
} as const

export type AssetCondition = (typeof ASSET_CONDITION)[keyof typeof ASSET_CONDITION]

// Asset Location (predefined inventory centers)
export const ASSET_LOCATION = {
  PUNE_INVENTORY_CENTER: 'PUNE_INVENTORY_CENTER',
  THANE_INVENTORY_CENTER: 'THANE_INVENTORY_CENTER',
} as const

export type AssetLocation = (typeof ASSET_LOCATION)[keyof typeof ASSET_LOCATION]

// Return Condition (subset of AssetCondition: excludes NEW)
export const RETURN_CONDITION = {
  WORKING_CONDITION: 'WORKING_CONDITION',
  SOFTWARE_ISSUE: 'SOFTWARE_ISSUE',
  HARDWARE_ISSUE: 'HARDWARE_ISSUE',
  NEEDS_REPAIR: 'NEEDS_REPAIR',
  TRASH: 'TRASH',
  REFURBISHED: 'REFURBISHED',
} as const

export type ReturnCondition = (typeof RETURN_CONDITION)[keyof typeof RETURN_CONDITION]

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
  [ASSET_STATUS.NON_ASSIGNED]: 'Non Assigned',
  [ASSET_STATUS.ASSIGNED]: 'Assigned',
  [ASSET_STATUS.IN_MAINTENANCE]: 'In Maintenance',
  [ASSET_STATUS.RETIRED]: 'Retired',
  [ASSET_STATUS.LOST]: 'Lost',
  [ASSET_STATUS.DONATED]: 'Donated',

  // Asset Condition Labels
  [ASSET_CONDITION.NEW]: 'New',
  [ASSET_CONDITION.WORKING_CONDITION]: 'Working Condition',
  [ASSET_CONDITION.SOFTWARE_ISSUE]: 'Software Issue',
  [ASSET_CONDITION.HARDWARE_ISSUE]: 'Hardware Issue',
  [ASSET_CONDITION.NEEDS_REPAIR]: 'Needs Repair',
  [ASSET_CONDITION.TRASH]: 'Trash',
  [ASSET_CONDITION.REFURBISHED]: 'Refurbished',

  // Asset Location Labels
  [ASSET_LOCATION.PUNE_INVENTORY_CENTER]: 'Pune Inventory Center',
  [ASSET_LOCATION.THANE_INVENTORY_CENTER]: 'Thane Inventory Center',

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
  [ASSET_STATUS.NON_ASSIGNED]: 'badge-available bg-success',
  [ASSET_STATUS.ASSIGNED]: 'badge-assigned bg-primary',
  [ASSET_STATUS.IN_MAINTENANCE]: 'badge-maintenance bg-warning',
  [ASSET_STATUS.RETIRED]: 'badge-retired bg-secondary',
  [ASSET_STATUS.LOST]: 'bg-danger',
  [ASSET_STATUS.DONATED]: 'bg-info',

  // Asset Condition
  [ASSET_CONDITION.NEW]: 'badge-condition-new bg-primary',
  [ASSET_CONDITION.WORKING_CONDITION]: 'badge-condition-good bg-success',
  [ASSET_CONDITION.SOFTWARE_ISSUE]: 'badge-condition-fair bg-warning',
  [ASSET_CONDITION.HARDWARE_ISSUE]: 'badge-condition-poor bg-danger',
  [ASSET_CONDITION.NEEDS_REPAIR]: 'badge-condition-fair bg-warning',
  [ASSET_CONDITION.TRASH]: 'bg-danger',
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

// Convenience arrays for dropdowns / select options
export const ASSET_STATUS_LIST: AssetStatus[] = Object.values(ASSET_STATUS) as AssetStatus[]
export const ASSET_CONDITION_LIST: AssetCondition[] =
  Object.values(ASSET_CONDITION) as AssetCondition[]
export const ASSET_LOCATION_LIST: AssetLocation[] =
  Object.values(ASSET_LOCATION) as AssetLocation[]
export const RETURN_CONDITION_LIST: ReturnCondition[] =
  Object.values(RETURN_CONDITION) as ReturnCondition[]

/**
 * Statuses considered "out of inventory" – used to exclude assets from
 * dashboard counts and to disallow new assignments. Mirrors backend logic.
 */
export const INACTIVE_ASSET_STATUSES: AssetStatus[] = [
  ASSET_STATUS.RETIRED,
  ASSET_STATUS.LOST,
  ASSET_STATUS.DONATED,
]
