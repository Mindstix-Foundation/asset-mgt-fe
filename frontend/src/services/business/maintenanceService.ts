import apiClient, { apiService } from '../core/apiClient'
import {
  filenameFromContentDisposition,
  parseBlobApiError,
  triggerBlobDownload,
} from '@/utils/exportDownload'

export interface Asset {
  id: string
  assetId: string
  assetName: string
  assetType: string
  brand: string
  model: string
  status: string
}

export interface MaintenanceType {
  id: string
  name: string
  description: string
}

// Use central Vendor type if needed
// (Kept local interface minimal to avoid conflicts)
// Vendor support removed from UI; keep server type optional if API still returns
export interface MaintenanceVendor { id: string; name: string; contactEmail: string; contactPhone: string }

export interface Maintenance {
  id: string
  assetId: string
  assetName: string
  assetType?: string
  assetBrand?: string
  assetModel?: string
  serialNumber?: string
  specifications?: Record<string, any>
  specificationLabelMap?: Record<string, string>
  maintenanceTypeId: string
  maintenanceTypeName: string
  relevantDate?: string
  dateType?: 'scheduled' | 'completion' | 'cancellation'
  frequencyDays?: number
  estimatedCost?: number
  description: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  vendorId?: string
  vendorName?: string
  assignedTo?: string
  actualCost?: number
  completionDate?: string
  completionNotes?: string
  cancellationNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMaintenanceData {
  assetId: number
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'UPGRADE'
  scheduledDate: string
  frequencyDays?: number
  estimatedCost?: number
  description: string
  vendorId?: number
}

export interface UpdateMaintenanceData {
  assetId?: number
  maintenanceType?: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'UPGRADE'
  scheduledDate?: string
  frequencyDays?: number
  estimatedCost?: number
  description?: string
  vendorId?: number
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  actualCost?: number
  completionDate?: string
}

export interface MaintenanceQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  assetId?: string
  maintenanceType?: string
  vendorId?: string
  vendorName?: string
  scheduledDateFrom?: string
  scheduledDateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface MaintenanceListResponse {
  maintenances: Maintenance[]
  pagination: {
  total: number
  page: number
  limit: number
  totalPages: number
  }
}

export interface ApiResponse<T> {
  message: string
  data: T
}

class MaintenanceService {
  // Create a new maintenance record
  async createMaintenance(data: CreateMaintenanceData): Promise<ApiResponse<{ maintenance: Maintenance }>> {
    return apiService.post('/maintenance', data)
  }

  // Get all maintenances with filtering and pagination
  async getMaintenances(params?: MaintenanceQueryParams): Promise<ApiResponse<MaintenanceListResponse>> {
    const queryString = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString() : ''
    
    const endpoint = queryString ? `/maintenance?${queryString}` : '/maintenance'
    return apiService.get(endpoint)
  }

  // Get a specific maintenance record by ID
  async getMaintenance(maintenanceId: string): Promise<ApiResponse<{ maintenance: Maintenance }>> {
    return apiService.get(`/maintenance/${maintenanceId}`)
  }

  // Update a maintenance record
  async updateMaintenance(maintenanceId: string, data: UpdateMaintenanceData): Promise<ApiResponse<{ maintenance: Maintenance }>> {
    return apiService.patch(`/maintenance/${maintenanceId}`, data)
  }

  // Delete a maintenance record
  async deleteMaintenance(maintenanceId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete(`/maintenance/${maintenanceId}`)
  }

  // Get all assets for dropdown
  async getAssets(): Promise<ApiResponse<{ assets: Asset[] }>> {
    return apiService.get('/assets/dropdowns')
  }

  // Get all maintenance types for dropdown
  async getMaintenanceTypes(): Promise<ApiResponse<{ maintenanceTypes: MaintenanceType[] }>> {
    return apiService.get('/maintenance-types')
  }

  // Vendors endpoint no longer used in UI

  // Check asset availability for maintenance scheduling
  async checkAssetAvailability(assetId: string, scheduledDate: string, excludeMaintenanceId?: string): Promise<ApiResponse<{ available: boolean }>> {
    const params = new URLSearchParams({ assetId, scheduledDate })
    if (excludeMaintenanceId) {
      params.append('excludeMaintenanceId', excludeMaintenanceId)
    }
    return apiService.get(`/maintenance/check-asset-availability?${params.toString()}`)
  }

  // Complete maintenance
  async completeMaintenance(maintenanceId: string, data: { actualCost: number, completionNotes?: string }): Promise<ApiResponse<{ maintenance: Maintenance }>> {
    return apiService.put(`/maintenance/${maintenanceId}/complete`, data)
  }

  // Cancel maintenance
  async cancelMaintenance(maintenanceId: string, data: { cancelNotes: string }): Promise<ApiResponse<{ maintenance: Maintenance }>> {
    return apiService.put(`/maintenance/${maintenanceId}/cancel`, data)
  }

  // Get maintenance history for a specific asset
  async getMaintenanceHistory(assetId: string): Promise<ApiResponse<{ 
    asset: { id: number, assetId: string, name: string }, 
    maintenanceHistory: Maintenance[], 
    totalRecords: number 
  }>> {
    return apiService.get(`/maintenance/asset/${assetId}/history`)
  }

  async getMaintenanceEvents(assetId: string, params: {
    status?: string
    type?: string
    search?: string
    dateFrom?: string
    dateTo?: string
    sortBy?: 'date' | 'status' | 'type'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ events: any[], pagination: { totalCount: number, currentPage: number, totalPages: number, hasNext: boolean, hasPrevious: boolean } }>> {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params || {})) { if (v !== undefined && v !== null && v !== '') query.append(k, String(v)) }
    const qs = query.toString()
    const suffix = qs ? `?${qs}` : ''
    return apiService.get(`/maintenance/asset/${assetId}/history-events${suffix}`)
  }

  // Export maintenance records to Excel (server-side streaming)
  async exportMaintenanceToExcel(params: MaintenanceQueryParams = {}): Promise<void> {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/maintenance/export?${queryString}` : '/maintenance/export'

    try {
      const response = await apiClient.get(endpoint, {
        responseType: 'blob',
      })

      const filename = filenameFromContentDisposition(
        response.headers['content-disposition'],
        'maintenance_export.xlsx',
      )
      triggerBlobDownload(response.data, filename)
    } catch (error) {
      console.error('Error exporting maintenance:', error)
      throw await parseBlobApiError(error)
    }
  }

  /**
   * Get maintenance statistics
   */
  async getMaintenanceStats() {
    try {
      const response = await apiClient.get('/maintenance/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching maintenance stats:', error)
      throw error
    }
  }
}

export const maintenanceService = new MaintenanceService() 
