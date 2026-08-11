import { DashboardOverviewController } from "@/app/api/dashboard/overview.controller"
import { Role } from "@/app/api/user/user.interface"
import { withAuth } from "@/middleware/withAuth"
import { NextRequest } from "next/server"
import { RouteContext } from "@/middleware/withAuth"
import { AuthUser } from "@/interfaces/auth.interface"

export const GET = withAuth(Role.ADMIN)(
  async (_req: NextRequest, _ctx: RouteContext, _user: AuthUser) => {
    return await DashboardOverviewController.getOverview()
  }
)
