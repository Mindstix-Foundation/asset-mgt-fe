import { apiService, type ApiResponse } from '../core/apiClient'

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
  // Always show all 6 standard categories even if they have 0 values
  transformAssetDistribution(assetDistribution: AssetDistributionData[]) {
    const normalize = (value: string) => {
      const v = value.trim().toLowerCase()
      if (v.includes('laptop')) return 'Laptop'
      if (v.includes('desktop')) return 'Desktop'
      if (v.includes('monitor') || v.includes('display')) return 'Monitor'
      if (v.includes('mobile') || v.includes('phone')) return 'Mobile'
      if (v.includes('tablet')) return 'Tablet'
      if (v.includes('accessor') || v.includes('keyboard') || v.includes('mouse') || v.includes('headphone')) return 'Accessories'
      // Fallback to original (title case first letter)
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

    // Initialize all standard categories with 0 values
    const standardCategories = ['Laptop', 'Desktop', 'Monitor', 'Mobile', 'Tablet', 'Accessories']
    const distributionMap = new Map<string, { count: number; percentage: number }>()
    
    // Initialize standard categories
    for (const category of standardCategories) {
      distributionMap.set(category, { count: 0, percentage: 0 })
    }

    // Process backend data
    for (const item of assetDistribution) {
      const name = normalize(item.type)
      const existing = distributionMap.get(name)
      if (existing) {
        distributionMap.set(name, {
          count: existing.count + item.count,
          percentage: existing.percentage + (item.percentage ?? 0)
        })
      } else {
        // For non-standard categories, add them as-is
        distributionMap.set(name, { count: item.count, percentage: item.percentage ?? 0 })
      }
    }

    // Return standard categories first, then any additional ones
    const result: Array<{ name: string; count: number; percentage: number }> = []
    
    // Add standard categories in order
    for (const category of standardCategories) {
      const data = distributionMap.get(category)!
      result.push({
        name: category,
        count: data.count,
        percentage: Math.round((data.percentage + Number.EPSILON) * 100) / 100
      })
    }
    
    // Add any additional categories from backend
    for (const [name, data] of distributionMap) {
      if (!standardCategories.includes(name)) {
        result.push({
          name,
          count: data.count,
          percentage: Math.round((data.percentage + Number.EPSILON) * 100) / 100
        })
      }
    }

    // Sort by percentage (highest to lowest) - more to less
    return result.sort((a, b) => b.percentage - a.percentage)
  }

  // Transform status overview to dashboard stats format
  transformStatusOverview(statusOverview: StatusOverviewData[]): { assignedAssets: number; availableAssets: number; maintenanceAssets: number } {
    let assignedAssets = 0
    let availableAssets = 0
    let maintenanceAssets = 0

    for (const item of statusOverview) {
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
    }

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
      timeAgo: activity.timeAgo || 'Unknown', // Fallback to 'Unknown' if timeAgo is missing
      needsRealTimeUpdate: activity.needsRealTimeUpdate,
      timestamp: typeof activity.timestamp === 'string' ? new Date(activity.timestamp) : activity.timestamp
    }))
  }


  // Helper function to increment time ago string
  private incrementTimeAgo(currentTimeAgo: string): string {
    // Handle specific minute cases
    const minuteMap: Record<string, string> = {
      'Just now': '1 minute ago',
      '1 minute ago': '2 minutes ago',
      '2 minutes ago': '3 minutes ago',
      '3 minutes ago': '4 minutes ago',
      '4 minutes ago': '5 minutes ago',
      '5 minutes ago': '6 minutes ago',
      '6 minutes ago': '7 minutes ago',
      '7 minutes ago': '8 minutes ago',
      '8 minutes ago': '9 minutes ago',
      '9 minutes ago': '10 minutes ago'
    }

    if (minuteMap[currentTimeAgo]) {
      return minuteMap[currentTimeAgo]
    }

    // Handle generic minute pattern
    const minuteRegex = /^(\d+) minutes ago$/
    const execResult = minuteRegex.exec(currentTimeAgo)
    if (execResult) {
      const minutes = Number.parseInt(execResult[1])
      if (minutes < 60) {
        return `${minutes + 1} minutes ago`
      }
    }

    // For hours, days, etc., keep the backend's timeAgo
    return currentTimeAgo
  }

  // Helper function to update single activity time
  private updateSingleActivityTime(activity: any): any {
    const needsUpdate = activity.needsRealTimeUpdate || this.shouldUpdateActivityTime(activity.timeAgo)
    
    if (!needsUpdate) {
      return activity
    }

    const newTimeAgo = this.incrementTimeAgo(activity.timeAgo)
    
    return {
      ...activity,
      timeAgo: newTimeAgo
    }
  }

  // Update time display for activities that need real-time updates
  updateActivityTimes(activities: any[]) {
    return activities.map(activity => this.updateSingleActivityTime(activity))
  }

  // Helper method to determine if an activity should be updated based on its timeAgo
  private shouldUpdateActivityTime(timeAgo: string): boolean {
    // Update activities that are less than 1 hour old
    if (timeAgo === 'Just now' || timeAgo.includes('minute')) {
      return true
    }
    // Don't update activities that are hours, days, etc. old
    return false
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