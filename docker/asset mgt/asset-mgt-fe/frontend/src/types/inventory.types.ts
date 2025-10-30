// Inventory management types

export interface InventoryItem {
  id: string
  assetId: string
  category: string
  brand: string
  model: string
  serialNumber: string
  status: InventoryStatus
  location: string
  stockLevel: number
  minStockLevel: number
  lastUpdated: string
}

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'reserved'

export interface StockMovement {
  id: string
  assetId: string
  type: 'in' | 'out' | 'transfer'
  quantity: number
  reason: string
  performedBy: string
  performedAt: string
} 