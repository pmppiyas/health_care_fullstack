import { withAuth } from "@/middleware/withAuth"
import { CreateDoctorInput, createDoctorSchema } from "./doctor.validation"
import { Role } from "@/app/api/user/user.interface"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import { DoctorController } from "@/app/api/doctor/doctor.controller"

export const POST = withAuthAndValidation(
  createDoctorSchema,
  [Role.ADMIN],
  async (req, context, user, data: CreateDoctorInput) => {
    return await DoctorController.createDoctor(data, user)
  }
)

export const GET = withAuth(...Object.values(Role))(async (
  req,
  context,
  user
) => {
  return await DoctorController.getAllDoctors(req)
})
