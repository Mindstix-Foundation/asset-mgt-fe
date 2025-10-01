import apiClient from './apiClient'

// Types for employee API
export interface EmployeeQueryDto {
  page?: number
  limit?: number
  search?: string
  status?: 'ACTIVE' | 'INACTIVE'
  hasAssets?: boolean
  assetCountRange?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  status: string
  createdAt: string
  assignedAssetsCount?: number
  assignedAssets?: Array<{
    assetId: string
    assetName: string
    assignedDate: string
    status: string
  }>
}

export interface AssetHistoryItem {
  id: number
  assetId: string
  assetName: string
  assetType: string
  brand: string
  model: string
  action: 'RETURNED' // Only completed assignments (assigned and returned)
  issueDate: string
  returnDate: string // Always present for completed assignments
  issueCondition: string
  returnCondition?: string
  issueReason?: string
  returnReason?: string
  notes?: string
  issuedBy: string
  returnedBy?: string
  duration: number // Always present for completed assignments
}

export type AssetEventAction = 'ASSIGNED' | 'RETURNED'

export interface AssetEventItem {
  id: number
  assetId: string
  assetName: string
  assetType: string
  brand: string
  model: string
  action: AssetEventAction
  date: string
  condition?: string
  reason?: string
  notes?: string
  performedBy: string
}

export interface AssetEventsResponse {
  message: string
  data: {
    assetEvents: AssetEventItem[]
    pagination: { totalCount: number; currentPage: number; totalPages: number; hasNext: boolean; hasPrevious: boolean }
  }
}

export interface EmployeeResponse {
  message: string
  data: {
    employee: Employee
  }
}

export interface EmployeeListResponse {
  message: string
  data: {
    employees: Employee[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface AssetHistoryResponse {
  message: string
  data: {
    assetHistory: AssetHistoryItem[]
  }
}

class EmployeeApiService {
  private baseURL = '/employees'

  // Get all employees with filtering
  async getEmployees(query?: EmployeeQueryDto): Promise<EmployeeListResponse> {
    try {
      const response = await apiClient.get(this.baseURL, {
        params: query
      })
      return response.data
    } catch (error: any) {
      console.error('Error fetching employees:', error)
      throw this.handleError(error)
    }
  }

  // Get active employees (for issue asset page) - NO LIMIT to show all employees
  async getActiveEmployees(query?: Omit<EmployeeQueryDto, 'status' | 'limit'>): Promise<EmployeeListResponse> {
    try {
      // Remove limit to get all active employees
      const activeQuery = { ...query, status: 'ACTIVE' as const }
      const response = await apiClient.get(this.baseURL, {
        params: activeQuery
      })
      return response.data
    } catch (error: any) {
      console.error('Error fetching active employees:', error)
      throw this.handleError(error)
    }
  }

  // Get all employees for dropdown selection (minimal data, no pagination)
  async getEmployeesForDropdowns(status?: 'ACTIVE' | 'INACTIVE'): Promise<EmployeeListResponse> {
    try {
      const params: any = {}
      if (status) {
        params.status = status
      }
      
      const response = await apiClient.get(`${this.baseURL}/dropdowns`, {
        params
      })
      return response.data
    } catch (error: any) {
      console.error('Error fetching employees for dropdowns:', error)
      throw this.handleError(error)
    }
  }

  // Get employee by ID
  async getEmployeeById(id: string, includeAssets: boolean = true): Promise<EmployeeResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}`, {
        params: { include_assets: includeAssets }
      })
      return response.data
    } catch (error: any) {
      console.error('Error fetching employee:', error)
      throw this.handleError(error)
    }
  }

  // Check if email is available
  async isEmailAvailable(email: string, excludeEmployeeId?: string): Promise<{ available: boolean }> {
    try {
      const response = await apiClient.get(`${this.baseURL}/check-email`, {
        params: { email, exclude_employee_id: excludeEmployeeId }
      })
      return response.data
    } catch (error: any) {
      console.error('Error checking email availability:', error)
      throw this.handleError(error)
    }
  }

  // Search employees
  async searchEmployees(query: string, limit: number = 10, includeInactive: boolean = false): Promise<EmployeeListResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/search`, {
        params: { q: query, limit, include_inactive: includeInactive }
      })
      return response.data
    } catch (error: any) {
      console.error('Error searching employees:', error)
      throw this.handleError(error)
    }
  }

  // Get asset history for an employee
  async getAssetHistory(employeeId: string): Promise<AssetHistoryResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${employeeId}/asset-history`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching asset history:', error)
      throw this.handleError(error)
    }
  }

  // Get per-event asset history for an employee
  async getAssetEvents(
    employeeId: string,
    params?: {
      action?: AssetEventAction
      assetType?: string
      dateFrom?: string
      dateTo?: string
      search?: string
      sortBy?: 'date' | 'action' | 'assetType'
      sortOrder?: 'asc' | 'desc'
      page?: number
      limit?: number
    }
  ): Promise<AssetEventsResponse> {
    try {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') query.append(k, String(v))
        })
      }
      const response = await apiClient.get(`${this.baseURL}/${employeeId}/asset-events${query.toString() ? `?${query.toString()}` : ''}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching asset events:', error)
      throw this.handleError(error)
    }
  }

  // Error handling
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred'
      const status = error.response.status
      
      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`)
        case 401:
          return new Error('Session expired. Please log in again.')
        case 403:
          return new Error('Forbidden: You do not have permission to perform this action')
        case 404:
          return new Error('Not Found: The requested resource was not found')
        case 409:
          return new Error(`Conflict: ${message}`)
        case 422:
          return new Error(`Validation Error: ${message}`)
        case 500:
          return new Error('Server Error: Please try again later')
        default:
          return new Error(`Error ${status}: ${message}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: Please check your internet connection')
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

// Export singleton instance
export const employeeApiService = new EmployeeApiService()
export default employeeApiService
