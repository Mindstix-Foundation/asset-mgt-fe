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
  type: 'asset_added' | 'asset_edited' | 'asset_issued' | 'asset_collected' | 'employee_added' | 'employee_edited' | 'maintenance_added' | 'maintenance_edited' | 'maintenance_completed' | 'maintenance_cancelled' | 'vendor_added' | 'vendor_edited'
  description: string
  timestamp: Date
  timeAgo: string
  needsRealTimeUpdate: boolean
  assetId?: string
  employeeId?: string
  maintenanceId?: string
  vendorId?: string
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
      timeAgo: activity.timeAgo,
      needsRealTimeUpdate: activity.needsRealTimeUpdate,
      timestamp: typeof activity.timestamp === 'string' ? new Date(activity.timestamp) : activity.timestamp
    }))
  }

  // Update time display for activities that need real-time updates
  updateActivityTimes(activities: any[]) {
    return activities.map(activity => {
      if (activity.needsRealTimeUpdate && activity.timestamp) {
        try {
          // Ensure timestamp is properly parsed as Date
          let timestamp: Date
          
          if (typeof activity.timestamp === 'string') {
            timestamp = new Date(activity.timestamp)
          } else if (activity.timestamp instanceof Date) {
            timestamp = activity.timestamp
          } else {
            // Handle other possible formats
            timestamp = new Date(activity.timestamp)
          }
          
          // Validate the date is valid
          if (isNaN(timestamp.getTime())) {
            console.warn('Invalid timestamp for activity:', {
              id: activity.id,
              timestamp: activity.timestamp,
              type: typeof activity.timestamp
            })
            return activity
          }
          
          const newTimeAgo = this.formatTimeAgo(timestamp)
          
          // Debug logging for the first few activities
          if (Math.random() < 0.1) { // Log 10% of updates for debugging
            console.log('Time update:', {
              id: activity.id,
              originalTimeAgo: activity.timeAgo,
              newTimeAgo,
              timestamp: timestamp.toISOString(),
              now: new Date().toISOString()
            })
          }
          
          return {
            ...activity,
            timeAgo: newTimeAgo
          }
        } catch (error) {
          console.error('Error updating activity time:', error, activity)
          return activity
        }
      }
      return activity
    })
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Debug logging to identify the issue
    if (diffInSeconds < 0) {
      console.warn('Negative time difference detected:', {
        now: now.toISOString(),
        date: date.toISOString(),
        diffInSeconds
      })
    }

    if (diffInSeconds < 60) {
      return 'Just now'
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`
    }

    const diffInYears = Math.floor(diffInDays / 365)
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`
  }

  private getActivityTitle(activity: RecentActivityData): string {
    switch (activity.type) {
      case 'asset_added':
        return `Asset Added`
      case 'asset_edited':
        return `Asset Updated`
      case 'asset_issued':
        return `Asset Issued`
      case 'asset_collected':
        return `Asset Collected`
      case 'employee_added':
        return `Employee Added`
      case 'employee_edited':
        return `Employee Updated`
      case 'maintenance_added':
        return `Maintenance Scheduled`
      case 'maintenance_edited':
        return `Maintenance Updated`
      case 'maintenance_completed':
        return `Maintenance Completed`
      case 'maintenance_cancelled':
        return `Maintenance Cancelled`
      case 'vendor_added':
        return `Vendor Added`
      case 'vendor_edited':
        return `Vendor Updated`
      default:
        return 'Activity'
    }
  }

}

export const dashboardApi = new DashboardApiService() 