import axios from 'axios'

// Types
interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  access_token: string
  user: {
    id: number
    username: string
    email: string
    name: string
    employeeId: string
  }
}

interface ProfileResponse {
  success: boolean
  data: {
    id: number
    username: string
    email: string
    name: string
    employeeId: string
    employee: {
      id: number
      firstName: string
      lastName: string
      email: string
      employeeId: string
      phone?: string
      dateOfBirth?: string
      address?: string
      status: string
    }
    roles: string[]
    lastLogin: string
    createdAt: string
    updatedAt: string
  }
}

interface RefreshTokenResponse {
  success: boolean
  access_token: string
  expires_in: number
}

class AuthService {
  private readonly API_BASE_URL = 'http://localhost:3000/api'
  private readonly TOKEN_KEY = 'access_token'
  private readonly USER_KEY = 'user_data'
  private readonly REFRESH_INTERVAL = 14 * 60 * 1000 // 14 minutes (1 minute before expiry)
  private refreshTimer: number | null = null

  constructor() {
    // Set up axios interceptors for automatic token handling
    this.setupAxiosInterceptors()
    
    // Start token refresh timer if user is logged in
    if (this.isAuthenticated()) {
      this.startTokenRefresh()
    }
  }

  /**
   * Login user with username/email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials)
      
      if (response.data.success) {
        // Store token and user data
        this.setToken(response.data.access_token)
        this.setUserData(response.data.user)
        
        // Start automatic token refresh
        this.startTokenRefresh()
      }
      
      return response.data
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  /**
   * Logout user and clear all stored data
   */
  logout(): void {
    // Clear stored data
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    
    // Stop token refresh
    this.stopTokenRefresh()
    
    // Redirect to login page only if not already there
    if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
      window.location.href = '/'
    }
  }

  /**
   * Get current user profile from server
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axios.get<ProfileResponse>(`${this.API_BASE_URL}/auth/profile`)
      return response.data
    } catch (error: any) {
      console.error('Profile fetch error:', error)
      if (error.response?.status === 401) {
        this.logout()
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch profile')
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await axios.post<RefreshTokenResponse>(`${this.API_BASE_URL}/auth/refresh`)
      
      if (response.data.success) {
        this.setToken(response.data.access_token)
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Token refresh error:', error)
      // Only logout if it's a 401 error (unauthorized), not for network errors
      if (error.response?.status === 401) {
        this.logout()
      }
      return false
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Get stored user data
   */
  getUserData(): any {
    const userData = localStorage.getItem(this.USER_KEY)
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Get current user ID
   */
  getUserId(): number | null {
    const userData = this.getUserData()
    return userData?.id || null
  }

  /**
   * Set access token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * Set user data in localStorage
   */
  private setUserData(userData: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData))
  }

  /**
   * Start automatic token refresh timer
   */
  private startTokenRefresh(): void {
    // Clear existing timer
    this.stopTokenRefresh()
    
    // Set up new timer
    this.refreshTimer = setInterval(async () => {
      await this.refreshToken()
    }, this.REFRESH_INTERVAL)
  }

  /**
   * Stop automatic token refresh timer
   */
  private stopTokenRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * Setup axios interceptors for automatic token handling
   */
  private setupAxiosInterceptors(): void {
    // Request interceptor - add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle 401 errors
    axios.interceptors.response.use(
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
          if (this.getToken()) {
            const refreshSuccess = await this.refreshToken()
            
            if (refreshSuccess) {
              // Retry original request with new token
              const token = this.getToken()
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axios(originalRequest)
            }
          }
          
          // If we reach here, either no token or refresh failed
          // Only logout if we're not already on login page
          if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            this.logout()
          }
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role: string): Promise<boolean> {
    try {
      const profile = await this.getProfile()
      return profile.data.roles.includes(role)
    } catch (error) {
      return false
    }
  }

  /**
   * Check if user has any of the specified roles
   */
  async hasAnyRole(roles: string[]): Promise<boolean> {
    try {
      const profile = await this.getProfile()
      return roles.some(role => profile.data.roles.includes(role))
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService 