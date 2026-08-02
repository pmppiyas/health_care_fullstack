import { withAuth } from "@/middleware/withAuth"
import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import { Role } from "@/app/api/user/user.interface"
import {
  CreateDoctorPatientInput,
  createDoctorPatientSchema,
} from "@/app/api/doctor-patient/doctorPatient.validation"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"

export const POST = withAuthAndValidation(
  createDoctorPatientSchema,
  [Role.ADMIN, Role.DOCTOR],
  async (req, context, user, data: CreateDoctorPatientInput) => {
    const { doctorId } = await context.params
    const assignment = await DoctorPatientService.assignPatientToDoctor(
      doctorId,
      data
    )
    return sendResponse({
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Patient assigned to doctor successfully",
      data: assignment,
    })
  }
)

export const GET = withAuth(
  Role.ADMIN,
  Role.DOCTOR
)(async (req, context, user) => {
  const { doctorId } = await context.params
  const patients = await DoctorPatientService.getPatientsByDoctor(doctorId)
  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients retrieved successfully",
    data: patients,
  })
})
