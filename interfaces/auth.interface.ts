import { Role } from "@/app/api/user/user.interface"

export interface AuthUser {
  id: string
  role: Role
  email: string
}
