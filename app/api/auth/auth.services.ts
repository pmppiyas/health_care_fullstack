import { StatusCodes } from "http-status-codes"
import User from "@/app/api/user/user.model"
import { comparePassword } from "@/lib/auth/password"
import { LoginInput } from "@/app/api/auth/auth.validation"
import { AppError } from "@/lib/error/AppError"
import { UserStatus } from "@/app/api/user/user.interface"
import { createAccessToken } from "@/lib/token/createToken"

const loginUser = async (data: LoginInput) => {
  const user = await User.findOne({
    email: data.email,
  }).select("+password")

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password")
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account is not active")
  }

  const isPasswordMatched = await comparePassword(data.password, user.password)

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password")
  }

  const accessToken = createAccessToken({
    userId: user._id.toString(),
    role: user.role,
  })

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export const AuthService = {
  loginUser,
}
