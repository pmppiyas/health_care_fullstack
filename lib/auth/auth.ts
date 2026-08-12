import { Role } from "@/app/api/user/user.interface"

type RouteConfig = {
  exact: string[]
  patterns: RegExp[]
}

const authRoutes = [
  "/login",
  "/signup",
  "/register",
  "/forget_password",
  "/reset_password",
]

const commonProtectedRoutes: RouteConfig = {
  exact: ["/my_profile", "/settings"],
  patterns: [],
}

const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin/],
  exact: [],
}

const doctorProtectedRoutes: RouteConfig = {
  patterns: [/^\/doctor/],
  exact: [],
}

const patientProtectedRoutes: RouteConfig = {
  patterns: [/^\/patient/],
  exact: [],
}

/* ================= HELPERS ================= */

export const isAuthRoutes = (pathname: string) => {
  return authRoutes.includes(pathname)
}

const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
  if (routes.exact.includes(pathname)) return true
  return routes.patterns.some((pattern) => pattern.test(pathname))
}

/* ================= ROLE MATCHER ================= */

export const getRouteOwner = (pathname: string): Role | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) return Role.ADMIN
  if (isRouteMatches(pathname, doctorProtectedRoutes)) return Role.DOCTOR
  if (isRouteMatches(pathname, patientProtectedRoutes)) return Role.PATIENT
  if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON"
  return null
}

/* ================= DEFAULT DASHBOARD ================= */

export const getDefaultDashboardRoutes = (
  role?: string | Role | null
): string => {
  switch (role) {
    case Role.ADMIN:
    case "ADMIN":
      return "/admin/dashboard"
    case Role.DOCTOR:
    case "DOCTOR":
      return "/doctor/dashboard"
    case Role.PATIENT:
    case "PATIENT":
      return "/patient/dashboard"
    default:
      return "/"
  }
}
