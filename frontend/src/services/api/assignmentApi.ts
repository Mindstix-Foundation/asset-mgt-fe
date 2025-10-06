import apiClient from './apiClient'

// Types for assignment API
export interface CreateAssignmentDto {
  assetId: number
  employeeId: number
  issueDate: string
  issueCondition?: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  issueReason?: string
  notes?: string
}

export interface ReturnAssignmentDto {
  returnDate: string
  returnCondition: 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  returnReason?: string
  notes?: string
}

export interface AssignmentQueryDto {
  page?: number
  limit?: number
  search?: string
  assetId?: number
  employeeId?: number
  active?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Assignment {
  id: number
  assetId: number
  employeeId: number
  issueDate: string
  returnDate?: string
  issueCondition: string
  returnCondition?: string
  issueReason?: string
  returnReason?: string
  notes?: string
  asset: {
    id: number
    assetId: string
    assetType: { id: number; name: string }
    brand: { id: number; name: string }
    model: { id: number; name: string }
    condition: string
    status: string
    location?: string
  }
  employee: {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    email: string
  }
  issuedByUser: {
    id: number
    username: string
  }
}

export interface AssignmentResponse {
  message: string
  data: {
    assignment: Assignment
  }
}

export interface AssignmentListResponse {
  message: string
  data: {
    assignments: Assignment[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

class AssignmentApiService {
  private readonly baseURL = `/assignments`

  // Create assignment (issue asset)
  async createAssignment(assignmentData: CreateAssignmentDto): Promise<AssignmentResponse> {
    try {
      const response = await apiClient.post<AssignmentResponse>(this.baseURL, assignmentData)
      return response.data
    } catch (error: any) {
      console.error('Error creating assignment:', error)
      throw this.handleError(error)
    }
  }

  // Get all assignments with filtering
  async getAssignments(query?: AssignmentQueryDto): Promise<AssignmentListResponse> {
    try {
      const response = await apiClient.get<AssignmentListResponse>(this.baseURL, { params: query })
      return response.data
    } catch (error: any) {
      console.error('Error fetching assignments:', error)
      throw this.handleError(error)
    }
  }

  // Get active assignments (for collect asset page)
  async getActiveAssignments(query?: AssignmentQueryDto): Promise<AssignmentListResponse> {
    try {
      const response = await apiClient.get<AssignmentListResponse>(`${this.baseURL}/active`, { params: query })
      return response.data
    } catch (error: any) {
      console.error('Error fetching active assignments:', error)
      throw this.handleError(error)
    }
  }

  // Get assignment by ID
  async getAssignmentById(id: number): Promise<AssignmentResponse> {
    try {
      const response = await apiClient.get<AssignmentResponse>(`${this.baseURL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching assignment:', error)
      throw this.handleError(error)
    }
  }

  // Return asset (for collect asset functionality)
  async returnAsset(id: number, returnData: ReturnAssignmentDto): Promise<AssignmentResponse> {
    try {
      const response = await apiClient.put<AssignmentResponse>(`${this.baseURL}/${id}/return`, returnData)
      return response.data
    } catch (error: any) {
      console.error('Error returning asset:', error)
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
          // Auth handling is now done globally by AuthService
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
export const assignmentApiService = new AssignmentApiService()
export default assignmentApiService
