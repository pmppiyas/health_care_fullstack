import { NextRequest } from "next/server"
import { connectDB } from "@/config/db.config"
import { sendResponse } from "@/lib/utils/sendResponse"
import { handleError } from "@/lib/error/handleError"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"
import { createDoctorPatientSchema } from "@/app/api/doctor-patient/doctorPatient.validation"

interface Context {
  params: Promise<{
    doctorId: string
  }>
}

export async function POST(req: NextRequest, context: Context) {
  try {
    await connectDB()

    const { doctorId } = await context.params
    const body = await req.json()
    const payload = createDoctorPatientSchema.parse(body)

    const assignment = await DoctorPatientService.assignPatientToDoctor(
      doctorId,
      payload
    )

    return sendResponse({
      statusCode: 201,
      success: true,
      message: "Patient assigned to doctor successfully",
      data: assignment,
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

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB()

    const { doctorId } = await context.params

    const patients = await DoctorPatientService.getPatientsByDoctor(doctorId)

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Patients retrieved successfully",
      data: patients,
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
