import { apiService, type ApiResponse } from './apiClient'
import apiClient from './apiClient'

// Types based on the API specification
export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
  assignedAssets?: AssignedAsset[]
  assignedAssetsCount?: number
}

export interface AssignedAsset {
  assetId: string
  assetName: string
  assignedDate: string
  status: string
}

export interface CreateEmployeeData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
}

export interface UpdateEmployeeData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface EmployeeQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: 'ACTIVE' | 'INACTIVE'
  hasAssets?: boolean
  assetCountRange?: '0' | '1-2' | '3+'
  sortBy?: 'name' | 'employeeId' | 'email' | 'status' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface EmployeeSearchParams {
  q: string
  limit?: number
  includeInactive?: boolean
}

export interface PaginationInfo {
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface EmployeeListResponse {
  employees: Employee[]
  pagination: PaginationInfo
}

export interface EmployeeSearchResult {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  status: 'ACTIVE' | 'INACTIVE'
  assignedAssetsCount: number
  phone?: string
  matchFields: string[]
}

export interface EmployeeSearchResponse {
  searchResults: EmployeeSearchResult[]
  totalFound: number
  searchQuery: string
  searchTimeMs: number
}

class EmployeeService {
  /**
   * Create a new employee
   */
  async createEmployee(data: CreateEmployeeData): Promise<ApiResponse<{ employee: Employee }>> {
    return apiService.post('/employees', data)
  }

  /** Check if an email is available */
  async checkEmailAvailability(email: string, excludeId?: string): Promise<ApiResponse<{ available: boolean }>> {
    // Build query manually to avoid encoding '@' as %40
    const queryParts: string[] = []
    if (email !== undefined && email !== null) {
      queryParts.push(`email=${email}`)
    }
    if (excludeId) {
      queryParts.push(`excludeId=${excludeId}`)
    }
    const query = queryParts.join('&')
    return apiService.get(`/employees/check-email?${query}`)
  }

  /**
   * Get all employees with optional filtering and pagination
   */
  async getEmployees(params?: EmployeeQueryParams): Promise<ApiResponse<EmployeeListResponse>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.hasAssets !== undefined) searchParams.append('hasAssets', params.hasAssets.toString())
    if (params?.assetCountRange) searchParams.append('assetCountRange', params.assetCountRange)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/employees?${queryString}` : '/employees'
    
    return apiService.get(endpoint)
  }

  /**
   * Get a specific employee by ID
   */
  async getEmployee(
    employeeId: string, 
    includeAssets: boolean = true
  ): Promise<ApiResponse<{ employee: Employee }>> {
    const params = includeAssets ? '?include_assets=true' : '?include_assets=false'
    return apiService.get(`/employees/${employeeId}${params}`)
  }

  /**
   * Update an employee
   */
  async updateEmployee(
    employeeId: string, 
    data: UpdateEmployeeData
  ): Promise<ApiResponse<{ employee: Employee }>> {
    return apiService.put(`/employees/${employeeId}`, data)
  }

  /**
   * Delete an employee
   */
  async deleteEmployee(
    employeeId: string, 
    reassignAssetsTo?: string
  ): Promise<ApiResponse<{ employee: Employee }>> {
    const data = reassignAssetsTo ? { reassign_assets_to: reassignAssetsTo } : undefined
    return apiService.delete(`/employees/${employeeId}`, data)
  }

  /**
   * Search employees
   */
  async searchEmployees(params: EmployeeSearchParams): Promise<ApiResponse<EmployeeSearchResponse>> {
    const searchParams = new URLSearchParams()
    searchParams.append('q', params.q)
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.includeInactive !== undefined) {
      searchParams.append('includeInactive', params.includeInactive.toString())
    }

    return apiService.get(`/employees/search?${searchParams.toString()}`)
  }

  /**
   * Get all employees for dropdown selection (minimal data)
   */
  async getEmployeesForDropdowns(status?: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<{ employees: Employee[] }>> {
    const params = new URLSearchParams()
    if (status) {
      params.append('status', status)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/employees/dropdowns?${queryString}` : '/employees/dropdowns'
    
