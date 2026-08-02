import { ENV } from "@/config/env.config"
import bcrypt from "bcrypt"

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(ENV.SALT_ROUND)

  return bcrypt.hash(password, salt)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword)
}
