import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface User {
  id: number
  username: string
  employeeId: number
  roles: string[]
}

export interface LoginResponse {
  access_token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  // Actions
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials)
      const { access_token, user: userData } = response.data
      
      user.value = userData
      token.value = access_token
      isAuthenticated.value = true
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_token', access_token)
      
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    
    // Clear localStorage
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  const initializeAuth = async () => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        
        // Validate token with backend
        const response = await api.get('/auth/validate')
        
        if (response.data.valid) {
          user.value = userData
          token.value = storedToken
          isAuthenticated.value = true
        } else {
          // Token is invalid, clear stored data
          logout()
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        // Clear invalid stored data
        logout()
      }
    }
  }

  // Getters
  const getUser = () => user.value
  const getToken = () => token.value
  const getUsername = () => user.value?.username || null
  const getUserRoles = () => user.value?.roles || []
  const hasRole = (role: string) => user.value?.roles?.includes(role) || false

  return {
    // State
    user,
    token,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    initializeAuth,
    
    // Getters
    getUser,
    getToken,
    getUsername,
    getUserRoles,
    hasRole
  }
}) 