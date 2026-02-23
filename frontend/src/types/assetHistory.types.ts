// Asset History Event Types
export enum AssetEventType {
  ASSET_CREATED = 'ASSET_CREATED',
  ASSET_UPDATED = 'ASSET_UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  CONDITION_CHANGED = 'CONDITION_CHANGED',
  LOCATION_CHANGED = 'LOCATION_CHANGED',
  LOCATION_UPDATED = 'LOCATION_UPDATED',
  ASSIGNED = 'ASSIGNED',
  RETURNED = 'RETURNED',
  MAINTENANCE_SCHEDULED = 'MAINTENANCE_SCHEDULED',
  MAINTENANCE_STARTED = 'MAINTENANCE_STARTED',
  MAINTENANCE_COMPLETED = 'MAINTENANCE_COMPLETED',
  MAINTENANCE_CANCELLED = 'MAINTENANCE_CANCELLED',
  RETIRED = 'RETIRED',
  REACTIVATED = 'REACTIVATED',
  WARRANTY_EXPIRED = 'WARRANTY_EXPIRED',
  WARRANTY_RENEWED = 'WARRANTY_RENEWED',
  WARRANTY_ACTIVE = 'WARRANTY_ACTIVE',
  QR_CODE_GENERATED = 'QR_CODE_GENERATED',
  IMAGE_UPLOADED = 'IMAGE_UPLOADED',
  SERIAL_NUMBER_UPDATED = 'SERIAL_NUMBER_UPDATED',
  PURCHASE_INFO_UPDATED = 'PURCHASE_INFO_UPDATED',
  VENDOR_CHANGED = 'VENDOR_CHANGED'
}

// Asset History Event Interface
export interface AssetHistoryEvent {
  id: string
  type: string
  date: string
  dateIST: string
  description: string
  userDisplayName?: string
  status?: string
  condition?: string
  details?: {
    // Maintenance details
    maintenanceType?: string
    scheduledDate?: string
    estimatedCost?: number
    actualCost?: number
    description?: string
    status?: string
    actualCompletionDate?: string
    cancellationDate?: string
    completionNotes?: string
    cancellationNotes?: string
    changes?: Array<{
      field: string
      change: string
    }>
    totalChanges?: number
    
    // Asset details
    serialNumber?: string
    purchaseCost?: number
    vendor?: string
    purchaseDate?: string
    retirementDate?: string
    reactivationDate?: string
    notes?: string
    
    // Assignment details
    employeeEmail?: string
    issueDate?: string
    returnDate?: string
    issueCondition?: string
    returnCondition?: string
    
    // Legacy fields for backward compatibility
    [key: string]: any
  }
  icon?: string
  color?: string
}

// Asset Basic Info Interface
export interface AssetBasicInfo {
  id: number
  assetId: string
  name: string
  currentStatus: string
  currentCondition: string
  location?: string
  serialNumber?: string
  assetType: string
  brand: string
  model: string
}

// Asset History Summary Interface
export interface AssetHistorySummary {
  totalEvents: number
  lastActivity: string
  currentStatus: string
  currentCondition: string
  totalAssignments: number
  totalMaintenance: number
  totalStatusChanges: number
  totalCost?: number
  avgAssignmentDuration?: string
  maintenanceFrequency?: string
  mostCommonStatus?: string
}

// Asset History Pagination Interface
export interface AssetHistoryPagination {
  currentPage: number
  totalPages: number
  totalEvents: number
  hasNext: boolean
  hasPrevious: boolean
  limit: number
}

// Asset History Filters Interface
export interface AssetHistoryFilters {
  eventTypes?: AssetEventType[]
  dateFrom?: string
  dateTo?: string
  search?: string
  userId?: number
  page?: number
  limit?: number
  sortBy?: 'date' | 'eventType'
  sortOrder?: 'asc' | 'desc'
}

// Asset History Response Interface
export interface AssetHistoryResponse {
  timestamp: string
  description: string
  asset: AssetBasicInfo
  timeline: AssetHistoryEvent[]
  pagination: AssetHistoryPagination
}

// Asset History Summary Response Interface
export interface AssetHistorySummaryResponse {
  timestamp: string
  description: string
  asset: AssetBasicInfo
  summary: AssetHistorySummary
  recentEvents: AssetHistoryEvent[]
  quickStats: {
    avgAssignmentDuration: string
    maintenanceFrequency: string
    mostCommonStatus: string
  }
}

// Event Detail Types for different event categories
export interface AssignmentEventDetails {
  employee?: string
  employeeId?: string
  reason?: string
  notes?: string
  condition?: string
}

export interface MaintenanceEventDetails {
  type?: string
  scheduledDate?: string
  vendor?: string
  estimatedCost?: number
  actualCost?: number
  status?: string
  description?: string
  completionNotes?: string
  cancellationReason?: string
  cancellationNotes?: string
}

export interface AssetCreationEventDetails {
  initialCondition?: string
  initialStatus?: string
  purchaseDate?: string
  purchaseCost?: number
  location?: string
  serialNumber?: string
  notes?: string
}

export interface StatusChangeEventDetails {
  fromStatus?: string
  toStatus?: string
  reason?: string
  notes?: string
}

export interface ConditionChangeEventDetails {
  fromCondition?: string
  toCondition?: string
  reason?: string
  notes?: string
}

// API Query Parameters Interface
export interface AssetHistoryQueryParams {
  page?: number
  limit?: number
  eventTypes?: AssetEventType[] | string
  dateFrom?: string
  dateTo?: string
  userId?: number
  search?: string
  sortBy?: string
  sortOrder?: string
}
