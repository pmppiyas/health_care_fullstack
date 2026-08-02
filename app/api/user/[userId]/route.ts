import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import {
  UpdateUserInput,
  updateUserSchema,
} from "@/app/api/user/user.validation"
import { Role } from "@/app/api/user/user.interface"
import { UserController } from "@/app/api/user/user.controller"

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR,
  Role.PATIENT
)(async (req, context, user) => {
  const { userId } = await context.params
  return await UserController.getUserById(req, userId)
})

export const PATCH = withAuthAndValidation(
  updateUserSchema,
  [Role.ADMIN],
  async (req, context, user, data: UpdateUserInput) => {
    const { userId } = await context.params
    return await UserController.updateUser(userId, data, user)
  }
)

export const DELETE = withAuth(Role.ADMIN)(async (req, context, user) => {
  const { userId } = await context.params
  return await UserController.deleteUser(req, userId)
})
