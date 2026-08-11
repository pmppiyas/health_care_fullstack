import { NextRequest, NextResponse } from "next/server"
import { ZodSchema } from "zod"
import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { AuthUser } from "@/interfaces/auth.interface"
import { StatusCodes } from "http-status-codes/build/cjs/status-codes"
import { handleError } from "@/lib/error/handleError"

type RouteContext = {
  params: Promise<Record<string, string>>
}

type Handler<T> = (
  req: NextRequest,
  context: RouteContext,
  user: AuthUser,
  data: T
) => Promise<NextResponse>

export function withAuthAndValidation<
  Output,
  Schema extends ZodSchema<Output, any, any>,
>(schema: Schema, roles: Role[], handler: Handler<Output>) {
  return withAuth(...roles)(async (req, context, user) => {
    try {
      const body = await req.json()

      const result = schema.safeParse(body)

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: result.error.issues[0]?.message,
            errors: result.error.issues,
          },
          { status: StatusCodes.BAD_REQUEST }
        )
      }

      return await handler(req, context, user, result.data as Output)
    } catch (error) {
      console.error("Handler error:", error)

      const { statusCode, message } = handleError(error)

      return NextResponse.json(
        { success: false, message },
        { status: statusCode }
      )
    }
  })
}
