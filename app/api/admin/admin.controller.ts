import { NextRequest } from "next/server"
import { CreateAdminInput, UpdateAdminInput, GrantPermissionInput } from "./admin.validation"
import { sendResponse } from "@/lib/utils/sendResponse"
import { AdminService } from "./admin.services"
import { StatusCodes } from "http-status-codes"
import { AuthUser } from "@/interfaces/auth.interface"

const createAdmin = async (data: CreateAdminInput, user: AuthUser) => {
  const admin = await AdminService.createAdmin(data, user)

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Admin created successfully",
    data: admin,
  })
}

const getAllAdmins = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const query = Object.fromEntries(searchParams.entries())

  const result = await AdminService.getAllAdmins(query)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admins retrieved successfully",
    data: result.admins,
    meta: result.meta,
  })
}

const getAdminById = async (req: NextRequest, adminId: string) => {
  const admin = await AdminService.getAdminById(adminId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: admin,
  })
}

const updateAdmin = async (
  adminId: string,
  data: UpdateAdminInput,
  user: AuthUser,
) => {
  const admin = await AdminService.updateAdmin(adminId, data)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin updated successfully",
    data: admin,
  })
}

const deleteAdmin = async (req: NextRequest, adminId: string) => {
  await AdminService.deleteAdmin(adminId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted successfully",
  })
}

const grantPermission = async (
  adminId: string,
  data: GrantPermissionInput,
  user: AuthUser,
) => {
  const admin = await AdminService.grantPermission(adminId, data)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Permission granted successfully",
    data: admin,
  })
}

const revokePermission = async (
  adminId: string,
  data: GrantPermissionInput,
  user: AuthUser,
) => {
  const admin = await AdminService.revokePermission(adminId, data)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Permission revoked successfully",
    data: admin,
  })
}

export const AdminController = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  grantPermission,
  revokePermission,
}
