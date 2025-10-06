import apiClient from './apiClient'

const API_BASE_URL = ''

// Types for asset API
export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED' | 'LOST'
export interface AssetQueryDto {
  page?: number
  limit?: number
  search?: string
  assetTypeId?: number
  brandId?: number
  modelId?: number
  vendorId?: number
  status?: AssetStatus
  condition?: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  location?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Asset {
  id: number
  assetId: string
  serialNumber: string
  assetType: {
    id: number
    name: string
    category: { id: number; name: string }
  }
  brand: { id: number; name: string }
  model: { 
    id: number
    name: string
    specifications?: any
  }
  condition: string
  status: string
  location?: string
  vendor?: { id: number; name: string }
  purchaseDate?: string
  purchaseCost?: number
  warrantyStartDate?: string
  warrantyUntil?: string
  notes?: string
}

export interface AssetResponse {
  message: string
  data: {
    asset: Asset
  }
}

export interface AssetListResponse {
  message: string
  data: {
    assets: Asset[]
    pagination: {
      totalCount: number
      currentPage: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
  }
}

export interface AssetStats {
  message: string
  data: {
    totalAssets: number
    available: number
    assigned: number
    inMaintenance: number
    retired: number
    lost: number
  }
}

class AssetApiService {
  private readonly baseURL = `/assets`

  // Get all assets with filtering
  async getAssets(query?: AssetQueryDto): Promise<AssetListResponse> {
    try {
      const response = await apiClient.get<AssetListResponse>(this.baseURL, { params: query })
      return response.data
    } catch (error: any) {
      console.error('Error fetching assets:', error)
      throw this.handleError(error)
    }
  }

  // Get available assets (for issue asset page)
  async getAvailableAssets(query?: AssetQueryDto): Promise<AssetListResponse> {
    try {
      const response = await apiClient.get<AssetListResponse>(`${this.baseURL}/available`, { params: query })
      return response.data
    } catch (error: any) {
      console.error('Error fetching available assets:', error)
      throw this.handleError(error)
    }
  }

  // Get asset by ID
  async getAssetById(id: number): Promise<AssetResponse> {
    try {
      const response = await apiClient.get<AssetResponse>(`${this.baseURL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching asset:', error)
      throw this.handleError(error)
    }
  }

  // Get asset statistics
  async getAssetStats(): Promise<AssetStats> {
    try {
      const response = await apiClient.get<AssetStats>(`${this.baseURL}/stats`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching asset stats:', error)
      throw this.handleError(error)
    }
  }

  // Search assets
  async searchAssets(query: { q: string; [key: string]: any }): Promise<AssetListResponse> {
    try {
      const response = await apiClient.get<AssetListResponse>(`${this.baseURL}/search`, { params: query })
      return response.data
    } catch (error: any) {
      console.error('Error searching assets:', error)
      throw this.handleError(error)
    }
  }

  // Generate next asset ID
  async generateAssetId(): Promise<{ message: string; data: { assetId: string } }> {
    try {
      const response = await apiClient.get<{ message: string; data: { assetId: string } }>(`${this.baseURL}/generate-id`)
      return response.data
    } catch (error: any) {
      console.error('Error generating asset ID:', error)
      throw this.handleError(error)
    }
  }

  // Update asset status only
  async updateAssetStatus(id: number, status: AssetStatus): Promise<{ message: string; data: { asset: Asset } }> {
    try {
      const response = await apiClient.put<{ message: string; data: { asset: Asset } }>(`${this.baseURL}/${id}`, { status })
      return response.data
    } catch (error: any) {
      console.error('Error updating asset status:', error)
      throw this.handleError(error)
    }
  }

  // Get assets for dropdown selection (minimal data)
  async getAssetsForDropdowns(params: {
    status?: AssetStatus
    assetTypeId?: number
    brandId?: number
    modelId?: number
  } = {}): Promise<{ message: string; data: { assets: Asset[] } }> {
    try {
      const response = await apiClient.get<{ message: string; data: { assets: Asset[] } }>(`${this.baseURL}/dropdowns`, { params })
      return response.data
    } catch (error: any) {
      console.error('Error getting assets for dropdowns:', error)
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
export const assetApiService = new AssetApiService()
export default assetApiService
