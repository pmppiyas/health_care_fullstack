import jwt, { SignOptions } from "jsonwebtoken"
import { ENV } from "@/config/env.config"
import { AuthUser } from "@/interfaces/auth.interface"

export const createAccessToken = (payload: AuthUser): string => {
  const options: SignOptions = {
    expiresIn: ENV.JWT_ACCESS_EXPIRED as SignOptions["expiresIn"],
  }

  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    },
    ENV.JWT_ACCESS_TOKEN,
    options
  )
}
