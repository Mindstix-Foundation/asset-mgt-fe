import axios from 'axios'
import { authService } from './authService'

// Create a unified API client instance with cookie support
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - cookies are sent automatically via withCredentials
// No need to manually add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are automatically included with withCredentials: true
    // Authorization header removed - cookies handle authentication
    return config
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  }
)

// Add debounce for auth expired events to prevent multiple rapid redirects
let authExpiredTimeout: number | null = null

// Helper: Check if redirect should be prevented
const shouldPreventRedirect = (): boolean => {
  return (typeof globalThis !== 'undefined') && (globalThis as any).preventAuthExpiredRedirect === true
}

// Helper: Check if request is to auth endpoint
const isAuthEndpoint = (url?: string): boolean => {
  return url?.includes('/auth/') ?? false
}

// Helper: Check if user is on a login/auth page
const isOnAuthPage = (): boolean => {
  if (globalThis.window === undefined) return false
  const authPages = ['/', '/login']
  return authPages.includes(globalThis.window.location.pathname)
}

// Helper: Dispatch auth expired event with debounce
const dispatchAuthExpired = (): void => {
  if (authExpiredTimeout !== null) {
    clearTimeout(authExpiredTimeout)
    authExpiredTimeout = null
  }
  
  authExpiredTimeout = globalThis.window.setTimeout(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.localStorage.removeItem('user_data')
      globalThis.window.dispatchEvent(new CustomEvent('auth:expired'))
      authExpiredTimeout = null
    }
  }, 100)
}

// Helper: Check if request should be retried
const shouldRetryRequest = (originalRequest: any): boolean => {
  return !shouldPreventRedirect() && !isAuthEndpoint(originalRequest.url) && 
         !isOnAuthPage() && !originalRequest._retry
}

// Helper: Handle token refresh and retry
const handleTokenRefresh = async (originalRequest: any) => {
  originalRequest._retry = true
  
  const refreshSuccess = await authService.refreshToken()
  
  if (refreshSuccess) {
    return apiClient(originalRequest)
  }

  if (!shouldPreventRedirect() && !isAuthEndpoint(originalRequest.url) && !isOnAuthPage()) {
    dispatchAuthExpired()
  }
  
  return null
}

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors (skip refresh for auth endpoints)
    if (error.response?.status === 401 && shouldRetryRequest(originalRequest)) {
      const result = await handleTokenRefresh(originalRequest)
      if (result) return result
    }

    throw error
  }
)

// API Response interfaces
export interface ApiResponse<T> {
  message: string
  data: T
}

export interface ApiError {
  message: string
  error: string
}

// Unified API Service class with clean interface
class ApiService {
  private readonly client = apiClient

  getBaseURL(): string {
    return this.client.defaults.baseURL || ''
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint)
    return response.data
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, body)
    return response.data
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, body)
    return response.data
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, body)
    return response.data
  }

  async delete<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await this.client.delete<T>(endpoint, { data: body })
    return response.data
  }

  // Access to raw axios client for special cases (file uploads, etc.)
  getRawClient() {
    return this.client
  }
}

export const apiService = new ApiService()
export default apiClient 