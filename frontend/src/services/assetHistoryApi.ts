import apiClient from './apiClient'

// Types for asset history API
export interface AssetHistoryEvent {
  id: string
  type: string
  dateIST: string
  description: string
  userDisplayName: string
  details?: any
  icon: string
  color: string
  status: string
  condition: string
}

export interface AssetBasicInfo {
  id: number
  assetId: string
  name: string
  currentStatus: string
  currentCondition: string
  assetType?: string
  brand?: string
  model?: string
  serialNumber?: string
  location?: string
}

export interface AssetHistoryResponse {
  timestamp: string
  description: string
  asset: AssetBasicInfo
  timeline: AssetHistoryEvent[]
  pagination: {
    currentPage: number
    totalPages: number
    totalEvents: number
    hasNext: boolean
    hasPrevious: boolean
    limit: number
  }
}

export interface AssetHistorySummaryResponse {
  timestamp: string
  description: string
  asset: AssetBasicInfo
  summary: {
    totalEvents: number
    lastActivity: string
    currentStatus: string
    currentCondition: string
    totalAssignments: number
    totalMaintenance: number
    totalStatusChanges: number
    totalCost: number
    eventCounts?: Record<string, number>
  }
  recentEvents: AssetHistoryEvent[]
  quickStats: {
    avgAssignmentDuration?: string
    maintenanceFrequency?: string
    mostCommonStatus?: string
    mostCommonCondition?: string
  }
}

class AssetHistoryApiService {
  private readonly baseURL = `/asset-history`

  // Get complete asset history with pagination and filtering
  async getAssetHistory(
    assetId: string, 
    query?: {
      page?: number
      limit?: number
      eventTypes?: string
      dateFrom?: string
      dateTo?: string
      userId?: number
      search?: string
      sortBy?: string
      sortOrder?: string
    }
  ): Promise<AssetHistoryResponse> {
    try {
      const params = { ...query }
      const response = await apiClient.get<AssetHistoryResponse>(`${this.baseURL}/${assetId}`, { params })
      return response.data
    } catch (error: any) {
      console.error('Error fetching asset history:', error)
      throw this.handleError(error)
    }
  }

  // Get asset history summary with key statistics
  async getAssetHistorySummary(
    assetId: string,
    query?: {
      _t?: string
      eventTypes?: string
      dateFrom?: string
      dateTo?: string
      search?: string
    }
  ): Promise<AssetHistorySummaryResponse> {
    try {
      const params = { ...query }
      const response = await apiClient.get<AssetHistorySummaryResponse>(`${this.baseURL}/${assetId}/summary`, { params })
      return response.data
    } catch (error: any) {
      console.error('Error fetching asset history summary:', error)
      throw this.handleError(error)
    }
  }

  // Get specific issue event for an asset to extract issue condition
  async getAssetIssueEvent(assetId: string): Promise<AssetHistoryEvent | null> {
    try {
      // Get asset history filtered for ASSET_ISSUED events only
      const response = await this.getAssetHistory(assetId, {
        eventTypes: 'ASSET_ISSUED',
        limit: 1,
        sortBy: 'date',
        sortOrder: 'desc'
      })
      
      // Return the most recent issue event
      return response.timeline.length > 0 ? response.timeline[0] : null
    } catch (error: any) {
      console.error('Error fetching asset issue event:', error)
      throw this.handleError(error)
    }
  }

  // Error handling
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred'
      const status = error.response.status
      
      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`)
        case 401:
          return new Error('Session expired. Please log in again.')
        case 403:
          return new Error('Forbidden: You do not have permission to perform this action')
        case 404:
          return new Error('Not Found: The requested resource was not found')
        case 409:
          return new Error(`Conflict: ${message}`)
        case 422:
          return new Error(`Validation Error: ${message}`)
        case 500:
          return new Error('Server Error: Please try again later')
        default:
          return new Error(`Error ${status}: ${message}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: Please check your internet connection')
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

// Export singleton instance
export const assetHistoryApiService = new AssetHistoryApiService()
export default assetHistoryApiService
