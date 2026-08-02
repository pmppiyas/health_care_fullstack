import { StatusCodes } from "http-status-codes/build/cjs/status-codes"
import { NextRequest, NextResponse } from "next/server"
import { ZodType } from "zod"

export async function validateData<T>(req: NextRequest, schema: ZodType<T>) {
  try {
    const body = await req.json()

    const result = schema.safeParse(body)

    if (!result.success) {
      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: result.error.issues[0]?.message,
            errors: result.error.issues,
          },
          { status: StatusCodes.BAD_REQUEST }
        ),
      }
    }

    return {
      success: true as const,
      data: result.data,
    }
  } catch {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: StatusCodes.BAD_REQUEST }
      ),
    }
  }
}
