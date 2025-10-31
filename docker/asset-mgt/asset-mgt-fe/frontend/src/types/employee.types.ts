// Employee management types

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  position?: string
  department?: string
  location?: string
  joinDate?: string
  status: EmployeeStatus
  assignedAssets: string[]
  createdAt: string
  updatedAt: string
}

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'maternity_leave' | 'sabbatical_leave' | 'terminated'

export interface EmployeeAssetHistory {
  id: string
  employeeId: string
  assetId: string
  assignedDate: string
  returnDate?: string
  status: 'active' | 'returned'
} 