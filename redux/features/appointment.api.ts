import {
  Appointment,
  AppointmentArrayResponse,
  AppointmentListResponse,
  AppointmentResponse,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/interfaces/appointment.interface"
import { baseApi } from "@/redux/baseApi"

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<
      AppointmentListResponse,
      {
        page?: number
        limit?: number
        status?: string
        search?: string
        doctorId?: string
        patientId?: string
      }
    >({
      query: ({ page = 1, limit = 10, status, search, doctorId, patientId }) => ({
        url: "/api/appointment",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(search && { search }),
          ...(doctorId && { doctorId }),
          ...(patientId && { patientId }),
        },
      }),

      providesTags: ["APPOINTMENT"],
    }),

    getAppointmentById: builder.query<Appointment, string>({
      query: (appointmentId) => ({
        url: `/api/appointment/${appointmentId}`,
        method: "GET",
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      providesTags: ["APPOINTMENT"],
    }),

    createAppointment: builder.mutation<Appointment, CreateAppointmentInput>({
      query: (data) => ({
        url: "/api/appointment",
        method: "POST",
        data,
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    updateAppointment: builder.mutation<
      Appointment,
      {
        appointmentId: string
        data: UpdateAppointmentInput
      }
    >({
      query: ({ appointmentId, data }) => ({
        url: `/api/appointment/${appointmentId}`,
        method: "PATCH",
        data,
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    updateAppointmentStatus: builder.mutation<
      Appointment,
      {
        appointmentId: string
        status: string
      }
    >({
      query: ({ appointmentId, status }) => ({
        url: `/api/appointment/${appointmentId}/status`,
        method: "PATCH",
        data: { status },
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    cancelAppointment: builder.mutation<Appointment, string>({
      query: (appointmentId) => ({
        url: `/api/appointment/${appointmentId}/cancel`,
        method: "PATCH",
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    deleteAppointment: builder.mutation<Appointment, string>({
      query: (appointmentId) => ({
        url: `/api/appointment/${appointmentId}`,
        method: "DELETE",
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    getAppointmentsByDoctor: builder.query<
      Appointment[],
      {
        doctorId: string
        status?: string
      }
    >({
      query: ({ doctorId, status }) => ({
        url: `/api/appointment/doctor/${doctorId}`,
        method: "GET",
        params: {
          ...(status && { status }),
        },
      }),

      transformResponse: (res: AppointmentArrayResponse) => res.data,

      providesTags: ["APPOINTMENT"],
    }),

    getAppointmentsByPatient: builder.query<
      Appointment[],
      {
        patientId: string
        status?: string
      }
    >({
      query: ({ patientId, status }) => ({
        url: `/api/appointment/patient/${patientId}`,
        method: "GET",
        params: {
          ...(status && { status }),
        },
      }),

      transformResponse: (res: AppointmentArrayResponse) => res.data,

      providesTags: ["APPOINTMENT"],
    }),
  }),
})

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useCancelAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsByDoctorQuery,
  useGetAppointmentsByPatientQuery,
} = appointmentApi
