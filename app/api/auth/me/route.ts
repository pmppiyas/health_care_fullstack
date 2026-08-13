import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { AuthController } from "../auth.controller"
import { NextRequest } from "next/server"

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR,
  Role.PATIENT
)(async (_req, _context, user) => {
  return await AuthController.getMe(user)
})

export const PATCH = withAuth(
  Role.ADMIN,
  Role.DOCTOR,
  Role.PATIENT
)(async (req: NextRequest, _context, user) => {
  const data = await req.json()
  return await AuthController.updateMyProfile(user, data)
})
