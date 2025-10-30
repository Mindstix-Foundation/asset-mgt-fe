// Common types used across the application

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface FilterOption {
  label: string
  value: string | number
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export type Status = 'active' | 'inactive' | 'pending' | 'archived'

export interface User {
  id: string
  username: string
  role: 'admin' | 'hr' | 'employee'
  permissions: string[]
} 