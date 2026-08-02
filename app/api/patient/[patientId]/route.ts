import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import {
  UpdatePatientInput,
  updatePatientSchema,
} from "@/app/api/patient/patient.validation"
import { Role } from "@/app/api/user/user.interface"
import { PatientController } from "@/app/api/patient/patient.controller"

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR,
  Role.PATIENT
)(async (req, context, user) => {
  const { patientId } = await context.params
  return await PatientController.getPatientById(req, patientId)
})

export const PATCH = withAuthAndValidation(
  updatePatientSchema,
  [Role.ADMIN],
  async (req, context, user, data: UpdatePatientInput) => {
    const { patientId } = await context.params
    return await PatientController.updatePatient(patientId, data, user)
  }
)

export const DELETE = withAuth(Role.ADMIN)(async (req, context, user) => {
  const { patientId } = await context.params
  return await PatientController.deletePatient(req, patientId)
})
