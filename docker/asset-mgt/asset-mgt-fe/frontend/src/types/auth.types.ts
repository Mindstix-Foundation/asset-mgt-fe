// Authentication related types

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'hr' | 'employee'
  permissions: string[]
  token: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
} 