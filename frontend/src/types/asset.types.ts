// Asset related types for the frontend application

import type { Vendor } from './vendor.types'
import type { User as AppUser } from './common.types'

export interface AssetCategory {
  id: number
  name: string
  description?: string
}

export interface AssetType {
  id: number
  name: string
  description?: string
  category: AssetCategory
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
  employee: {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface Asset {
  id: number
  assetId: string
  serialNumber: string
  status: AssetStatus
  condition: AssetCondition
  location: string
  purchaseDate?: string
  purchaseCost?: number
  warrantyStartDate?: string
  warrantyEndDate?: string
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
  vendor?: Vendor
  createdByUser: AppUser
  assetIssues?: AssetIssue[]
  _count: {
    assetIssues: number
  }
}

export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED' | 'LOST'
export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED' | 'REFURBISHED'

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
  location?: string
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
  location: string
  purchaseDate?: string
  purchaseCost?: number
  warrantyStartDate?: string
  warrantyEndDate?: string
  notes?: string
}

export interface UpdateAssetDto extends Partial<CreateAssetDto> {}

export interface AssetStats {
  totalAssets: number
  available: number
  assigned: number
  inMaintenance: number
  retired: number
  lost: number
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

// For the frontend display - computed properties
export interface AssetDisplayItem {
  id: string
  type: string
  brand: string
  brandModel: string
  serialNumber: string
  status: AssetStatus
  assignedTo?: string
  purchaseDate: string
  location: string
  category: string
  condition: AssetCondition
  purchaseCost?: number
  vendor: string
  warrantyUntil: string
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