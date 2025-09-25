import { apiService } from './api'
import type { ApiResponse } from './api'

export interface Model {
  id: number
  name: string
  brandId: number
  assetTypeId: number
  specifications?: any
  createdAt: string
  updatedAt: string
  brand: {
    id: number
    name: string
  }
  assetType: {
    id: number
    name: string
    category: {
      id: number
      name: string
    }
  }
  createdByUser: {
    id: number
    username: string
  }
  _count: {
    assets: number
  }
}

export interface CreateModelDto {
  name: string
  brandId: number
  assetTypeId: number
  specifications?: any
}

export interface UpdateModelDto extends Partial<CreateModelDto> {}

export interface ModelQueryDto {
  page?: number
  limit?: number
  search?: string
  brandId?: number
  assetTypeId?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ModelListResponse {
  message: string
  data: {
    models: Model[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface ModelResponse {
  message: string
  data: {
    model: Model
  }
}

class ModelService {
  private readonly baseEndpoint = '/models'

  async getModels(params: ModelQueryDto = {}): Promise<ModelListResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint
    
    return apiService.get<ModelListResponse>(endpoint)
  }



  async getModelsByBrand(brandId: number): Promise<ModelListResponse> {
    return apiService.get<ModelListResponse>(`${this.baseEndpoint}/by-brand/${brandId}`)
  }

  async getModelsByBrandAndAssetType(brandId: number, assetTypeId: number): Promise<ModelListResponse> {
    return apiService.get<ModelListResponse>(`${this.baseEndpoint}/by-brand/${brandId}/asset-type/${assetTypeId}`)
  }

  async getModelById(id: number): Promise<ModelResponse> {
    return apiService.get<ModelResponse>(`${this.baseEndpoint}/${id}`)
  }

  async createModel(modelData: CreateModelDto): Promise<ModelResponse> {
    return apiService.post<ModelResponse>(this.baseEndpoint, modelData)
  }

  async updateModel(id: number, modelData: UpdateModelDto): Promise<ModelResponse> {
    return apiService.put<ModelResponse>(`${this.baseEndpoint}/${id}`, modelData)
  }

  async deleteModel(id: number): Promise<ApiResponse<any>> {
    return apiService.delete<ApiResponse<any>>(`${this.baseEndpoint}/${id}`)
  }

  async mergeModels(sourceId: number, targetId: number): Promise<ApiResponse<any>> {
    return apiService.post<ApiResponse<any>>(`${this.baseEndpoint}/${sourceId}/merge/${targetId}`, {})
  }
}

export const modelService = new ModelService()
export default modelService 