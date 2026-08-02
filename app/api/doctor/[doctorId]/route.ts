import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import { Role } from "@/app/api/user/user.interface"
import {
  UpdateDoctorInput,
  updateDoctorSchema,
} from "@/app/api/doctor/doctor.validation"
import { DoctorController } from "@/app/api/doctor/doctor.controller"

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR
)(async (req, context, user) => {
  const { doctorId } = await context.params
  return await DoctorController.getDoctorById(req, doctorId)
})

export const PATCH = withAuthAndValidation(
  updateDoctorSchema,
  [Role.ADMIN],
  async (req, context, user, data: UpdateDoctorInput) => {
    const { doctorId } = await context.params
    return await DoctorController.updateDoctor(doctorId, data, user)
  }
)

export const DELETE = withAuth(Role.ADMIN)(async (req, context, user) => {
  const { doctorId } = await context.params
  return await DoctorController.deleteDoctor(req, doctorId)
})
