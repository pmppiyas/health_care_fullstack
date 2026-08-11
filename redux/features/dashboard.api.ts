import {
  DashboardOverviewData,
  DashboardOverviewResponse,
} from "@/interfaces/dashboard.interface"
import { baseApi } from "@/redux/baseApi"

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewData, void>({
      query: () => ({
        url: "/api/dashboard",
        method: "GET",
      }),
      providesTags: ["DASHBOARD"],
      transformResponse: (res: DashboardOverviewResponse) => res.data,
    }),
  }),
})

export const { useGetDashboardOverviewQuery } = dashboardApi
