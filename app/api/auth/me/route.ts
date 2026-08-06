import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { AuthController } from "../auth.controller"

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR,
  Role.PATIENT
)(async (_req, _context, user) => {
  return await AuthController.getMe(user)
})
