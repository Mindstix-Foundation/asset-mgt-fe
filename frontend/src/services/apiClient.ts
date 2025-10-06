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

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip retry for auth endpoints to avoid infinite loops
    if (originalRequest.url?.includes('/auth/')) {
      throw error
    }

    // On 401, attempt token refresh (cookies handle authentication automatically)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[ApiClient] 401 error detected, attempting token refresh')
      originalRequest._retry = true
      
      const refreshSuccess = await authService.refreshToken()
      
      if (refreshSuccess) {
        console.log('[ApiClient] Token refresh successful, retrying original request')
        // New tokens are already in cookies - just retry the request
        // No need to set Authorization header - cookies are sent automatically
        return apiClient(originalRequest)
      } else {
        console.log('[ApiClient] Token refresh failed, logout will be triggered')
        // authService.refreshToken() already handles logout on failure
      }
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