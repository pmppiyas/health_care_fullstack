import { AnalyticsController } from "@/app/api/analytics/analytics.controller"
import { Role } from "@/app/api/user/user.interface"
import { withAuth } from "@/middleware/withAuth"

export const GET = withAuth(Role.ADMIN)(async () => {
  return await AnalyticsController.getPatientAnalytics()
})
