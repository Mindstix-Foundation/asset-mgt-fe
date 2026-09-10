import { apiService, type ApiResponse } from '../core/apiClient'
import { parseApiDate } from '@/utils/date'

export interface AuditChange {
  field: string
  label: string
  oldValue: unknown
  newValue: unknown
}

export interface AuditLogEntry {
  id: number
  tableName: string
  tableDisplayName: string
  recordId: number
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  entityLabel: string | null
  summary: string | null
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  changedFields: string[]
  changes: AuditChange[]
  metadata: Record<string, unknown>
  performedBy: {
    userId: number
    name?: string
    name: string
    employeeId?: string
  }
  createdAt: string
}

export interface AuditLogsQuery {
  page?: number
  limit?: number
  tableName?: string
  action?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface AuditLogsPagination {
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

class AuditApiService {
  async getAuditLogs(params: AuditLogsQuery = {}): Promise<{
    logs: AuditLogEntry[]
    pagination: AuditLogsPagination
  }> {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value))
      }
    }
    const qs = query.toString()
    const endpoint = qs ? `/audit-logs?${qs}` : '/audit-logs'
    const response: ApiResponse<{
      logs: AuditLogEntry[]
      pagination: AuditLogsPagination
    }> = await apiService.get(endpoint)
    return response.data
  }

  formatAuditAction(action: string) {
    switch (action) {
      case 'INSERT': return 'Created'
      case 'UPDATE': return 'Updated'
      case 'DELETE': return 'Deleted'
      default: return action
    }
  }

  private formatRelativeTime(ts?: string) {
    const d = parseApiDate(ts)
    if (!d) return 'Unknown'
    const diffMs = Date.now() - d.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return mins === 1 ? '1 minute ago' : `${mins} minutes ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return days === 1 ? '1 day ago' : `${days} days ago`
  }

  private needsRealTimeUpdate(ts?: string) {
    const d = parseApiDate(ts)
    if (!d) return false
    const diffMs = Date.now() - d.getTime()
    return diffMs < 60 * 60 * 1000
  }

  transformForRecentActivity(logs: AuditLogEntry[]) {
    return logs.map((log) => {
      const timestamp = parseApiDate(log.createdAt) ?? new Date('Invalid Date')
      return {
        id: String(log.id),
        title: `${log.tableDisplayName} ${this.formatAuditAction(log.action)}`,
        description: log.summary || '—',
        timeAgo: this.formatRelativeTime(log.createdAt),
        needsRealTimeUpdate: this.needsRealTimeUpdate(log.createdAt),
        timestamp,
      }
    })
  }

  async getRecentActivities(limit = 15) {
    try {
      const result = await this.getAuditLogs({ page: 1, limit })
      return this.transformForRecentActivity(result.logs || [])
    } catch (error) {
      console.error('Error fetching recent audit activities:', error)
      return []
    }
  }
}

export const auditApi = new AuditApiService()
