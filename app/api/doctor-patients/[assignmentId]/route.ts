import { withAuthAndValidation } from "@/middleware/withAuthAndValidation"
import {
  UpdateDoctorPatientInput,
  updateDoctorPatientSchema,
} from "@/app/api/doctor-patient/doctorPatient.validation"
import { Role } from "@/app/api/user/user.interface"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"

export const PATCH = withAuthAndValidation(
  updateDoctorPatientSchema,
  [Role.ADMIN],
  async (req, context, user, data: UpdateDoctorPatientInput) => {
    const { assignmentId } = await context.params
    const assignment = await DoctorPatientService.updateDoctorPatient(
      assignmentId,
      data
    )
    return sendResponse({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    })
  }
)
