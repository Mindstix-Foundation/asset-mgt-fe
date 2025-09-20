import { apiService } from './api'

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

export interface Vendor {
  id: string
  name: string
  contactEmail: string
  contactPhone: string
}

export interface Maintenance {
  id: string
  assetId: string
  assetName: string
  maintenanceTypeId: string
  maintenanceTypeName: string
  scheduledDate: string
  frequencyDays?: number
  estimatedCost?: number
  description: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  vendorId?: string
  vendorName?: string
  assignedTo?: string
  actualCost?: number
  completionDate?: string
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
    return apiService.get('/assets')
  }

  // Get all maintenance types for dropdown
  async getMaintenanceTypes(): Promise<ApiResponse<{ maintenanceTypes: MaintenanceType[] }>> {
    return apiService.get('/maintenance-types')
  }

  // Get all vendors for dropdown
  async getVendors(): Promise<ApiResponse<{ vendors: Vendor[] }>> {
    return apiService.get('/vendors')
  }

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
  async cancelMaintenance(maintenanceId: string, data: { cancelDate: string, cancelNotes: string }): Promise<ApiResponse<{ maintenance: Maintenance }>> {
    return apiService.put(`/maintenance/${maintenanceId}/cancel`, data)
  }
}

export const maintenanceService = new MaintenanceService() 