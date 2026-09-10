// Vendor management types

export enum VendorType {
  SUPPLIER = 'SUPPLIER',
  SERVICE = 'SERVICE',
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  CONTRACTOR = 'CONTRACTOR',
  BOTH = 'BOTH'
}

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Vendor {
  id: number
  name: string
  vendorType: VendorType
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  taxId?: string
  panNumber?: string
  notes?: string
  status: VendorStatus
  createdAt: string
  updatedAt: string
  userId?: number
  user?: {
    id: number
    name: string
  }
  _count?: {
    assets: number
    maintenanceSchedules: number
  }
  assets?: any[]
  maintenanceSchedules?: any[]
}

export interface CreateVendorDto {
  name: string
  vendorType?: VendorType
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  taxId?: string
  panNumber?: string
  notes?: string
  userId?: number
  status?: VendorStatus
}

export interface UpdateVendorDto {
  name?: string
  vendorType?: VendorType
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  taxId?: string
  panNumber?: string
  notes?: string
  status?: VendorStatus
}

export interface VendorStatusDto {
  status: VendorStatus
}

export interface VendorQueryParams {
  page?: number
  limit?: number
  search?: string
  vendorType?: string
  status?: VendorStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface VendorSearchParams {
  q: string
  limit?: number
}

export interface VendorsListResponse {
  message: string
  data: {
    vendors: Vendor[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface VendorResponse {
  message: string
  data: {
    vendor: Vendor
  }
}

export interface VendorSearchResponse {
  message: string
  data: {
    searchResults: Vendor[]
    totalFound: number
  }
}

export interface BulkUploadResponse {
  message: string
  data: {
    imported: number
    errors: Array<{
      row: number
      field: string
      message: string
    }>
    summary: {
      totalRows: number
      successfulImports: number
      failedImports: number
    }
  }
}