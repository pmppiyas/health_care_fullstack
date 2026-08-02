import { AuthController } from "../auth.controller"

export const POST = async () => {
  return await AuthController.logoutUser()
}
