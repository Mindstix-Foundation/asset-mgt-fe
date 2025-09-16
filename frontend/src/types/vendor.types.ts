// Vendor management types

export interface Vendor {
  id: string
  vendorId: string
  name: string
  type: VendorType
  contactPerson: string
  email: string
  phone: string
  address: string
  taxId?: string
  gstNumber?: string
  panNumber?: string
  status: VendorStatus
  services: string[]
  createdAt: string
  updatedAt: string
}

export type VendorType = 'supplier' | 'service_provider' | 'both'

export type VendorStatus = 'active' | 'inactive' | 'blacklisted'

export interface VendorContract {
  id: string
  vendorId: string
  contractNumber: string
  startDate: string
  endDate: string
  value: number
  status: 'active' | 'expired' | 'terminated'
} 