    return apiService.get(url)
  }

  /**
   * Generate employee ID preview (for frontend display)
   */
  generateEmployeeIdPreview(firstName: string, lastName: string): string {
    if (!firstName || !lastName) return 'EMP-XXX'
    
    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()
    const randomNum = Math.floor(Math.random() * 999) + 1
    
    return `EMP-${firstInitial}${lastInitial}${randomNum.toString().padStart(3, '0')}`
  }

  /**
   * Validate employee data before submission
   */
  validateEmployeeData(data: CreateEmployeeData | UpdateEmployeeData): string[] {
    const errors: string[] = []

    if ('firstName' in data && data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters')
      }
      if (data.firstName.length > 50) {
        errors.push('First name cannot exceed 50 characters')
      }
      if (!/^[A-Za-z\s]+$/.test(data.firstName)) {
        errors.push('First name can only contain letters and spaces')
      }
    }

    if ('lastName' in data && data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters')
      }
      if (data.lastName.length > 50) {
        errors.push('Last name cannot exceed 50 characters')
      }
      if (!/^[A-Za-z\s]+$/.test(data.lastName)) {
        errors.push('Last name can only contain letters and spaces')
      }
    }

    if ('email' in data && data.email !== undefined) {
      if (!data.email || !data.email.includes('@')) {
        errors.push('Please enter a valid email address')
      }
      if (data.email.length > 255) {
        errors.push('Email cannot exceed 255 characters')
      }
    }

    if ('phone' in data && data.phone) {
      if (data.phone.length < 10) {
        errors.push('Phone number must be at least 10 digits')
      }
      if (data.phone.length > 15) {
        errors.push('Phone number cannot exceed 15 characters')
      }
    }

    if ('dateOfBirth' in data && data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth)
      const today = new Date()
      const minAge = new Date()
      minAge.setFullYear(today.getFullYear() - 100)
      const maxAge = new Date()
      maxAge.setFullYear(today.getFullYear() - 16)

      if (birthDate > today) {
        errors.push('Date of birth cannot be in the future')
      } else if (birthDate > maxAge) {
        errors.push('Employee must be at least 16 years old')
      } else if (birthDate < minAge) {
        errors.push('Please enter a valid date of birth')
      }
    }

    if ('address' in data && data.address && data.address.length > 500) {
      errors.push('Address cannot exceed 500 characters')
    }

    return errors
  }

  /**
   * Validate bulk upload file for employees
   */
  async validateBulkUpload(file: File): Promise<ApiResponse<{ errors: any[], totalRows: number }>> {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await apiClient.post('/employees/bulk-upload/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      const errorData = error.response?.data || {
        message: 'Validation failed',
        error: error.message
      }
      const err = new Error(errorData.error || errorData.message || 'Validation failed')
      ;(err as any).response = { data: errorData, status: error.response?.status }
      throw err
    }
  }

  /**
   * Bulk upload employees
   */
  async bulkUploadEmployees(file: File, validateOnly: boolean = false): Promise<ApiResponse<{ imported: number, errors: any[] }>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('validateOnly', validateOnly.toString())
    
    try {
      const response = await apiClient.post('/employees/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      const errorData = error.response?.data || {
        message: 'Upload failed',
        error: error.message
      }
      const err = new Error(errorData.error || errorData.message || 'Upload failed')
      ;(err as any).response = { data: errorData, status: error.response?.status }
      throw err
    }
  }

  // Export employees to Excel (server-side)
  async exportEmployeesToExcel(params: EmployeeQueryParams = {}): Promise<void> {
    const searchParams = new URLSearchParams()
    
    // Add all query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/employees/export?${queryString}` : '/employees/export'
    
    try {
      console.log('Employee export request:', { endpoint })
      
      const response = await apiClient.get(endpoint, {
        responseType: 'blob',
      })

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition']
      let filename = 'employees_export.xlsx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('Employee export completed successfully')
    } catch (error) {
      console.error('Error exporting employees:', error)
      throw error
    }
  }
}

export const employeeService = new EmployeeService() 