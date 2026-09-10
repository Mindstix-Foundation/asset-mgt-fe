export interface AuthUser {
  id: number
  email: string
  name: string
  employeeId: string
  roles?: string[]
}

export interface GoogleLoginRequest {
  credential: string
  remember_me?: boolean
}

export interface GoogleCodeLoginRequest {
  code: string
  redirect_uri: string
  remember_me?: boolean
}
