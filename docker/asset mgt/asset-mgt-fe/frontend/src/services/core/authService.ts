import axios from 'axios'

// Create a separate axios instance for auth operations with cookie support
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // Enable sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Generate browser fingerprint for additional security
const generateFingerprint = (): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('fingerprint', 2, 2)
  }
  
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|')
  
  // Simple hash function using codePointAt for proper unicode support
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.codePointAt(i) ?? 0
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

// Add fingerprint to all requests
authAxios.interceptors.request.use(
  (config) => {
    config.headers['X-Fingerprint'] = generateFingerprint()
    return config
  },
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
)

// No Authorization header needed - cookies are sent automatically

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
  private readonly USER_KEY = 'user_data' // Keep user data in localStorage for quick access
  private readonly REFRESH_INTERVAL = 12 * 60 * 1000 // 12 minutes (3 minutes before expiry)
  private refreshTimer: number | null = null
  private refreshPromise: Promise<boolean> | null = null
  private isAuthenticatedCache: boolean = false

  constructor() {
    // Check if user data exists to determine auth status
    this.isAuthenticatedCache = !!this.getUserData()
    if (this.isAuthenticatedCache) {
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
        // Store only user data (tokens are in HTTP-only cookies now)
        this.setUserData(response.data.user)
        this.isAuthenticatedCache = true
        
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
  async logout(): Promise<void> {
    try {
      // Call backend logout to clear cookies and invalidate session
      await authAxios.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear stored user data (cookies cleared by server)
      localStorage.removeItem(this.USER_KEY)
      this.isAuthenticatedCache = false
      
      // Stop token refresh and clear refresh promise
      this.stopTokenRefresh()
      this.refreshPromise = null
      
      // Redirect to login page only if not already there
      if (
        typeof globalThis !== 'undefined' &&
        globalThis.location &&
        globalThis.location.pathname !== '/' &&
        globalThis.location.pathname !== '/login'
      ) {
        globalThis.location.href = '/'
      }
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
        await this.logout()
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
      // No need to send refresh_token - it's in HTTP-only cookie
      const response = await authAxios.post<RefreshTokenResponse>('/auth/refresh')
      
      if (response.data.success) {
        // New tokens set in cookies by server automatically
        console.log('[AuthService] Token refreshed successfully:', new Date().toISOString())
        return true
      }
      
      console.log('[AuthService] Token refresh failed: response not successful')
      return false
    } catch (error: any) {
      console.error('[AuthService] Token refresh error:', error)
      // Only logout if it's a 401 error (unauthorized), not for network errors
      if (error.response?.status === 401) {
        console.log('[AuthService] 401 error during refresh, logging out')
        await this.logout()
      }
      return false
    }
  }

  /**
   * Check if user is authenticated (client-side check)
   * With HTTP-only cookies, we can't check token directly
   * We rely on user data presence and let server validate on each request
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedCache && !!this.getUserData()
  }

  /**
   * Verify authentication with server (server-side validation)
   * Use this for critical operations that need real-time verification
   */
  async verifyAuthentication(): Promise<boolean> {
    try {
      await this.getProfile()
      this.isAuthenticatedCache = true
      return true
    } catch (error) {
      // Expected: getProfile() throws when authentication fails
      // We catch this to return false instead of propagating the error
      console.debug('[AuthService] Authentication verification failed:', error)
      this.isAuthenticatedCache = false
      return false
    }
  }

  /**
   * Get stored access token (deprecated - tokens in HTTP-only cookies now)
   * @deprecated Tokens are now in HTTP-only cookies and not accessible
   */
  getToken(): string | null {
    console.warn('[AuthService] getToken() deprecated - tokens now in HTTP-only cookies')
    return null
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
    
    console.log('[AuthService] Starting token refresh interval')
    
    // Set up regular refresh interval (cookies don't expose expiry time)
    // Refresh every 12 minutes (3 minutes before 15-minute expiry)
    this.refreshTimer = setInterval(async () => {
      await this.refreshToken()
    }, this.REFRESH_INTERVAL) as unknown as number
  }

  /**
   * Stop automatic token refresh timer
   */
  private stopTokenRefresh(): void {
    if (this.refreshTimer) {
      // Clear both setTimeout and setInterval
      clearTimeout(this.refreshTimer)
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
    } catch (error: any) {
      console.error('[AuthService] hasRole error:', error)
      if (error?.response?.status === 401) {
        await this.logout()
      }
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
    } catch (error: any) {
      console.error('[AuthService] hasAnyRole error:', error)
      if (error?.response?.status === 401) {
        await this.logout()
      }
      return false
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export { authAxios }
export default authService 