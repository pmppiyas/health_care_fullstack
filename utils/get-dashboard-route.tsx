import { Role } from "@/app/api/user/user.interface"

export const getDashboardRoute = (role: Role | undefined): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard"
    case "DOCTOR":
      return "/doctor/dashboard"
    case "PATIENT":
      return "/dashboard"
    default:
      return "/"
  }
}
