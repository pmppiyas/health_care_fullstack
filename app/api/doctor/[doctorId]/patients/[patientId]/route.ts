import { NextRequest } from "next/server"
import { connectDB } from "@/config/db.config"
import { sendResponse } from "@/lib/utils/sendResponse"
import { handleError } from "@/lib/error/handleError"
import { DoctorPatientService } from "@/app/api/doctor-patient/doctorPatient.service"

interface Context {
  params: Promise<{
    doctorId: string
    patientId: string
  }>
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    await connectDB()

    const { doctorId, patientId } = await context.params

    await DoctorPatientService.removePatientFromDoctor(doctorId, patientId)

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Patient removed from doctor successfully",
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
