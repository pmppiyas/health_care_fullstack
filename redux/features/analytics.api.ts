import {
  DoctorAnalyticsResponse,
  DoctorAnalyticsData,
} from "@/interfaces/analytics.interface"
import { baseApi } from "@/redux/baseApi"

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    doctorAnalytics: builder.query<DoctorAnalyticsData, void>({
      query: () => ({
        url: "/api/analytics/doctors",
        method: "GET",
      }),
      providesTags: ["DOCTOR_ANALYTICS"],
      transformResponse: (res: DoctorAnalyticsResponse) => res.data,
    }),
  }),
})

export const { useDoctorAnalyticsQuery } = analyticsApi
