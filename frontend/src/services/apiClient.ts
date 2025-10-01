import axios from 'axios'
import { authService } from './authService'

// Create a unified API client instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip retry for auth endpoints to avoid infinite loops
    if (originalRequest.url?.includes('/auth/')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[ApiClient] 401 error detected, attempting token refresh')
      originalRequest._retry = true
      
      // Use the centralized auth service for token refresh
      if (authService.getToken()) {
        const refreshSuccess = await authService.refreshToken()
        
        if (refreshSuccess) {
          console.log('[ApiClient] Token refresh successful, retrying original request')
          // Retry the original request with new token
          const token = authService.getToken()
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        } else {
          console.log('[ApiClient] Token refresh failed')
        }
      } else {
        console.log('[ApiClient] No token available for refresh')
      }
      
      // If we reach here, either no token or refresh failed
      // The authService will handle logout if needed
    }

    return Promise.reject(error)
  }
)

export default apiClient 