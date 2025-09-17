import axios from 'axios'
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

// API Base URL - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Vendor API Service
export class VendorApiService {
  // Create a new vendor
  static async createVendor(vendorData: CreateVendorDto): Promise<VendorResponse> {
    console.log('Creating vendor with data:', vendorData)
    const response = await apiClient.post('/vendors', vendorData)
    console.log('Vendor created successfully:', response.data)
    return response.data
  }

  // Get all vendors with filtering and pagination
  static async getVendors(query: VendorQueryParams = {}): Promise<VendorsListResponse> {
    console.log('Making API request to:', `${API_BASE_URL}/vendors`)
    console.log('Query params:', query)
    const response = await apiClient.get('/vendors', { params: query })
    console.log('Raw API response:', response)
    return response.data
  }

  // Search vendors
  static async searchVendors(searchQuery: VendorSearchParams): Promise<VendorSearchResponse> {
    console.log('Searching vendors with query:', searchQuery)
    const response = await apiClient.get('/vendors/search', { params: searchQuery })
    console.log('Search results:', response.data)
    return response.data
  }

  // Get vendor by ID
  static async getVendorById(id: number): Promise<VendorResponse> {
    console.log('Fetching vendor by ID:', id)
    const response = await apiClient.get(`/vendors/${id}`)
    console.log('Vendor details:', response.data)
    return response.data
  }

  // Update vendor
  static async updateVendor(id: number, vendorData: UpdateVendorDto): Promise<VendorResponse> {
    console.log('Updating vendor:', id, 'with data:', vendorData)
    const response = await apiClient.put(`/vendors/${id}`, vendorData)
    console.log('Vendor updated successfully:', response.data)
    return response.data
  }

  // Update vendor status
  static async updateVendorStatus(id: number, statusData: VendorStatusDto): Promise<VendorResponse> {
    console.log('Updating vendor status:', id, 'to:', statusData.status)
    const response = await apiClient.patch(`/vendors/${id}/status`, statusData)
    console.log('Vendor status updated successfully:', response.data)
    return response.data
  }

  // Bulk upload vendors
  static async bulkUploadVendors(
    file: File, 
    validateOnly: boolean = false
  ): Promise<BulkUploadResponse> {
    console.log('Bulk uploading vendors, file:', file.name, 'validate only:', validateOnly)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('validate_only', validateOnly.toString())

    const response = await apiClient.post('/vendors/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Bulk upload result:', response.data)
    return response.data
  }
}

// Export default instance
export default VendorApiService
