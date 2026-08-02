import { Role } from "@/app/api/user/user.interface"

export interface AuthUser {
  userId: string
  role: Role
  email: string
}
