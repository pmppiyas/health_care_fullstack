import { NextRequest } from "next/server"
import { connectDB } from "@/config/db.config"
import { sendResponse } from "@/lib/utils/sendResponse"
import {
  deleteDoctor,
  getDoctorById,
  updateDoctor,
} from "@/app/api/doctor/doctor.controller"
import { handleError } from "@/lib/error/handleError"

interface Context {
  params: Promise<{
    doctorId: string
  }>
}

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB()

    const { doctorId } = await context.params

    return await getDoctorById(req, doctorId)
  } catch (error) {
    const handledError = handleError(error)

    return sendResponse({
      statusCode: handledError.statusCode,
      success: false,
      message: handledError.message,
    })
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  try {
    await connectDB()

    const { doctorId } = await context.params

    return await updateDoctor(req, doctorId)
  } catch (error) {
    const handledError = handleError(error)

    return sendResponse({
      statusCode: handledError.statusCode,
      success: false,
      message: handledError.message,
    })
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    await connectDB()

    const { doctorId } = await context.params

    return await deleteDoctor(req, doctorId)
  } catch (error) {
    const handledError = handleError(error)

    return sendResponse({
      statusCode: handledError.statusCode,
      success: false,
      message: handledError.message,
    })
  }
}
