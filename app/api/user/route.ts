import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { UserController } from "./user.controller"

export const GET = withAuth(Role.ADMIN)(async (req, context, user) => {
  return await UserController.getAllUsers(req)
})
