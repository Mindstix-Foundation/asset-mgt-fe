import apiClient from './apiClient'
import type {
  CreateVendorDto,
  UpdateVendorDto,
  VendorQueryParams,
  VendorSearchParams,
  VendorStatusDto,
  VendorsListResponse,
  VendorResponse,
  VendorSearchResponse,
  BulkUploadResponse
} from '../types/vendor.types'

// Vendor API Service
export class VendorApiService {
  // Create a new vendor
  static async createVendor(vendorData: CreateVendorDto): Promise<VendorResponse> {
    const response = await apiClient.post('/vendors', vendorData)
    return response.data
  }

  // Get all vendors with filtering and pagination
  static async getVendors(query: VendorQueryParams = {}): Promise<VendorsListResponse> {
    const response = await apiClient.get('/vendors', { params: query })
    return response.data
  }

  // Search vendors
  static async searchVendors(searchQuery: VendorSearchParams): Promise<VendorSearchResponse> {
    const response = await apiClient.get('/vendors/search', { params: searchQuery })
    return response.data
  }

  // Get vendor by ID
  static async getVendorById(id: number): Promise<VendorResponse> {
    const response = await apiClient.get(`/vendors/${id}`)
    return response.data
  }

  // Update vendor
  static async updateVendor(id: number, vendorData: UpdateVendorDto): Promise<VendorResponse> {
    const response = await apiClient.put(`/vendors/${id}`, vendorData)
    return response.data
  }

  // Update vendor status
  static async updateVendorStatus(id: number, statusData: VendorStatusDto): Promise<VendorResponse> {
    const response = await apiClient.patch(`/vendors/${id}/status`, statusData)
    return response.data
  }

  // Bulk upload vendors
  static async bulkUploadVendors(
    file: File, 
    validateOnly: boolean = false
  ): Promise<BulkUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('validate_only', validateOnly.toString())

    const response = await apiClient.post('/vendors/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

// Export default instance
export default VendorApiService
