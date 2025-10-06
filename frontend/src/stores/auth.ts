import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/services/core/authService'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResult {
  success: boolean
  error?: string
  user?: any
}

const API_BASE_URL = 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      // Use the authService for consistent authentication
      const data = await authService.login(credentials)
      
      if (data.success && data.access_token) {
        user.value = data.user
        isAuthenticated.value = true
        token.value = data.access_token
        return { success: true, user: data.user }
      } else {
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please make sure the backend is running on http://localhost:3000' 
        }
      }
      
      return { success: false, error: 'Login failed. Please try again.' }
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
    return user.value?.name || user.value?.username || null
  }

  return {
    user,
    isAuthenticated,
    token,
    login,
    logout,
    checkAuthStatus,
    getUsername
  }
}) 