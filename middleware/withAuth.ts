import { NextRequest, NextResponse } from "next/server"
import { Types } from "mongoose"
import { connectDB } from "@/config/db.config"
import { Role, UserStatus } from "@/app/api/user/user.interface"
import { ENV } from "@/config/env.config"
import { verifyToken } from "@/lib/token/verifyToken"
import User from "@/app/api/user/user.model"
import { AuthUser } from "@/interfaces/auth.interface"
import { StatusCodes } from "http-status-codes"

export type RouteContext = {
  params: Promise<Record<string, string>>
}

export type AuthenticatedHandler = (
  req: NextRequest,
  context: RouteContext,
  user: AuthUser
) => Promise<NextResponse>

export function withAuth(...allowedRoles: Role[]) {
  return (handler: AuthenticatedHandler) =>
    async (req: NextRequest, context: RouteContext): Promise<NextResponse> => {
      try {
        await connectDB()

        let token = req.cookies.get("access-token")?.value

        if (!token) {
          const authHeader = req.headers.get("authorization")

          if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.substring(7)
          }
        }

        if (!token) {
          return NextResponse.json(
            {
              success: false,
              message: "No token received",
            },
            { status: StatusCodes.UNAUTHORIZED }
          )
        }

        const verifiedToken = verifyToken(
          token,
          ENV.JWT_ACCESS_TOKEN
        ) as AuthUser

        if (!verifiedToken?.userId || !verifiedToken?.role) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid token",
            },
            { status: StatusCodes.UNAUTHORIZED }
          )
        }

        if (!allowedRoles.includes(verifiedToken.role)) {
          return NextResponse.json(
            {
              success: false,
              message: "You are not permitted for this route",
            },
            { status: StatusCodes.FORBIDDEN }
          )
        }

        if (!Types.ObjectId.isValid(verifiedToken.userId)) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid user ID",
            },
            { status: StatusCodes.BAD_REQUEST }
          )
        }

        const user = await User.findById(verifiedToken.userId)

        if (!user) {
          return NextResponse.json(
            {
              success: false,
              message: "User does not exist",
            },
            { status: StatusCodes.NOT_FOUND }
          )
        }

        if (user.status === UserStatus.BLOCKED) {
          return NextResponse.json(
            {
              success: false,
              message: `User is ${user.status} and not allowed to access this route`,
            },
            { status: StatusCodes.FORBIDDEN }
          )
        }

        return await handler(req, context, verifiedToken)
      } catch (error) {
        console.error("Authentication error:", error)

        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized",
          },
          { status: StatusCodes.UNAUTHORIZED }
        )
      }
    }
}
