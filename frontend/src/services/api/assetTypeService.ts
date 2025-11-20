import { apiService, type ApiResponse } from '../core/apiClient'

export interface AssetType {
  id: number
  name: string
  description?: string
  categoryId: number
  specificationTemplate?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
  }
  createdByUser: {
    id: number
    username: string
  }
  _count: {
    assets: number
    models: number
  }
}

export interface CreateAssetTypeDto {
  name: string
  description?: string
  categoryId: number
  specificationTemplate?: Record<string, any>
}

export interface UpdateAssetTypeDto extends Partial<CreateAssetTypeDto> {}

export interface AssetTypeQueryDto {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AssetTypeListResponse {
  message: string
  data: {
    assetTypes: AssetType[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface AssetTypeResponse {
  message: string
  data: {
    assetType: AssetType
  }
}

class AssetTypeService {
  private readonly baseEndpoint = '/asset-types'

  async getAssetTypes(params: AssetTypeQueryDto = {}): Promise<AssetTypeListResponse> {
    const searchParams = new URLSearchParams()
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint
    
    return apiService.get<AssetTypeListResponse>(endpoint)
  }

  async getAssetTypesByCategory(categoryId: number): Promise<AssetTypeListResponse> {
    return apiService.get<AssetTypeListResponse>(`${this.baseEndpoint}/by-category/${categoryId}`)
  }

  async getAssetTypeById(id: number): Promise<AssetTypeResponse> {
    return apiService.get<AssetTypeResponse>(`${this.baseEndpoint}/${id}`)
  }

  async createAssetType(typeData: CreateAssetTypeDto): Promise<AssetTypeResponse> {
    return apiService.post<AssetTypeResponse>(this.baseEndpoint, typeData)
  }

  async updateAssetType(id: number, typeData: UpdateAssetTypeDto): Promise<AssetTypeResponse> {
    return apiService.put<AssetTypeResponse>(`${this.baseEndpoint}/${id}`, typeData)
  }

  async deleteAssetType(id: number): Promise<ApiResponse<any>> {
    return apiService.delete<ApiResponse<any>>(`${this.baseEndpoint}/${id}`)
  }

  async mergeAssetTypes(sourceId: number, targetId: number): Promise<ApiResponse<any>> {
    return apiService.post<ApiResponse<any>>(`${this.baseEndpoint}/${sourceId}/merge/${targetId}`, {})
  }
}

export const assetTypeService = new AssetTypeService()
export default assetTypeService 