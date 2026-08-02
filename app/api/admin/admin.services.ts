import { AppError } from "@/lib/error/AppError"
import Admin from "./admin.model"
import {
  CreateAdminInput,
  UpdateAdminInput,
  GrantPermissionInput,
} from "./admin.validation"
import { AuthUser } from "@/interfaces/auth.interface"
import { AdminPermission } from "./admin.interface"

const createAdmin = async (payload: CreateAdminInput, user: AuthUser) => {
  const existingAdmin = await Admin.findOne({
    $or: [{ userId: payload.userId }, { email: payload.email }],
  })

  if (existingAdmin) {
    throw new AppError(
      409,
      "An admin profile already exists for this user or email"
    )
  }

  const admin = await Admin.create(payload)
  return admin
}

const getAllAdmins = async (query: Record<string, string | undefined>) => {
  const { search, page = "1", limit = "10" } = query

  const pageNumber = Math.max(Number(page), 1)
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100)

  const filter: Record<string, unknown> = {}

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
    ]
  }

  const skip = (pageNumber - 1) * limitNumber

  const [admins, total] = await Promise.all([
    Admin.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Admin.countDocuments(filter),
  ])

  return {
    admins,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

const getAdminById = async (adminId: string) => {
  const admin = await Admin.findById(adminId)

  if (!admin) {
    throw new AppError(404, "Admin not found")
  }

  return admin
}

const updateAdmin = async (adminId: string, payload: UpdateAdminInput) => {
  const admin = await Admin.findByIdAndUpdate(adminId, payload, {
    new: true,
    runValidators: true,
  })

  if (!admin) {
    throw new AppError(404, "Admin not found")
  }

  return admin
}

const deleteAdmin = async (adminId: string) => {
  const admin = await Admin.findByIdAndDelete(adminId)

  if (!admin) {
    throw new AppError(404, "Admin not found")
  }

  return admin
}

const grantPermission = async (
  adminId: string,
  payload: GrantPermissionInput
) => {
  const admin = await Admin.findById(adminId)

  if (!admin) {
    throw new AppError(404, "Admin not found")
  }

  if (admin.permissions.includes(payload.permission as AdminPermission)) {
    throw new AppError(409, "Admin already has this permission")
  }

  admin.permissions.push(payload.permission as AdminPermission)
  await admin.save()

  return admin
}

const revokePermission = async (
  adminId: string,
  payload: GrantPermissionInput
) => {
  const admin = await Admin.findById(adminId)

  if (!admin) {
    throw new AppError(404, "Admin not found")
  }

  const index = admin.permissions.indexOf(payload.permission as AdminPermission)

  if (index === -1) {
    throw new AppError(404, "Admin does not have this permission")
  }

  admin.permissions.splice(index, 1)

  if (admin.permissions.length === 0) {
    throw new AppError(400, "Admin must have at least one permission")
  }

  await admin.save()

  return admin
}

export const AdminService = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  grantPermission,
  revokePermission,
}
