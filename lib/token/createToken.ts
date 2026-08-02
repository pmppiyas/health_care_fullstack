import jwt from "jsonwebtoken"
import { ENV } from "@/config/env.config"
import { AuthUser } from "@/interfaces/auth.interface"

export const createAccessToken = (payload: AuthUser): string => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
    },
    ENV.JWT_ACCESS_TOKEN as jwt.Secret,
    {
      expiresIn: ENV.JWT_ACCESS_EXPIRED,
    }
  )
}
