import { StatusCodes } from "http-status-codes"
import { LoginInput } from "./auth.validation"
import { sendResponse } from "@/lib/utils/sendResponse"
import { AuthService } from "@/app/api/auth/auth.services"
import { AuthUser } from "@/interfaces/auth.interface"

const loginUser = async (data: LoginInput) => {
  const result = await AuthService.loginUser(data)

  const response = sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
    },
  })

  response.cookies.set("access-token", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  })

  return response
}

const getMe = async (authUser: AuthUser) => {
  const user = await AuthService.getMe(authUser)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  })
}

const logoutUser = async () => {
  const response = sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logout successful",
  })

  response.cookies.set("access-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })

  return response
}

export const AuthController = {
  loginUser,
  getMe,
  logoutUser,
}
