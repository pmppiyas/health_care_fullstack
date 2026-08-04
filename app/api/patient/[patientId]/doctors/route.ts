import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { PatientController } from "@/app/api/patient/patient.controller"

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR,
  Role.PATIENT
)(async (req, context, user) => {
  const { patientId } = await context.params
  return await PatientController.getDoctorsByPatient(req, patientId)
})
