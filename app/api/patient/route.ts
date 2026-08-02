import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import { CreatePatientInput, createPatientSchema } from "./patient.validation"
import { Role } from "@/app/api/user/user.interface"
import { PatientController } from "./patient.controller"

export const POST = withAuthAndValidation(
  createPatientSchema,
  [Role.ADMIN],
  async (req, context, user, data: CreatePatientInput) => {
    return await PatientController.createPatient(data, user)
  }
)

export const GET = withAuth(Role.ADMIN)(async (req, context, user) => {
  return await PatientController.getAllPatients(req)
})
