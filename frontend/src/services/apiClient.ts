import axios from 'axios'

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
    const token = localStorage.getItem('access_token')
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
      originalRequest._retry = true
      
      // Only try to refresh if we have a token
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          // Try to refresh the token
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          if (refreshResponse.data.access_token) {
            // Update the token
            localStorage.setItem('access_token', refreshResponse.data.access_token)
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_data')
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            window.location.href = '/'
          }
        }
      } else {
        // No token, redirect to login
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient 