import { apiService, type ApiResponse } from '../core/apiClient'
import apiClient from '../core/apiClient'
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
  FilterOptions,
  AssetType,
  Brand,
  Model
} from '../../types/asset.types'
import type { Vendor } from '../../types/vendor.types'

class AssetService {
  private readonly baseEndpoint = '/assets'

  // Helper method to safely convert values to strings for URL parameters
  private safeStringify(value: any): string {
    if (value === null || value === undefined) {
      return ''
    }
    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }
    if (Array.isArray(value)) {
      return value.join(',')
    }
    if (typeof value === 'object') {
      // For objects, try to extract meaningful string representation
      if (value.id !== undefined) {
        return String(value.id)
      }
      if (value.name !== undefined) {
        return String(value.name)
      }
      if (value.value !== undefined) {
        return String(value.value)
      }
      // Fallback to JSON stringify for complex objects
      return JSON.stringify(value)
    }
    return String(value)
  }

  // Get all assets with filtering and pagination
  async getAssets(params: AssetQueryParams = {}): Promise<AssetListResponse> {
    const searchParams = new URLSearchParams()
    
    // Add all query parameters
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, this.safeStringify(value))
      }
    }

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

  // Bulk delete assets
  async bulkDeleteAssets(assetIds: number[]): Promise<ApiResponse<any>> {
    return apiService.post<ApiResponse<any>>(`${this.baseEndpoint}/bulk-delete`, { assetIds })
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
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    }

    return apiService.get<SearchResponse>(`${this.baseEndpoint}/search?${searchParams.toString()}`)
  }

  // Get available assets (for assignment)
  async getAvailableAssets(params: AssetQueryParams = {}): Promise<AssetListResponse> {
    const searchParams = new URLSearchParams()
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, this.safeStringify(value))
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}/available?${queryString}` : `${this.baseEndpoint}/available`
    
    return apiService.get<AssetListResponse>(endpoint)
  }

  // Get deletable assets (for deletion management)
  async getDeletableAssets(params: AssetQueryParams = {}): Promise<AssetListResponse> {
    const searchParams = new URLSearchParams()
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, this.safeStringify(value))
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}/deletable?${queryString}` : `${this.baseEndpoint}/deletable`
    
    return apiService.get<AssetListResponse>(endpoint)
  }

  // Validate bulk upload file
  async validateBulkUpload(file: File): Promise<AssetBulkUploadResponse> {
    console.log('assetService.validateBulkUpload: Starting validation for file:', file.name)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.post(`${this.baseEndpoint}/validate-bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('assetService.validateBulkUpload: Validation successful')
      return response.data
    } catch (error: any) {
      console.error('assetService.validateBulkUpload: Error response:', error.response?.data)
      const errorData = error.response?.data || {
        message: 'Validation failed',
        error: error.message
      }
      const err = new Error(errorData.error || errorData.message || 'Validation failed')
      ;(err as any).response = { data: errorData }
      throw err
    }
  }

  // Bulk upload assets
  async bulkUploadAssets(file: File, validateOnly: boolean = false): Promise<AssetBulkUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('validate_only', validateOnly.toString())

    try {
      const response = await apiClient.post(`${this.baseEndpoint}/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      const errorData = error.response?.data || {
        message: 'Upload failed',
        error: error.message
      }
      throw new Error(errorData.error || errorData.message || 'Upload failed')
    }
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

  // Transform backend asset data to frontend display format (optimized for table)
  transformAssetForDisplay(asset: Asset): any {
    // Get current assignment info from the optimized API response
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
      model: asset.model.name,
      serialNumber: asset.serialNumber,
      status: asset.status,
      assignedTo: assignedTo,
      condition: asset.condition
      // Note: Other fields (purchaseDate, location, etc.) are only populated when viewing details
      // This keeps the table data minimal and fast
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

  // Helper validation functions to reduce cognitive complexity
  private validateRequiredFields(data: CreateAssetDto | UpdateAssetDto): string[] {
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

    return errors
  }

  private validatePurchaseDate(data: CreateAssetDto | UpdateAssetDto): string[] {
    const errors: string[] = []

    if ('purchaseDate' in data && data.purchaseDate) {
      const purchaseDate = new Date(data.purchaseDate)
      const today = new Date()
      if (purchaseDate > today) {
        errors.push('Purchase date cannot be in the future')
      }
    }

    return errors
  }

  private validateWarrantyDates(data: CreateAssetDto | UpdateAssetDto): string[] {
    const errors: string[] = []

    if ('warrantyStartDate' in data && 'warrantyEndDate' in data && data.warrantyStartDate && data.warrantyEndDate) {
      const startDate = new Date(data.warrantyStartDate)
      const endDate = new Date(data.warrantyEndDate)
      if (endDate < startDate) {
        errors.push('Warranty end date must be after start date')
      }
    }

    return errors
  }

  // Validate asset data before submission
  validateAssetData(data: CreateAssetDto | UpdateAssetDto): string[] {
    const errors: string[] = []

    // Validate required fields
    errors.push(...this.validateRequiredFields(data), ...this.validatePurchaseDate(data), ...this.validateWarrantyDates(data))

    return errors
  }

  // Export assets to Excel (server-side)
  async exportAssetsToExcel(params: AssetQueryParams = {}): Promise<void> {
    const searchParams = new URLSearchParams()
    
    // Add all query parameters
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, this.safeStringify(value))
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.baseEndpoint}/export?${queryString}` : `${this.baseEndpoint}/export`
    
    try {
      console.log('Export request:', { endpoint })
      
      const response = await apiClient.get(endpoint, {
        responseType: 'blob',
      })

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition']
      let filename = 'assets_export.xlsx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = response.data
      const url = globalThis.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      globalThis.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      throw error
    }
  }

  // Export assets to CSV (client-side)
  exportAssetsToCsv(assets: any[], filename: string = 'assets-export.csv'): void {
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
    link.remove()
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
    link.remove()
  }
}

export const assetService = new AssetService()
export default assetService 