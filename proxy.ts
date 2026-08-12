import { ENV } from "@/config/env.config"
import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { getDefaultDashboardRoutes, getRouteOwner } from "@/lib/auth/auth"
import { Role } from "@/app/api/user/user.interface"

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const accessToken = req.cookies.get("access-token")?.value

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next()
  }

  if (
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/register") &&
    accessToken
  ) {
    try {
      const decoded = jwt.verify(
        accessToken,
        ENV.JWT_ACCESS_SECRET
      ) as JwtPayload & { role?: Role }

      const role = decoded?.role
      if (role) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoutes(role), req.url)
        )
      }
    } catch {
      return NextResponse.next()
    }
  }

  const routeOwner = getRouteOwner(pathname)

  if (!accessToken && routeOwner && routeOwner !== "COMMON") {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        ENV.JWT_ACCESS_SECRET
      ) as JwtPayload & { role?: Role }

      const userRole = decoded?.role

      if (routeOwner && routeOwner !== "COMMON" && routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoutes(userRole), req.url)
        )
      }
    } catch {
      const loginUrl = new URL("/login", req.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete("access-token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
