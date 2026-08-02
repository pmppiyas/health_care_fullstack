import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import { CreateAdminInput, createAdminSchema } from "./admin.validation"
import { Role } from "@/app/api/user/user.interface"
import { AdminController } from "./admin.controller"

export const POST = withAuthAndValidation(
  createAdminSchema,
  [Role.ADMIN],
  async (req, context, user, data: CreateAdminInput) => {
    return await AdminController.createAdmin(data, user)
  }
)

export const GET = withAuth(Role.ADMIN)(async (req, context, user) => {
  return await AdminController.getAllAdmins(req)
})
