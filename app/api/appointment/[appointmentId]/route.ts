import { NextRequest } from "next/server"
import { AppointmentController } from "@/app/api/appointment/appointment.controller"
import {
  UpdateAppointmentInput,
  updateAppointmentValidationSchema,
} from "@/app/api/appointment/appointment.validation"
import { Role } from "@/app/api/user/user.interface"
import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"

type RouteContext = {
  params: Promise<{
    appointmentId: string
  }>
}

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR
)(async (req, context, user) => {
  const { appointmentId } = await context.params

  return AppointmentController.getAppointmentById(req, appointmentId, user)
})

export const PATCH = withAuthAndValidation(
  updateAppointmentValidationSchema,
  [Role.ADMIN, Role.DOCTOR],
  async (req, context, user, data: UpdateAppointmentInput) => {
    const { appointmentId } = await context.params

    return AppointmentController.updateAppointment(appointmentId, data)
  }
)

export const DELETE = withAuth(Role.ADMIN)(async (req, context) => {
  const { appointmentId } = await context.params

  return AppointmentController.deleteAppointment(req, appointmentId)
})
