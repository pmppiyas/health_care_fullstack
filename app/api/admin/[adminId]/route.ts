import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import {
  UpdateAdminInput,
  updateAdminSchema,
} from "@/app/api/admin/admin.validation"
import { Role } from "@/app/api/user/user.interface"
import { AdminController } from "@/app/api/admin/admin.controller"

export const GET = withAuth(Role.ADMIN)(async (req, context, user) => {
  const { adminId } = await context.params
  return await AdminController.getAdminById(req, adminId)
})

export const PATCH = withAuthAndValidation(
  updateAdminSchema,
  [Role.ADMIN],
  async (req, context, user, data: UpdateAdminInput) => {
    const { adminId } = await context.params
    return await AdminController.updateAdmin(adminId, data, user)
  }
)

export const DELETE = withAuth(Role.ADMIN)(async (req, context, user) => {
  const { adminId } = await context.params
  return await AdminController.deleteAdmin(req, adminId)
})
