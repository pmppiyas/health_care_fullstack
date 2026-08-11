import axiosBaseQuery from "@/redux/axiosBaseQuery"
import { createApi } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "AUTH",
    "DOCTOR",
    "PATIENT",
    "DOCTOR_ANALYTICS",
    "PATIENT_ANALYTICS",
    "APPOINTMENT",
    "DASHBOARD",
  ],
  endpoints: () => ({}),
})
