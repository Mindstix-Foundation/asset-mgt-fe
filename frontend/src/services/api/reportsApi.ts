import { apiService, type ApiResponse } from '../core/apiClient'
import apiClient from '../core/apiClient'

export interface ReportFilters {
  reportType?: 'assets' | 'employees' | 'maintenance' | 'audit'
  assetType?: string
  assetTypeId?: number | string
  assetCountRange?: string
  assetStatus?: string
  department?: string
  dateRange?: string
  fromDate?: string
  toDate?: string
}

export interface AssetDistributionData {
  type: string
  count: number
  percentage: number
  value: number
}

export interface StatusOverviewData {
  status: string
  count: number
  percentage: number
}

export interface RecentActivityData {
  id: string
  type: 'assigned' | 'maintenance' | 'added' | 'returned' | 'retired'
  description: string
  timestamp: string
  assetId?: string
  employeeId?: string
}

export interface AnalyticsData {
  assetDistribution: AssetDistributionData[]
  statusOverview: StatusOverviewData[]
  totalValue: number
  recentActivity: RecentActivityData[]
}

export interface AssetReportData {
  id: string
  assetId: string
  type: string
  brand: string
  model: string
  serialNumber: string
  status: string
  assignedTo: string | null
  assignedEmail: string | null
  location: string
  purchaseDate: string
  purchasePrice: number
  vendor: string | null
  warrantyExpiry: string | null
}

export interface EmployeeReportData {
  employeeId: string
  employeeName: string
  email: string
  department: string
  position: string
  totalAssetsAssigned: number
  totalAssetValue: number
  assets: Array<{
    assetId: string
    type: string
    brand: string
    model: string
    serialNumber: string
    value: number
  }>
}

export interface MaintenanceReportData {
  maintenanceId: string
  assetId: string
  assetType: string
  assetBrand: string
  assetModel: string
  serialNumber: string
  maintenanceType: string
  description: string
  scheduledDate: string
  completedDate: string | null
  status: string
  cost: number
  vendor: string
  vendorContact: string
  notes: string
}

export interface ReportPreviewResponse {
  data: any[]
  total: number
}

class ReportsApiService {
  // Get analytics data for dashboard
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await apiService.get<ApiResponse<AnalyticsData>>('/reports/analytics')
    return response.data
  }

  // Get asset inventory report data
  async getAssetInventoryReport(filters?: ReportFilters): Promise<AssetReportData[]> {
    const params = new URLSearchParams()
    if (filters?.assetType) params.append('assetType', filters.assetType)
    if (filters?.fromDate) params.append('fromDate', filters.fromDate)
    if (filters?.toDate) params.append('toDate', filters.toDate)
    
    const queryString = params.toString()
    const basePath = '/reports/asset-inventory'
    const url = queryString ? `${basePath}?${queryString}` : basePath
    const response = await apiService.get<ApiResponse<AssetReportData[]>>(url)
    return response.data
  }

  // Get employee asset report data
  async getEmployeeAssetReport(filters?: ReportFilters): Promise<EmployeeReportData[]> {
    const response = await apiService.get<ApiResponse<EmployeeReportData[]>>('/reports/employee-assets')
    return response.data
  }

  // Get maintenance report data
  async getMaintenanceReport(filters?: ReportFilters): Promise<MaintenanceReportData[]> {
    const params = new URLSearchParams()
    if (filters?.fromDate) params.append('fromDate', filters.fromDate)
    if (filters?.toDate) params.append('toDate', filters.toDate)
    
    const queryString = params.toString()
    const basePath = '/reports/maintenance'
    const url = queryString ? `${basePath}?${queryString}` : basePath
    const response = await apiService.get<ApiResponse<MaintenanceReportData[]>>(url)
    return response.data
  }

  // Get report preview
  async getReportPreview(reportType: string, filters?: ReportFilters): Promise<ReportPreviewResponse> {
    const params = new URLSearchParams()
    params.append('reportType', reportType)
    if (filters?.assetType) params.append('assetType', filters.assetType)
    if (filters?.fromDate) params.append('fromDate', filters.fromDate)
    if (filters?.toDate) params.append('toDate', filters.toDate)
    
    const queryString = params.toString()
    const url = `/reports/preview?${queryString}`
    const response = await apiService.get<ApiResponse<ReportPreviewResponse>>(url)
    return response.data
  }

  // Export asset inventory to Excel
  async exportAssetInventory(filters?: ReportFilters): Promise<Blob> {
    const response = await apiClient.post('/reports/export/asset-inventory', filters || {}, {
      responseType: 'blob',
    })
    return response.data
  }

  // Export employee assets to Excel
  async exportEmployeeAssets(filters?: ReportFilters): Promise<Blob> {
    const response = await apiClient.post('/reports/export/employee-assets', filters || {}, {
      responseType: 'blob',
    })
    return response.data
  }

  // Export maintenance report to Excel
  async exportMaintenance(filters?: ReportFilters): Promise<Blob> {
    const response = await apiClient.post('/reports/export/maintenance', filters || {}, {
      responseType: 'blob',
    })
    return response.data
  }

  // Helper function to download blob as file
  downloadFile(blob: Blob, filename: string) {
    const url = globalThis.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    globalThis.URL.revokeObjectURL(url)
  }
}

export const reportsApi = new ReportsApiService() 