import { validateData } from "@/lib/validation/validateData"
import { NextRequest, NextResponse } from "next/server"
import { ZodType } from "zod"

type ValidationHandler<T> = (req: NextRequest, data: T) => Promise<NextResponse>

export function withValidation<T>(
  schema: ZodType<T>,
  handler: ValidationHandler<T>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const validation = await validateData(req, schema)

    if (!validation.success) {
      return validation.response
    }

    return await handler(req, validation.data)
  }
}
