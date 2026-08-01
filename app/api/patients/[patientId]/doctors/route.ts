import { NextRequest } from "next/server"
import { connectDB } from "@/config/db.config"
import { sendResponse } from "@/lib/utils/sendResponse"
import { handleError } from "@/lib/error/handleError"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"

interface Context {
  params: Promise<{ patientId: string }>
}

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB()
    const { patientId } = await context.params
    const data = await DoctorPatientService.getDoctorsByPatient(patientId)
    return sendResponse({ statusCode: 200, success: true, message: "Doctors retrieved successfully", data })
  } catch (error) {
    const handledError = handleError(error)
    return sendResponse({ statusCode: handledError.statusCode, success: false, message: handledError.message })
  }
}
