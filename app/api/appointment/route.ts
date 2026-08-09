import { NextRequest } from "next/server"
import { AppointmentController } from "@/app/api/appointment/appointment.controller"
import {
  CreateAppointmentInput,
  createAppointmentValidationSchema,
} from "@/app/api/appointment/appointment.validation"
import { Role } from "@/app/api/user/user.interface"
import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"

export const POST = withAuthAndValidation(
  createAppointmentValidationSchema,
  [Role.ADMIN, Role.DOCTOR],
  async (req, context, user, data: CreateAppointmentInput) => {
    return await AppointmentController.createAppointment(data)
  }
)

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR
)(async (req: NextRequest, context, user) => {
  return await AppointmentController.getAllAppointments(req)
})
