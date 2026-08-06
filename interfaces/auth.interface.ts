import { Role } from "@/app/api/user/user.interface"

export interface AuthUser {
  id: string
  role: Role
  email: string
}

export interface AuthUserProfile extends AuthUser {
  name: string
  photoUrl?: string | null
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message: string
  data: {
    user: AuthUserProfile
  }
}

export type GetMeResponse = {
  success: boolean
  message: string
  data: AuthUserProfile
}

export type LogoutResponse = {
  success: boolean
  message: string
}
