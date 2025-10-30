// Report and analytics types

export interface ReportFilter {
  dateRange?: {
    start: string
    end: string
  }
  department?: string[]
  location?: string[]
  assetType?: string[]
  status?: string[]
}

export interface AssetReport {
  totalAssets: number
  assignedAssets: number
  availableAssets: number
  underMaintenance: number
  retiredAssets: number
  assetsByCategory: Record<string, number>
  assetsByStatus: Record<string, number>
}

export interface EmployeeReport {
  totalEmployees: number
  activeEmployees: number
  employeesWithAssets: number
  assetDistribution: Record<string, number>
}

export interface MaintenanceReport {
  totalRequests: number
  pendingRequests: number
  completedRequests: number
  totalCost: number
  averageResolutionTime: number
}

export interface CustomReport {
  id: string
  name: string
  description: string
  filters: ReportFilter
  columns: string[]
  createdBy: string
  createdAt: string
} 