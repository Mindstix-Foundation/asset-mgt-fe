import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResult {
  success: boolean
  error?: string
  user?: any
}

const API_BASE_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      console.log('Attempting login with backend API...')
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { 
          success: false, 
          error: errorData.message || `Server error: ${response.status}` 
        }
      }

      const data = await response.json()
      
      if (data.success && data.access_token) {
        user.value = data.user
        isAuthenticated.value = true
        token.value = data.access_token
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_token', token.value!)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        console.log('Login successful:', data.user)
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
          error: 'Unable to connect to server. Please make sure the backend is running on http://localhost:3000/api' 
        }
      }
      
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    token.value = null
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
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