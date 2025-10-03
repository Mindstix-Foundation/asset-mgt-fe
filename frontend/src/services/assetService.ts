import { apiService } from './api'
import type { ApiResponse } from './api'
import type {
  Asset,
  AssetListResponse,
  AssetResponse,
  AssetStatsResponse,
  SearchResponse,
  AssetBulkUploadResponse,
  CreateAssetDto,
  UpdateAssetDto,
  AssetQueryParams,
  AssetStats,
  FilterOptions,
  AssetType,
  Brand,
  Model
} from '../types/asset.types'
import type { Vendor } from '../types/vendor.types'

class AssetService {
  private readonly baseEndpoint = '/assets'

  // Get all assets with filtering and pagination
  async getAssets(params: AssetQueryParams = {}): Promise<AssetListResponse> {
    const searchParams = new URLSearchParams()
    
    // Add all query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint
    
    return apiService.get<AssetListResponse>(endpoint)
  }

  // Get asset by ID
  async getAssetById(id: number): Promise<AssetResponse> {
    return apiService.get<AssetResponse>(`${this.baseEndpoint}/${id}`)
  }

  // Create new asset
  async createAsset(assetData: CreateAssetDto): Promise<AssetResponse> {
    return apiService.post<AssetResponse>(this.baseEndpoint, assetData)
  }

  // Update asset
  async updateAsset(id: number, assetData: UpdateAssetDto): Promise<AssetResponse> {
    return apiService.put<AssetResponse>(`${this.baseEndpoint}/${id}`, assetData)
  }

  // Retire asset
  async retireAsset(id: number, retirementData: {
    retirementDate: string;
    retirementReason: string;
    retirementNotes?: string;
  }): Promise<AssetResponse> {
    return apiService.put<AssetResponse>(`${this.baseEndpoint}/${id}/retire`, retirementData)
  }

  // Reactivate asset
  async reactivateAsset(id: number, reactivationData: {
    reactivationDate: string;
    condition: string;
    status: string;
    location: string;
    reactivationReason: string;
  }): Promise<AssetResponse> {
    return apiService.put<AssetResponse>(`${this.baseEndpoint}/${id}/reactivate`, reactivationData)
  }

  // Delete asset
  async deleteAsset(id: number): Promise<ApiResponse<any>> {
    return apiService.delete<ApiResponse<any>>(`${this.baseEndpoint}/${id}`)
  }

  // Get asset statistics for dashboard
  async getAssetStats(): Promise<AssetStatsResponse> {
    return apiService.get<AssetStatsResponse>(`${this.baseEndpoint}/stats`)
  }

