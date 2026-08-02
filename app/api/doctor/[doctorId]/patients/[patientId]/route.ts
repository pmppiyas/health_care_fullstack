import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"

export const DELETE = withAuth(Role.ADMIN, Role.DOCTOR)(async (req, context, user) => {
  const { doctorId, patientId } = await context.params
  await DoctorPatientService.removePatientFromDoctor(doctorId, patientId)
  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient removed from doctor successfully",
  })
})
