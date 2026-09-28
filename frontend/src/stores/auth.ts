import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/core/authService'

export interface LoginResult {
  success: boolean
  error?: string
  user?: any
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)

  /**
   * Handle auth expired event from API interceptor
   * Redirects to login page while preserving the current path
   */
  const handleAuthExpired = () => {
    // Check if we should prevent auth expired redirect (e.g., during login forms)
    if ((globalThis as any).preventAuthExpiredRedirect) {
      return
    }
    
    // Clear authentication state
    user.value = null
    isAuthenticated.value = false
    token.value = null
    
    // Get current path to redirect back after login
    const currentPath = globalThis.window.location.pathname
    
    // Only redirect if not already on a public route
    if (!['/', '/login'].includes(currentPath)) {
      router.push({
        path: '/',
        query: { redirect: currentPath },
      })
    }
  }

  // Listen for auth expiration events from API interceptor
  if (typeof globalThis !== 'undefined') {
    globalThis.window.addEventListener('auth:expired', handleAuthExpired)
  }

  const activateGoogleSession = async (): Promise<LoginResult> => {
    try {
      const profileUser = await authService.activateSessionFromProfile()
      user.value = profileUser
      isAuthenticated.value = true
      token.value = null
      return { success: true, user: profileUser }
    } catch (error) {
      console.error('Google session activate error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error:
            'Unable to connect to server. Please make sure the backend is running on http://localhost:3000',
        }
      }
      const message = error instanceof Error ? error.message : undefined
      return {
        success: false,
        error: message || 'Google login failed. Please try again.',
      }
    }
  }

  const loginWithGoogle = async (
    credential: string,
    rememberMe: boolean = false,
  ): Promise<LoginResult> => {
    try {
      const data = await authService.loginWithGoogle({
        credential,
        remember_me: rememberMe,
      })
      if (data.success && data.user) {
        user.value = data.user
        isAuthenticated.value = true
        token.value = data.access_token ?? null
        return { success: true, user: data.user }
      }
      return { success: false, error: 'Invalid response from server' }
    } catch (error) {
      console.error('Google login error:', error)
      const message = error instanceof Error ? error.message : undefined
      return {
        success: false,
        error: message || 'Google login failed. Please try again.',
      }
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    token.value = null
    
    // Use authService for consistent logout
    authService.logout()
  }

  const checkAuthStatus = () => {
    // Use authService to check authentication status
    if (authService.isAuthenticated()) {
      const userData = authService.getUserData()
      
      if (userData) {
        user.value = userData
        // Token is in HTTP-only cookies now, no need to store it
        token.value = null
        isAuthenticated.value = true
      } else {
        user.value = null
        token.value = null
        isAuthenticated.value = false
      }
    } else {
      user.value = null
      token.value = null
      isAuthenticated.value = false
    }
  }

  const getUsername = () => {
    return user.value?.name || user.value?.email || null
  }

  return {
    user,
    isAuthenticated,
    token,
    activateGoogleSession,
    loginWithGoogle,
    logout,
    checkAuthStatus,
    getUsername
  }
})
