import { NextRequest } from "next/server"
import { connectDB } from "@/config/db.config"
import { sendResponse } from "@/lib/utils/sendResponse"
import { handleError } from "@/lib/error/handleError"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import { updateDoctorPatientSchema } from "@/app/api/doctor-patient/doctorPatient.validation"

interface Context {
  params: Promise<{ assignmentId: string }>
}

export async function PATCH(req: NextRequest, context: Context) {
  try {
    await connectDB()
    const { assignmentId } = await context.params
    const body = await req.json()
    const payload = updateDoctorPatientSchema.parse(body)
    const data = await DoctorPatientService.updateDoctorPatient(
      assignmentId,
      payload
    )
    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Assignment updated successfully",
      data,
    })
  } catch (error) {
    const handledError = handleError(error)
    return sendResponse({
      statusCode: handledError.statusCode,
      success: false,
      message: handledError.message,
    })
  }
}
