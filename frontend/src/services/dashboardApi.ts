import { apiService, type ApiResponse } from './api'

// Dashboard Stats Interface
export interface DashboardStats {
  totalAssets: number
  available: number
  assigned: number
  maintenance: number
}

// Analytics Data Interfaces
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
  timestamp: Date
  assetId?: string
  employeeId?: string
}

export interface AnalyticsData {
  assetDistribution: AssetDistributionData[]
  statusOverview: StatusOverviewData[]
  totalValue: number
  recentActivity: RecentActivityData[]
}

class DashboardApiService {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>('/dashboard/stats')
      return response
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return fallback data on error
      return {
        totalAssets: 0,
        available: 0,
        assigned: 0,
        maintenance: 0
      }
    }
  }

  // Get analytics data for asset distribution and recent activities
  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const response = await apiService.get<ApiResponse<AnalyticsData>>('/reports/analytics')
      return response.data
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      // Return fallback data on error
      return {
        assetDistribution: [],
        statusOverview: [],
        totalValue: 0,
        recentActivity: []
      }
    }
  }

  // Transform analytics data for dashboard display
  transformAssetDistribution(assetDistribution: AssetDistributionData[]) {
    const distributionMap = new Map<string, { assigned: number; total: number; percentage: number }>()
    
    // Initialize with common asset types
    distributionMap.set('Laptops', { assigned: 0, total: 0, percentage: 0 })
    distributionMap.set('Monitors', { assigned: 0, total: 0, percentage: 0 })
    distributionMap.set('Mobile Devices', { assigned: 0, total: 0, percentage: 0 })
    distributionMap.set('Accessories', { assigned: 0, total: 0, percentage: 0 })

    // Map API data to display format
    assetDistribution.forEach(item => {
      let displayName = item.type
      
      // Map common asset types to display names
      if (item.type.toLowerCase().includes('laptop') || item.type.toLowerCase().includes('computer')) {
        displayName = 'Laptops'
      } else if (item.type.toLowerCase().includes('monitor') || item.type.toLowerCase().includes('display')) {
        displayName = 'Monitors'
      } else if (item.type.toLowerCase().includes('mobile') || item.type.toLowerCase().includes('phone') || item.type.toLowerCase().includes('tablet')) {
        displayName = 'Mobile Devices'
      } else if (item.type.toLowerCase().includes('accessory') || item.type.toLowerCase().includes('headphone') || item.type.toLowerCase().includes('mouse') || item.type.toLowerCase().includes('keyboard')) {
        displayName = 'Accessories'
      }

      if (distributionMap.has(displayName)) {
        const existing = distributionMap.get(displayName)!
        distributionMap.set(displayName, {
          assigned: existing.assigned + item.count,
          total: existing.total + item.count,
          percentage: existing.percentage + item.percentage
        })
      } else {
        distributionMap.set(displayName, {
          assigned: item.count,
          total: item.count,
          percentage: item.percentage
        })
      }
    })

    return {
      laptops: distributionMap.get('Laptops')!,
      monitors: distributionMap.get('Monitors')!,
      mobile: distributionMap.get('Mobile Devices')!,
      accessories: distributionMap.get('Accessories')!
    }
  }

  // Transform status overview to dashboard stats format
  transformStatusOverview(statusOverview: StatusOverviewData[]): { assignedAssets: number; availableAssets: number; maintenanceAssets: number } {
    let assignedAssets = 0
    let availableAssets = 0
    let maintenanceAssets = 0

    statusOverview.forEach(item => {
      switch (item.status) {
        case 'ASSIGNED':
          assignedAssets += item.count
          break
        case 'AVAILABLE':
          availableAssets += item.count
          break
        case 'IN_MAINTENANCE':
          maintenanceAssets += item.count
          break
        default:
          console.warn(`Unknown asset status in analytics: ${item.status}`)
          break
      }
    })

    return {
      assignedAssets,
      availableAssets,
      maintenanceAssets
    }
  }

  // Transform recent activity for dashboard display
  transformRecentActivity(recentActivity: RecentActivityData[]) {
    return recentActivity.map(activity => ({
      id: activity.id,
      title: this.getActivityTitle(activity),
      description: activity.description,
      timeAgo: this.formatTimeAgo(new Date(activity.timestamp))
    }))
  }

  private getActivityTitle(activity: RecentActivityData): string {
    switch (activity.type) {
      case 'assigned':
        return `Asset ${activity.assetId} assigned`
      case 'returned':
        return `Asset returned`
      case 'maintenance':
        return `Maintenance scheduled`
      case 'added':
        return `New asset added`
      case 'retired':
        return `Asset retired`
      default:
        return 'Asset activity'
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays}d ago`
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }
}

export const dashboardApi = new DashboardApiService() 