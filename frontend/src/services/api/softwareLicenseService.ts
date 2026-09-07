import { apiService, type ApiResponse } from '../core/apiClient'

export type LicenseExpiryStatus = 'active' | 'expiring' | 'expired'

export interface LicenseAssignee {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  designation?: { id: number; name: string } | null
}

export interface SoftwareLicense {
  id: number
  name: string
  vendorName?: string | null
  licenseKey?: string | null
  seats?: number | null
  purchaseDate?: string | null
  purchaseCost?: number | null
  startDate?: string | null
  expiryDate: string
  assignedToId: number
  assignedTo?: LicenseAssignee
  notes?: string | null
  isActive: boolean
  daysUntilExpiry?: number
  expiryStatus?: LicenseExpiryStatus
  createdAt?: string
  updatedAt?: string
}

export interface CreateSoftwareLicensePayload {
  name: string
  assignedToId: number
  vendorName?: string
  licenseKey?: string
  seats?: number
  purchaseDate?: string
  purchaseCost?: number
  startDate?: string
  expiryDate: string
  notes?: string
  isActive?: boolean
}

export type UpdateSoftwareLicensePayload = Partial<CreateSoftwareLicensePayload>

export interface SoftwareLicenseQuery {
  page?: number
  limit?: number
  search?: string
  status?: LicenseExpiryStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

class SoftwareLicenseService {
  private readonly baseUrl = '/software-licenses'

  async getLicenses(params: SoftwareLicenseQuery = {}) {
    const query = new URLSearchParams()
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))
    if (params.search) query.append('search', params.search)
    if (params.status) query.append('status', params.status)
    if (params.sortBy) query.append('sortBy', params.sortBy)
    if (params.sortOrder) query.append('sortOrder', params.sortOrder)

    const qs = query.toString()
    const response: ApiResponse<{
      licenses: SoftwareLicense[]
      pagination: {
        totalCount: number
        currentPage: number
        totalPages: number
        hasNext: boolean
        hasPrevious: boolean
      }
    }> = await apiService.get(`${this.baseUrl}${qs ? `?${qs}` : ''}`)

    return response.data
  }

  async createLicense(payload: CreateSoftwareLicensePayload) {
    const response: ApiResponse<{ license: SoftwareLicense }> =
      await apiService.post(this.baseUrl, payload)
    return response.data
  }

  async updateLicense(id: number, payload: UpdateSoftwareLicensePayload) {
    const response: ApiResponse<{ license: SoftwareLicense }> =
      await apiService.patch(`${this.baseUrl}/${id}`, payload)
    return response.data
  }

  async deleteLicense(id: number) {
    return apiService.delete(`${this.baseUrl}/${id}`)
  }
}

export const softwareLicenseService = new SoftwareLicenseService()
