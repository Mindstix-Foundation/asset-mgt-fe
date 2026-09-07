// Asset related types for the frontend application

import type { Vendor } from './vendor.types'
import type { User as AppUser } from './common.types'

export interface AssetCategory {
  id: number
  name: string
  description?: string
}

export interface SpecificationFieldDefinition {
  key?: string
  label?: string
  type?: string
  required?: boolean
  options?: Array<{ value: string; deprecated?: boolean } | string>
}

export interface SpecificationTemplate {
  fields?: SpecificationFieldDefinition[]
  version?: number
  createdAt?: string
  updatedAt?: string
}

export interface AssetType {
  id: number
  name: string
  description?: string
  category: AssetCategory
  specificationTemplate?: SpecificationTemplate
}

export interface Brand {
  id: number
  name: string
  description?: string
}

export interface Model {
  id: number
  name: string
  specifications?: Record<string, any>
  brand?: Brand
  assetType?: AssetType
}

export interface AssetIssue {
  id: number
  issueDate: string
  returnDate?: string
  issueReason?: string
  notes?: string
  employee: {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    email: string
  }
  issuedByUser: {
    username: string
  }
}

// Optimized Asset interface for table display (minimal fields)
export interface Asset {
  id: number
  assetId: string
  serialNumber: string
  status: AssetStatus
  condition: AssetCondition
  assetType: AssetType
  brand: Brand
  model: Model
  assetIssues?: AssetIssue[]
  specifications?: Record<string, string>
}

// Full Asset interface for detailed view (includes all fields)
export interface DetailedAsset {
  id: number
  assetId: string
  serialNumber: string
  status: AssetStatus
  condition: AssetCondition
  location?: AssetLocation
  purchaseDate?: string
  purchaseCost?: number
  warrantyStartDate?: string
  warrantyEndDate?: string
  depreciationMethod?: 'STRAIGHT_LINE' | 'REDUCING_BALANCE' | 'INITIAL_HIGH_REDUCING' | null
  usefulLifeMonths?: number | null
  salvageValue?: number | null
  depreciationRatePercent?: number | null
  firstYearDepreciationRatePercent?: number | null
  depreciation?: {
    method: string
    usefulLifeMonths: number | null
    salvageValue: number
    purchaseCost: number
    depreciationRatePercent: number | null
    firstYearDepreciationRatePercent: number | null
    yearsElapsed: number
    monthsElapsed: number
    monthlyDepreciation: number | null
    accumulatedDepreciation: number
    bookValue: number
    depreciationPercent: number
    isFullyDepreciated: boolean
    schedule?: Array<{
      year: number
      openingValue: number
      ratePercent: number
      depreciation: number
      closingValue: number
      isPartialYear: boolean
    }>
  } | null
  notes?: string
  retirementDate?: string
  retirementReason?: string
  retirementNotes?: string
  reactivationDate?: string
  reactivationReason?: string
  createdAt: string
  updatedAt: string
  assetType: AssetType
  brand: Brand
  model: Model
  specifications?: Record<string, any>
  vendor?: Vendor
  createdByUser: AppUser
  assetIssues?: AssetIssue[]
  _count: {
    assetIssues: number
  }
}

export type AssetStatus =
  | 'NON_ASSIGNED'
  | 'ASSIGNED'
  | 'IN_MAINTENANCE'
  | 'RETIRED'
  | 'LOST'
  | 'DONATED'
export type AssetCondition =
  | 'NEW'
  | 'WORKING_CONDITION'
  | 'SOFTWARE_ISSUE'
  | 'HARDWARE_ISSUE'
  | 'NEEDS_REPAIR'
  | 'TRASH'
  | 'REFURBISHED'
export type AssetLocation = 'PUNE_INVENTORY_CENTER' | 'THANE_INVENTORY_CENTER'
export type ReturnCondition =
  | 'WORKING_CONDITION'
  | 'SOFTWARE_ISSUE'
  | 'HARDWARE_ISSUE'
  | 'NEEDS_REPAIR'
  | 'TRASH'
  | 'REFURBISHED'

export interface AssetQueryParams {
  page?: number
  limit?: number
  search?: string
  assetTypeId?: number
  brandId?: number
  modelId?: number
  vendorId?: number
  status?: AssetStatus
  condition?: AssetCondition
  location?: AssetLocation
  specificationFilters?: Record<string, string>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateAssetDto {
  assetId?: string
  serialNumber: string
  assetTypeId: number
  brandId: number
  modelId: number
  vendorId?: number
  status: AssetStatus
  condition: AssetCondition
  location: AssetLocation
  purchaseDate?: string
  purchaseCost?: number
  warrantyStartDate?: string
  warrantyEndDate?: string
  notes?: string
}

export interface UpdateAssetDto extends Partial<CreateAssetDto> {}

export interface AssetStats {
  totalAssets: number
  /** Backwards-compat alias for `nonAssigned` */
  available: number
  nonAssigned?: number
  assigned: number
  inMaintenance: number
  retired: number
  lost: number
  donated?: number
}

export interface PaginationInfo {
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface AssetListResponse {
  message: string
  data: {
    assets: Asset[]
    pagination: PaginationInfo
  }
}

export interface AssetResponse {
  message: string
  data: {
    asset: Asset
  }
}

export interface AssetStatsResponse {
  message: string
  data: AssetStats
}

export interface SearchResult {
  searchResults: Asset[]
  searchQuery: string
  totalFound: number
  pagination: PaginationInfo
}

export interface SearchResponse {
  message: string
  data: SearchResult
}

// For the frontend display - computed properties (optimized for table)
export interface AssetDisplayItem {
  id: string
  type: string
  brand: string
  model: string
  serialNumber: string
  status: AssetStatus
  assignedTo?: string
  condition: AssetCondition
  specifications?: Record<string, string>
  specificationLabelMap?: Record<string, string>
  // Additional fields for modal (populated when viewing details)
  purchaseDate?: string
  location?: AssetLocation
  category?: string
  purchaseCost?: number
  vendor?: string
  warrantyEndDate?: string
  warrantyStartDate?: string
  notes?: string
  // Assignment details
  assignmentReason?: string
  assignmentNotes?: string
  assignmentDate?: string
  assignedBy?: string
  // Retirement details
  retirementDate?: string
  retirementReason?: string
  retirementNotes?: string
  // Reactivation details
  reactivationDate?: string
  reactivationReason?: string
}

// Filter options for dropdowns
export interface FilterOptions {
  assetTypes: Array<{ id: number; name: string }>
  brands: Array<{ id: number; name: string }>
  models: Array<{ id: number; name: string }>
  vendors: Array<{ id: number; name: string }>
}

// Bulk upload types (renamed to avoid conflict with vendor bulk upload)
export interface AssetBulkUploadResult {
  imported: number
  errors: Array<{
    row: number
    field: string
    message: string
    value?: string
  }>
  summary: {
    totalRows: number
    successfulImports: number
    failedImports: number
    validationErrors: number
  }
  // For validation-only responses
  totalRows?: number
  validRows?: number
  invalidRows?: number
  validationOnly?: boolean
}

export interface AssetBulkUploadResponse {
  message: string
  data: AssetBulkUploadResult
}

// Specification filter types
export interface SpecificationCombination {
  [key: string]: string
}

export interface UniqueSpecificationsResponse {
  message: string
  data: {
    requiredSpecs: string[]
    combinations: SpecificationCombination[]
  }
} 