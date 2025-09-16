// Maintenance management types

export interface MaintenanceRequest {
  id: string
  assetId: string
  requestedBy: string
  requestedAt: string
  issueDescription: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  assignedVendor?: string
  estimatedCost?: number
  actualCost?: number
  startDate?: string
  completionDate?: string
  notes?: string
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical'

export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface MaintenanceSchedule {
  id: string
  assetId: string
  scheduledDate: string
  type: 'preventive' | 'corrective'
  description: string
  assignedVendor: string
  status: 'scheduled' | 'completed' | 'overdue'
} 