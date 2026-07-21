import { apiService, type ApiResponse } from '../core/apiClient'

export interface Designation {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  createdByUser?: {
    id: number
    username: string
  }
  _count?: {
    employees: number
  }
}

export interface CreateDesignationDto {
  name: string
  description?: string
}

export interface DesignationQueryDto {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DesignationListResponse {
  message: string
  data: {
    designations: Designation[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface DesignationResponse {
  message: string
  data: {
    designation: Designation
  }
}

class DesignationService {
  private readonly baseEndpoint = '/designations'

  async getDesignations(params: DesignationQueryDto = {}): Promise<DesignationListResponse> {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint

    return apiService.get<DesignationListResponse>(endpoint)
  }

  async getDesignationById(id: number): Promise<DesignationResponse> {
    return apiService.get<DesignationResponse>(`${this.baseEndpoint}/${id}`)
  }

  async createDesignation(data: CreateDesignationDto): Promise<DesignationResponse> {
    return apiService.post<DesignationResponse>(this.baseEndpoint, data)
  }

  async deleteDesignation(id: number): Promise<ApiResponse<any>> {
    return apiService.delete<ApiResponse<any>>(`${this.baseEndpoint}/${id}`)
  }
}

export const designationService = new DesignationService()
export default designationService
