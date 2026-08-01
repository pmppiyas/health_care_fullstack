import { NextRequest } from "next/server"
import { connectDB } from "@/config/db.config"
import { createDoctor, getAllDoctors } from "./doctor.controller"
import { sendResponse } from "@/lib/utils/sendResponse"
import { handleError } from "@/lib/error/handleError"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    return await createDoctor(req)
  } catch (error) {
    const handledError = handleError(error)

    return sendResponse({
      statusCode: handledError.statusCode,
      success: false,
      message: handledError.message,
    })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    return await getAllDoctors(req)
  } catch (error) {
    const handledError = handleError(error)

    return sendResponse({
      statusCode: handledError.statusCode,
      success: false,
      message: handledError.message,
    })
  }
}
