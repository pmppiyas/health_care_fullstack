import { NextRequest } from "next/server"
import { UpdateUserInput, UpdateUserStatusInput } from "./user.validation"
import { sendResponse } from "@/lib/utils/sendResponse"
import { UserService } from "./user.services"
import { StatusCodes } from "http-status-codes"
import { AuthUser } from "@/interfaces/auth.interface"

const getAllUsers = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const query = Object.fromEntries(searchParams.entries())

  const result = await UserService.getAllUsers(query)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.meta,
  })
}

const getUserById = async (req: NextRequest, userId: string) => {
  const user = await UserService.getUserById(userId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User retrieved successfully",
    data: user,
  })
}

const updateUser = async (
  userId: string,
  data: UpdateUserInput,
  user: AuthUser
) => {
  const updated = await UserService.updateUser(userId, data)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User updated successfully",
    data: updated,
  })
}

const deleteUser = async (req: NextRequest, userId: string) => {
  await UserService.deleteUser(userId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully",
  })
}

const updateUserStatus = async (
  userId: string,
  data: UpdateUserStatusInput,
  user: AuthUser
) => {
  const updated = await UserService.updateUserStatus(userId, data.status)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User status updated successfully",
    data: updated,
  })
}

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
}