  // Advanced search
  async searchAssets(params: {
    q: string
    page?: number
    limit?: number
    assetTypeId?: number
    brandId?: number
    status?: string
    condition?: string
  }): Promise<SearchResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    return apiService.get<SearchResponse>(`${this.baseEndpoint}/search?${searchParams.toString()}`)
  }

  // Get available assets (for assignment)
  async getAvailableAssets(params: AssetQueryParams = {}): Promise<AssetListResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}/available?${queryString}` : `${this.baseEndpoint}/available`
    
    return apiService.get<AssetListResponse>(endpoint)
  }

  // Validate bulk upload file
  async validateBulkUpload(file: File): Promise<AssetBulkUploadResponse> {
    console.log('assetService.validateBulkUpload: Starting validation for file:', file.name)
    
    const formData = new FormData()
    formData.append('file', file)

    const url = `${apiService.getBaseURL()}${this.baseEndpoint}/validate-bulk-upload`
    console.log('assetService.validateBulkUpload: Making request to:', url)

    // Override the default JSON content type for file upload
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary for multipart/form-data
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    })

    console.log('assetService.validateBulkUpload: Response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Validation failed',
        error: `HTTP ${response.status}: ${response.statusText}`
      }))
      console.error('assetService.validateBulkUpload: Error response:', errorData)
      
      // Create error object that preserves the response data
      const error = new Error(errorData.error || errorData.message || 'Validation failed')
      ;(error as any).response = { data: errorData }
      throw error
    }

    const result = await response.json()
    console.log('assetService.validateBulkUpload: Success response:', result)
    return result
  }

  // Bulk upload assets
  async bulkUploadAssets(file: File, validateOnly: boolean = false): Promise<AssetBulkUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('validate_only', validateOnly.toString())

    // Override the default JSON content type for file upload
    const response = await fetch(`${apiService.getBaseURL()}${this.baseEndpoint}/bulk-upload`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary for multipart/form-data
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Upload failed',
        error: `HTTP ${response.status}: ${response.statusText}`
      }))
      throw new Error(errorData.error || errorData.message || 'Upload failed')
    }

    return await response.json()
  }

  // Helper methods for filter data
  async getAssetTypes(): Promise<ApiResponse<AssetType[]>> {
    return apiService.get<ApiResponse<AssetType[]>>('/asset-types')
  }

  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return apiService.get<ApiResponse<Brand[]>>('/brands')
  }

  async getModels(): Promise<ApiResponse<Model[]>> {
    return apiService.get<ApiResponse<Model[]>>('/models')
  }

  async getVendors(): Promise<ApiResponse<Vendor[]>> {
    return apiService.get<ApiResponse<Vendor[]>>('/vendors')
  }

  // Get asset types by category
  async getAssetTypesByCategory(categoryId: number): Promise<ApiResponse<AssetType[]>> {
    return apiService.get<ApiResponse<AssetType[]>>(`/asset-types/by-category/${categoryId}`)
  }

  // Get models by brand
  async getModelsByBrand(brandId: number): Promise<ApiResponse<Model[]>> {
    return apiService.get<ApiResponse<Model[]>>(`/models/by-brand/${brandId}`)
  }

  // Get filter options (combined call for efficiency)
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const [assetTypesRes, brandsRes, vendorsRes] = await Promise.all([
        this.getAssetTypes(),
        this.getBrands(),
        this.getVendors()
      ])

      // Handle different response structures safely
      const assetTypesData = Array.isArray((assetTypesRes as any).data)
        ? (assetTypesRes as any).data
        : (assetTypesRes as any).data?.assetTypes || []
      
      const brandsData = Array.isArray((brandsRes as any).data)
        ? (brandsRes as any).data
        : (brandsRes as any).data?.brands || []
        
      const vendorsData = Array.isArray((vendorsRes as any).data)
        ? (vendorsRes as any).data
        : (vendorsRes as any).data?.vendors || []

      return {
        assetTypes: assetTypesData.map((type: any) => ({ id: type.id, name: type.name })),
        brands: brandsData.map((brand: any) => ({ id: brand.id, name: brand.name })),
        models: [], // Models will be loaded dynamically based on brand selection
        vendors: vendorsData.map((vendor: any) => ({ id: vendor.id, name: vendor.name }))
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
      return {
        assetTypes: [],
        brands: [],
        models: [],
        vendors: []
      }
    }
  }

  // Transform backend asset data to frontend display format
  transformAssetForDisplay(asset: Asset): any {
    // Get current assignment info
    const currentAssignment = asset.assetIssues && asset.assetIssues.length > 0 
      ? asset.assetIssues[0] 
      : null
    
    const assignedTo = currentAssignment 
      ? `${currentAssignment.employee.firstName} ${currentAssignment.employee.lastName}`
      : undefined

    return {
      id: asset.assetId,
      type: asset.assetType.name,
      brand: asset.brand.name,
      brandModel: `${asset.brand.name} ${asset.model.name}`,
      serialNumber: asset.serialNumber,
      status: asset.status,
      assignedTo: assignedTo,
      purchaseDate: asset.purchaseDate || '',
      location: asset.location,
      category: asset.assetType.category.name,
      condition: asset.condition,
      purchaseCost: asset.purchaseCost,
      vendor: asset.vendor?.name || 'N/A',
      warrantyUntil: asset.warrantyEndDate || '',
      warrantyStartDate: asset.warrantyStartDate || '',
      notes: asset.notes || '',
      // Assignment details (from AssetIssue - limited data available)
      assignmentReason: '',
      assignmentNotes: '',
      assignmentDate: currentAssignment?.issueDate || '',
      assignedBy: currentAssignment?.issuedByUser?.username || '',
      // Retirement details
      retirementDate: asset.retirementDate || '',
      retirementReason: asset.retirementReason || '',
      retirementNotes: asset.retirementNotes || '',
      // Reactivation details
      reactivationDate: asset.reactivationDate || '',
      reactivationReason: asset.reactivationReason || ''
    }
  }

  // Transform multiple assets for display
  transformAssetsForDisplay(assets: Asset[]): any[] {
    return assets.map(asset => this.transformAssetForDisplay(asset))
  }

  // Generate asset ID from backend API
  async generateAssetId(): Promise<string> {
    try {
      const response = await apiService.get<{ message: string; data: { assetId: string } }>(`${this.baseEndpoint}/generate-id`)
      return response.data.assetId
    } catch (error) {
      console.error('Error generating asset ID from backend:', error)
      // Fallback to timestamp-based ID if backend fails
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `AST-${timestamp}${random}`
    }
  }

  // Check if serial number is unique
  async checkSerialNumberUnique(serialNumber: string, excludeAssetId?: number): Promise<{ isUnique: boolean; serialNumber: string; existingAsset?: { id: number; assetId: string } }> {
    try {
      const params = new URLSearchParams()
      params.append('serialNumber', serialNumber)
      if (excludeAssetId) {
        params.append('excludeAssetId', excludeAssetId.toString())
      }
      
      const response = await apiService.get<{ 
        message: string; 
        data: { 
          isUnique: boolean; 
          serialNumber: string; 
          existingAsset?: { id: number; assetId: string } 
        } 
      }>(`${this.baseEndpoint}/check-serial-unique?${params.toString()}`)
      
      return response.data
    } catch (error) {
      console.error('Error checking serial number uniqueness:', error)
      // Return false on error to be safe
      return {
        isUnique: false,
        serialNumber,
        existingAsset: undefined
      }
    }
  }

  // Validate asset data before submission
  validateAssetData(data: CreateAssetDto | UpdateAssetDto): string[] {
    const errors: string[] = []

    if ('assetId' in data && !data.assetId?.trim()) {
      errors.push('Asset ID is required')
    }

    if ('serialNumber' in data && !data.serialNumber?.trim()) {
      errors.push('Serial Number is required')
    }

    if ('assetTypeId' in data && !data.assetTypeId) {
      errors.push('Asset Type is required')
    }

    if ('brandId' in data && !data.brandId) {
      errors.push('Brand is required')
    }

    if ('modelId' in data && !data.modelId) {
      errors.push('Model is required')
    }

    if ('location' in data && !data.location?.trim()) {
      errors.push('Location is required')
    }

    if ('purchaseDate' in data && data.purchaseDate) {
      const purchaseDate = new Date(data.purchaseDate)
      const today = new Date()
      if (purchaseDate > today) {
        errors.push('Purchase date cannot be in the future')
      }
    }

    if ('warrantyStartDate' in data && 'warrantyEndDate' in data && data.warrantyStartDate && data.warrantyEndDate) {
      const startDate = new Date(data.warrantyStartDate)
      const endDate = new Date(data.warrantyEndDate)
      if (endDate < startDate) {
        errors.push('Warranty end date must be after start date')
      }
    }

    return errors
  }

  // Export assets to Excel (server-side)
  async exportAssetsToExcel(params: AssetQueryParams = {}): Promise<void> {
    const searchParams = new URLSearchParams()
    
    // Add all query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}/export?${queryString}` : `${this.baseEndpoint}/export`
    
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}${endpoint}`
      
      console.log('Export request:', { apiUrl, hasToken: !!token })
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Export failed:', { status: response.status, statusText: response.statusText, error: errorText })
        throw new Error(`Export failed: ${response.statusText}`)
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'assets_export.xlsx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      throw error
    }
  }

  // Export assets to CSV (client-side)
  exportAssetsToCsv(assets: Asset[], filename: string = 'assets-export.csv'): void {
    const headers = [
      'Asset ID',
      'Serial Number',
      'Asset Type',
      'Category',
      'Brand',
      'Model',
      'Status',
      'Condition',
      'Location',
      'Purchase Date',
      'Purchase Cost',
      'Warranty Start',
      'Warranty End',
      'Vendor',
      'Notes',
      'Created At'
    ]

    const csvData = assets.map(asset => [
      asset.assetId,
      asset.serialNumber,
      asset.assetType.name,
      asset.assetType.category.name,
      asset.brand.name,
      asset.model.name,
      asset.status,
      asset.condition,
      asset.location,
      asset.purchaseDate || '',
      asset.purchaseCost || '',
      asset.warrantyStartDate || '',
      asset.warrantyEndDate || '',
      asset.vendor?.name || '',
      asset.notes || '',
      new Date(asset.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Download bulk upload template
  downloadBulkUploadTemplate(): void {
    const headers = [
      'assetId',
      'serialNumber',
      'assetTypeId',
      'brandId',
      'modelId',
      'vendorId',
      'status',
      'condition',
      'location',
      'purchaseDate',
      'purchaseCost',
      'warrantyStartDate',
      'warrantyEndDate',
      'notes'
    ]

    const sampleData = [
      [
        'AST-001',
        'SN123456789',
        '1',
        '1',
        '1',
        '1',
        'AVAILABLE',
        'NEW',
        'Warehouse A - Shelf B2',
        '2024-01-15',
        '149999',
        '2024-01-15',
        '2027-01-15',
        'High-performance laptop for development work'
      ]
    ]

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'asset-upload-template.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const assetService = new AssetService()
export default assetService 