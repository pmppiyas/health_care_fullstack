import { withValidation } from "@/middleware/withValidation"
import { loginSchema } from "../auth.validation"
import { AuthController } from "@/app/api/auth/auth.controller"

export const POST = withValidation(loginSchema, async (_req, data) => {
  return await AuthController.loginUser(data)
})
