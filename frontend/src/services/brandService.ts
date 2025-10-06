import { apiService, type ApiResponse } from './apiClient'

export interface Brand {
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
    assets: number
    models: number
  }
}

export interface CreateBrandDto {
  name: string
  description?: string
}

export interface UpdateBrandDto extends Partial<CreateBrandDto> {}

export interface BrandQueryDto {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BrandListResponse {
  message: string
  data: {
    brands: Brand[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface BrandResponse {
  message: string
  data: {
    brand: Brand
  }
}

class BrandService {
  private readonly baseEndpoint = '/brands'

  async getBrands(params: BrandQueryDto = {}): Promise<BrandListResponse> {
    const searchParams = new URLSearchParams()
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint
    
    return apiService.get<BrandListResponse>(endpoint)
  }

  async getBrandById(id: number): Promise<BrandResponse> {
    return apiService.get<BrandResponse>(`${this.baseEndpoint}/${id}`)
  }

  async createBrand(brandData: CreateBrandDto): Promise<BrandResponse> {
    return apiService.post<BrandResponse>(this.baseEndpoint, brandData)
  }

  async updateBrand(id: number, brandData: UpdateBrandDto): Promise<BrandResponse> {
    return apiService.put<BrandResponse>(`${this.baseEndpoint}/${id}`, brandData)
  }

  async deleteBrand(id: number): Promise<ApiResponse<any>> {
    return apiService.delete<ApiResponse<any>>(`${this.baseEndpoint}/${id}`)
  }

  async mergeBrands(sourceId: number, targetId: number): Promise<ApiResponse<any>> {
    return apiService.post<ApiResponse<any>>(`${this.baseEndpoint}/${sourceId}/merge/${targetId}`, {})
  }
}

export const brandService = new BrandService()
export default brandService 