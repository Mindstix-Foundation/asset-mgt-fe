// Authentication related types

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email?: string
  name?: string
  employeeId?: string
  tenantId?: number
  tenantName?: string
  isPlatform?: boolean
  roles?: string[]
}

/** Platform super-admin: SUPER_ADMIN role or explicit isPlatform flag */
export function isPlatformUser(user: Pick<AuthUser, 'roles' | 'isPlatform'> | null | undefined): boolean {
  if (!user) return false
  if (user.isPlatform === true) return true
  return (user.roles ?? []).includes('SUPER_ADMIN')
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
}
