import { apiService, type ApiResponse } from './apiClient'

export interface AssetCategory {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  createdByUser: {
    id: number
    username: string
  }
  _count: {
    assetTypes: number
  }
}

export interface CreateAssetCategoryDto {
  name: string
  description?: string
}

export interface UpdateAssetCategoryDto extends Partial<CreateAssetCategoryDto> {}

export interface AssetCategoryQueryDto {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AssetCategoryListResponse {
  message: string
  data: {
    assetCategories: AssetCategory[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface AssetCategoryResponse {
  message: string
  data: {
    assetCategory: AssetCategory
  }
}

class AssetCategoryService {
  private readonly baseEndpoint = '/asset-categories'

  async getAssetCategories(params: AssetCategoryQueryDto = {}): Promise<AssetCategoryListResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint
    
    return apiService.get<AssetCategoryListResponse>(endpoint)
  }

  async getAssetCategoryById(id: number): Promise<AssetCategoryResponse> {
    return apiService.get<AssetCategoryResponse>(`${this.baseEndpoint}/${id}`)
  }

  async createAssetCategory(categoryData: CreateAssetCategoryDto): Promise<AssetCategoryResponse> {
    return apiService.post<AssetCategoryResponse>(this.baseEndpoint, categoryData)
  }

  async updateAssetCategory(id: number, categoryData: UpdateAssetCategoryDto): Promise<AssetCategoryResponse> {
    return apiService.put<AssetCategoryResponse>(`${this.baseEndpoint}/${id}`, categoryData)
  }

  async deleteAssetCategory(id: number): Promise<ApiResponse<any>> {
    return apiService.delete<ApiResponse<any>>(`${this.baseEndpoint}/${id}`)
  }

  async mergeAssetCategories(sourceId: number, targetId: number): Promise<ApiResponse<any>> {
    return apiService.post<ApiResponse<any>>(`${this.baseEndpoint}/${sourceId}/merge/${targetId}`, {})
  }
}

export const assetCategoryService = new AssetCategoryService()
export default assetCategoryService 