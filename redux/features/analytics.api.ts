import {
  DoctorAnalyticsResponse,
  DoctorAnalyticsData,
  PatientAnalyticsResponse,
  PatientAnalyticsData,
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

    patientAnalytics: builder.query<PatientAnalyticsData, void>({
      query: () => ({
        url: "/api/analytics/patients",
        method: "GET",
      }),

      providesTags: ["PATIENT_ANALYTICS"],

      transformResponse: (res: PatientAnalyticsResponse) => res.data,
    }),
  }),
})

export const { useDoctorAnalyticsQuery, usePatientAnalyticsQuery } =
  analyticsApi
