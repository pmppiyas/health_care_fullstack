import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import {
  UpdateUserStatusInput,
  updateUserStatusSchema,
} from "@/app/api/user/user.validation"
import { Role } from "@/app/api/user/user.interface"
import { UserController } from "@/app/api/user/user.controller"

export const PATCH = withAuthAndValidation(
  updateUserStatusSchema,
  [Role.ADMIN],
  async (req, context, user, data: UpdateUserStatusInput) => {
    const { userId } = await context.params
    return await UserController.updateUserStatus(userId, data, user)
  }
)
