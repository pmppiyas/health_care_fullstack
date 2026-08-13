import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import Doctor from "@/app/api/doctor/doctor.model"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { AppError } from "@/lib/error/AppError"
import { NextRequest } from "next/server"

export const GET = withAuth(Role.DOCTOR)(async (
  req: NextRequest,
  context,
  user
) => {
  const doctor = await Doctor.findOne({ userId: user.id }).select("_id")
  if (!doctor) {
    throw new AppError(404, "Doctor profile not found for this user")
  }
  const searchParams = req.nextUrl.searchParams
  const query = Object.fromEntries(searchParams.entries())
  const result = await DoctorPatientService.getPatientsByDoctor(doctor._id.toString(), query)
  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients retrieved successfully",
    data: result.patients,
    meta: result.meta,
  })
})
