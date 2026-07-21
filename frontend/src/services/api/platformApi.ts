import apiClient from '@/services/core/apiClient'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export interface TenantStats {
  users: number
  employees: number
  assets: number
}

export interface PlatformTenant {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  stats?: TenantStats
}

export interface CreateTenantPayload {
  name: string
  isActive?: boolean
  admin?: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }
}

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface OrganizationRegistration {
  id: number
  organizationName: string
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  adminUsername: string
  phone?: string | null
  message?: string | null
  status: RegistrationStatus
  rejectionReason?: string | null
  reviewedBy?: number | null
  reviewedAt?: string | null
  tenantId?: number | null
  createdAt: string
  updatedAt: string
}

export interface SubmitRegistrationPayload {
  organizationName: string
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  adminUsername: string
  adminPassword: string
  phone?: string
  message?: string
}

class PlatformService {
  async listTenants(): Promise<PlatformTenant[]> {
    const { data } = await apiClient.get('/platform/tenants')
    return data.data ?? []
  }

  async createTenant(payload: CreateTenantPayload) {
    const { data } = await apiClient.post('/platform/tenants', payload)
    return data
  }

  async updateTenantStatus(id: number, isActive: boolean) {
    const { data } = await apiClient.patch(`/platform/tenants/${id}/status`, {
      isActive,
    })
    return data
  }

  /** Public — no auth cookie required */
  async submitRegistration(payload: SubmitRegistrationPayload) {
    const { data } = await axios.post(
      `${API_BASE}/platform/registrations`,
      payload,
      { headers: { 'Content-Type': 'application/json' } },
    )
    return data
  }

  async listRegistrations(status?: RegistrationStatus): Promise<OrganizationRegistration[]> {
    const { data } = await apiClient.get('/platform/registrations', {
      params: status ? { status } : undefined,
    })
    return data.data ?? []
  }

  async approveRegistration(id: number) {
    const { data } = await apiClient.post(`/platform/registrations/${id}/approve`)
    return data
  }

  async rejectRegistration(id: number, reason?: string) {
    const { data } = await apiClient.post(`/platform/registrations/${id}/reject`, {
      reason,
    })
    return data
  }
}

export default new PlatformService()
