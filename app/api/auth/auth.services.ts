import { StatusCodes } from "http-status-codes"
import User from "@/app/api/user/user.model"
import { comparePassword } from "@/lib/auth/password"
import { LoginInput } from "@/app/api/auth/auth.validation"
import { AppError } from "@/lib/error/AppError"
import { UserStatus } from "@/app/api/user/user.interface"
import { createAccessToken } from "@/lib/token/createToken"
import { AuthUser } from "@/interfaces/auth.interface"

const loginUser = async (data: LoginInput) => {
  const user = await User.findOne({
    email: data.email,
  }).select("+password")

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not found")
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account is not active")
  }

  const isPasswordMatched = await comparePassword(data.password, user.password)

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Password is Incorrect")
  }

  const accessToken = createAccessToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  })

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl ?? null,
    },
  }
}

const getMe = async (authUser: AuthUser) => {
  const user = await User.findById(authUser.id).select(
    "name email role photoUrl status"
  )

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found")
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account is not active")
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl ?? null,
  }
}

export const AuthService = {
  loginUser,
  getMe,
}
