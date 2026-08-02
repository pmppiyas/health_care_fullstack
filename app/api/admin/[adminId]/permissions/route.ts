import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import {
  GrantPermissionInput,
  grantPermissionSchema,
  RevokePermissionInput,
  revokePermissionSchema,
} from "@/app/api/admin/admin.validation"
import { Role } from "@/app/api/user/user.interface"
import { AdminController } from "@/app/api/admin/admin.controller"

export const POST = withAuthAndValidation(
  grantPermissionSchema,
  [Role.ADMIN],
  async (req, context, user, data: GrantPermissionInput) => {
    const { adminId } = await context.params
    return await AdminController.grantPermission(adminId, data, user)
  }
)

export const DELETE = withAuthAndValidation(
  revokePermissionSchema,
  [Role.ADMIN],
  async (req, context, user, data: RevokePermissionInput) => {
    const { adminId } = await context.params
    return await AdminController.revokePermission(adminId, data, user)
  }
)
