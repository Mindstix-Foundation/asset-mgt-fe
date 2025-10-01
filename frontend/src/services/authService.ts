import axios from 'axios'

// Create a separate axios instance for auth operations (no interceptors to avoid circular dependency)
const authAxios = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to authAxios for token inclusion (for refresh and profile calls)
authAxios.interceptors.request.use((config) => {
  // Add token for refresh and profile endpoints
  if (config.url?.includes('/auth/refresh') || config.url?.includes('/auth/profile')) {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

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
  private readonly TOKEN_KEY = 'access_token'
  private readonly USER_KEY = 'user_data'
  private readonly TOKEN_TIMESTAMP_KEY = 'token_timestamp'
  private readonly REFRESH_INTERVAL = 12 * 60 * 1000 // 12 minutes (3 minutes before expiry)
  private readonly TOKEN_EXPIRY_TIME = 15 * 60 * 1000 // 15 minutes
  private refreshTimer: number | null = null
  private refreshPromise: Promise<boolean> | null = null

  constructor() {
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
      const response = await authAxios.post<LoginResponse>('/auth/login', credentials)
      
      if (response.data.success) {
        // Store token and user data with timestamp
        this.setToken(response.data.access_token)
        this.setUserData(response.data.user)
        this.setTokenTimestamp()
        
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
    localStorage.removeItem(this.TOKEN_TIMESTAMP_KEY)
    
    // Stop token refresh and clear refresh promise
    this.stopTokenRefresh()
    this.refreshPromise = null
    
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
      const response = await authAxios.get<ProfileResponse>('/auth/profile')
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
   * Refresh access token (with promise caching to prevent multiple simultaneous requests)
   */
  async refreshToken(): Promise<boolean> {
    // If a refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Create and cache the refresh promise
    this.refreshPromise = this.performTokenRefresh()
    
    try {
      const result = await this.refreshPromise
      return result
    } finally {
      // Clear the promise after completion (success or failure)
      this.refreshPromise = null
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<boolean> {
    try {
      console.log('[AuthService] Refreshing token...')
      const response = await authAxios.post<RefreshTokenResponse>('/auth/refresh')
      
      if (response.data.success) {
        this.setToken(response.data.access_token)
        this.setTokenTimestamp()
        console.log('[AuthService] Token refreshed successfully')
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
   * Check if user is authenticated and token is not expired
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    // Check if token is expired
    const timestamp = this.getTokenTimestamp()
    if (timestamp) {
      const now = Date.now()
      const tokenAge = now - timestamp
      
      // If token is older than expiry time, consider it expired
      if (tokenAge >= this.TOKEN_EXPIRY_TIME) {
        console.log('[AuthService] Token expired, clearing auth data')
        this.logout()
        return false
      }
    }

    return true
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
   * Set token timestamp in localStorage
   */
  private setTokenTimestamp(): void {
    localStorage.setItem(this.TOKEN_TIMESTAMP_KEY, Date.now().toString())
  }

  /**
   * Get token timestamp from localStorage
   */
  private getTokenTimestamp(): number | null {
    const timestamp = localStorage.getItem(this.TOKEN_TIMESTAMP_KEY)
    return timestamp ? parseInt(timestamp, 10) : null
  }

  /**
   * Start automatic token refresh timer
   */
  private startTokenRefresh(): void {
    // Clear existing timer
    this.stopTokenRefresh()
    
    // Calculate when to start refreshing based on token timestamp
    const timestamp = this.getTokenTimestamp()
    let refreshDelay = this.REFRESH_INTERVAL
    
    if (timestamp) {
      const tokenAge = Date.now() - timestamp
      const timeUntilRefresh = this.REFRESH_INTERVAL - tokenAge
      
      // If we're already past the refresh time, refresh immediately
      if (timeUntilRefresh <= 0) {
        console.log('[AuthService] Token needs immediate refresh')
        this.refreshToken()
        refreshDelay = this.REFRESH_INTERVAL
      } else {
        // Set timer for the remaining time until refresh
        refreshDelay = timeUntilRefresh
        console.log(`[AuthService] Next token refresh in ${Math.round(refreshDelay / 1000)} seconds`)
      }
    }
    
    // Set up new timer
    this.refreshTimer = setInterval(async () => {
      await this.refreshToken()
    }, refreshDelay) as unknown as number
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