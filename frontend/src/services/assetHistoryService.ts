import { apiService } from './apiClient'
import type { 
  AssetHistoryResponse, 
  AssetHistorySummaryResponse,
  AssetHistoryQueryParams 
} from '@/types/assetHistory.types'
import { AssetEventType } from '@/types/assetHistory.types'

export class AssetHistoryService {
  /**
   * Get paginated asset history with filtering
   */
  async getAssetHistory(
    assetId: string, 
    params: AssetHistoryQueryParams = {}
  ): Promise<AssetHistoryResponse> {
    try {
      // Convert array eventTypes to comma-separated string
      const queryParams = {
        ...params,
        eventTypes: Array.isArray(params.eventTypes) 
          ? params.eventTypes.join(',') 
          : params.eventTypes
      }

      // Build query string
      const queryString = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&')

      const endpoint = `/asset-history/${assetId}${queryString ? `?${queryString}` : ''}`
      const response = await apiService.get<AssetHistoryResponse>(endpoint)

      return response
    } catch (error) {
      console.error('Error fetching asset history:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get asset history summary with recent events and statistics
   */
  async getAssetHistorySummary(assetId: string, params: Record<string, any> = {}): Promise<AssetHistorySummaryResponse> {
    try {
      // Build query string for cache-busting and other parameters
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')

      const endpoint = `/asset-history/${assetId}/summary${queryString ? `?${queryString}` : ''}`
      const response = await apiService.get<AssetHistorySummaryResponse>(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching asset history summary:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get assignment history for an asset
   */
  async getAssetAssignmentHistory(
    assetId: string,
    params: AssetHistoryQueryParams = {}
  ): Promise<AssetHistoryResponse> {
    try {
      const queryParams = {
        ...params,
        eventTypes: 'ASSIGNED,RETURNED'
      }

      return this.getAssetHistory(assetId, queryParams)
    } catch (error) {
      console.error('Error fetching asset assignment history:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get maintenance history for an asset
   */
  async getAssetMaintenanceHistory(
    assetId: string,
    params: AssetHistoryQueryParams = {}
  ): Promise<AssetHistoryResponse> {
    try {
      const queryParams = {
        ...params,
        eventTypes: 'MAINTENANCE_SCHEDULED,MAINTENANCE_STARTED,MAINTENANCE_COMPLETED,MAINTENANCE_CANCELLED'
      }

      return this.getAssetHistory(assetId, queryParams)
    } catch (error) {
      console.error('Error fetching asset maintenance history:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Export asset history to various formats
   */
  async exportAssetHistory(
    assetId: string,
    format: 'json' | 'csv' | 'pdf' = 'json',
    params: AssetHistoryQueryParams = {}
  ): Promise<Blob> {
    // For now, export as JSON
    const data = await this.getAssetHistory(assetId, { ...params, limit: 1000 })
    const jsonStr = JSON.stringify(data, null, 2)
    return new Blob([jsonStr], { type: 'application/json' })
  }

  /**
   * Search across asset history events
   */
  async searchAssetHistory(
    assetId: string,
    searchQuery: string,
    params: AssetHistoryQueryParams = {}
  ): Promise<AssetHistoryResponse> {
    try {
      const queryParams = {
        ...params,
        search: searchQuery
      }

      return this.getAssetHistory(assetId, queryParams)
    } catch (error) {
      console.error('Error searching asset history:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get asset lifecycle timeline (simplified view)
   */
  async getAssetLifecycleTimeline(assetId: string): Promise<AssetHistoryResponse> {
    try {
      const queryParams = {
        eventTypes: [
          AssetEventType.ASSET_CREATED, 
          AssetEventType.ASSIGNED, 
          AssetEventType.RETURNED, 
          AssetEventType.MAINTENANCE_COMPLETED, 
          AssetEventType.RETIRED, 
          AssetEventType.REACTIVATED
        ],
        limit: 50,
        sortBy: 'date' as const,
        sortOrder: 'asc' as const
      }

      return this.getAssetHistory(assetId, queryParams)
    } catch (error) {
      console.error('Error fetching asset lifecycle timeline:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred while fetching asset history'
      return new Error(message)
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to connect to server')
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

// Export singleton instance
export const assetHistoryService = new AssetHistoryService()
export default assetHistoryService
