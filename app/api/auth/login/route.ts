import { withValidation } from "@/middleware/withValidation"
import { loginSchema } from "../auth.validation"

export const POST = withValidation(loginSchema, async (_req, data) => {
  return await AuthController.loginUser(data)
})
