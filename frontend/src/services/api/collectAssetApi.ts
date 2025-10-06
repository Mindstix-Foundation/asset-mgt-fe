import apiClient from './apiClient'

// Types for collect asset API
export interface ActiveAssignment {
  id: number
  assetId: number
  employeeId: number
  issueDate: string
  issueCondition: string
  issueReason?: string
  notes?: string
  asset: {
    id: number
    assetId: string
    serialNumber?: string
    assetType: { id: number; name: string }
    brand: { id: number; name: string }
    model: { 
      id: number
      name: string
      specifications?: any
    }
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

export interface ReturnAssignmentDto {
  returnDate: string
  returnCondition: 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  returnReason?: string
  notes?: string
}

export interface ActiveAssignmentsResponse {
  message: string
  data: {
    assignments: ActiveAssignment[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface ReturnAssetResponse {
  message: string
  data: {
    assignment: ActiveAssignment & {
      returnDate: string
      returnCondition: string
      returnReason?: string
    }
  }
}

class CollectAssetApiService {
  private readonly baseURL = `/assignments`

  // Get all active assignments (assigned assets) - NO LIMIT to show all
  async getActiveAssignments(query?: { search?: string; employeeId?: number }): Promise<ActiveAssignmentsResponse> {
    try {
      // Use the enhanced endpoint for collect asset page
      const params = { ...query }
      const response = await apiClient.get<ActiveAssignmentsResponse>(`${this.baseURL}/active/collect`, { params })
      return response.data
    } catch (error: any) {
      console.error('Error fetching active assignments:', error)
      throw this.handleError(error)
    }
  }

  // Return/collect asset from employee
  async collectAsset(assignmentId: number, returnData: ReturnAssignmentDto): Promise<ReturnAssetResponse> {
    try {
      const response = await apiClient.put<ReturnAssetResponse>(`${this.baseURL}/${assignmentId}/return`, returnData)
      return response.data
    } catch (error: any) {
      console.error('Error collecting asset:', error)
      throw this.handleError(error)
    }
  }

  // Get assignment by ID
  async getAssignmentById(id: number): Promise<{ message: string; data: { assignment: ActiveAssignment } }> {
    try {
      const response = await apiClient.get<{ message: string; data: { assignment: ActiveAssignment } }>(`${this.baseURL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching assignment:', error)
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
export const collectAssetApiService = new CollectAssetApiService()
export default collectAssetApiService
