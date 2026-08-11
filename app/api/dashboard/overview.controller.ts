import { DashboardOverviewService } from "@/app/api/dashboard/overview.service"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"

const getOverview = async () => {
  const data = await DashboardOverviewService.getOverview()

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard overview retrieved successfully",
    data,
  })
}

export const DashboardOverviewController = { getOverview }
