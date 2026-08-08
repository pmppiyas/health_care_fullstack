import { AnalyticsServices } from "@/app/api/analytics/analytics.service"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"

const getDoctorAnalytics = async () => {
  const result = await AnalyticsServices.getDoctorAnalytics()

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor analytics retrieved successfully",
    data: result,
  })
}

export const AnalyticsController = {
  getDoctorAnalytics,
}
