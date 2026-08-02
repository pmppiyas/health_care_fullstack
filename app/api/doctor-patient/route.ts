import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

// GET /api/doctor-patient — list all assignments (admin only)
export const GET = withAuth(Role.ADMIN)(async (req: NextRequest, context, user) => {
  const assignments = await DoctorPatientService.getAllAssignments(req)
  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Assignments retrieved successfully",
    data: assignments.assignments,
    meta: assignments.meta,
  })
})
