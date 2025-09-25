// Base API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export interface ApiResponse<T> {
  message: string
  data: T
}

export interface ApiError {
  message: string
  error: string
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  getBaseURL(): string {
    return this.baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      let details
      try { details = await response.json() } catch (_) {}
      throw { status: response.status, ...(details || {}) }
    }

    // Some endpoints might return no content
    if (response.status === 204) return {} as T

    return response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) })

  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) })
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) })
  }

  delete<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined })
  }

  delete<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined })
  }
}

export const apiService = new ApiService()

// Lightweight stats client
export interface DashboardStats {
  totalAssets: number
  available: number
  assigned: number
  maintenance: number
}

export const apiService = new ApiService()

// Lightweight stats client
export interface DashboardStats {
  totalAssets: number
  available: number
  assigned: number
  maintenance: number
}

export const fetchDashboardStats = () => apiService.get<ApiResponse<DashboardStats>>('/dashboard/stats') 