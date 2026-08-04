import { validateData } from "@/lib/validation/validateData"
import { NextRequest, NextResponse } from "next/server"
import { ZodType } from "zod"
import { connectDB } from "@/config/db.config"
import { handleError } from "@/lib/error/handleError"

type ValidationHandler<T> = (req: NextRequest, data: T) => Promise<NextResponse>

export function withValidation<T>(
  schema: ZodType<T>,
  handler: ValidationHandler<T>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      await connectDB()

      const validation = await validateData(req, schema)

      if (!validation.success) {
        return validation.response
      }

      return await handler(req, validation.data)
    } catch (error) {
      const { statusCode, message } = handleError(error)

      return NextResponse.json(
        { success: false, message },
        { status: statusCode }
      )
    }
  }
}

