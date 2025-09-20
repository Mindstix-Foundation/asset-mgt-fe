// Asset management types

export interface Asset {
  id: string
  assetId: string
  serialNumber: string
  brand: string
  model: string
  category: AssetCategory
  specifications: AssetSpecifications
  purchaseDate?: string
  warrantyEndDate?: string
  status: AssetStatus
  assignedTo?: string
  assignedDate?: string
  location?: string
  qrCode?: string
  createdAt: string
  updatedAt: string
}

export type AssetCategory = 'laptop' | 'monitor' | 'mobile' | 'tablet' | 'ipad' | 'accessories'

export type AssetStatus = 'available' | 'assigned' | 'under_maintenance' | 'retired' | 'lost'

export interface AssetSpecifications {
  ram?: string
  storage?: string
  processor?: string
  operatingSystem?: string
  screenSize?: string
  other?: Record<string, string>
}

export interface AssetAssignment {
  id: string
  assetId: string
  employeeId: string
  assignedDate: string
  returnDate?: string
  notes?: string
  status: 'active' | 'returned'
}

export interface AssetHistory {
  id: string
  assetId: string
  action: 'assigned' | 'returned' | 'repaired' | 'retired'
  performedBy: string
  performedAt: string
  details: string
} 