import {
  Appointment,
  AppointmentArrayResponse,
  AppointmentListResponse,
  AppointmentResponse,
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
        doctorId?: string
        patientId?: string
      }
    >({
      query: ({ page = 1, limit = 10, status, doctorId, patientId }) => ({
        url: "/api/appointments",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(doctorId && { doctorId }),
          ...(patientId && { patientId }),
        },
      }),

      providesTags: ["APPOINTMENT"],
    }),

    getAppointmentById: builder.query<Appointment, string>({
      query: (appointmentId) => ({
        url: `/api/appointments/${appointmentId}`,
        method: "GET",
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      providesTags: ["APPOINTMENT"],
    }),

    createAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (data) => ({
        url: "/api/appointments",
        method: "POST",
        body: data,
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    updateAppointment: builder.mutation<
      Appointment,
      {
        appointmentId: string
        data: Partial<Appointment>
      }
    >({
      query: ({ appointmentId, data }) => ({
        url: `/api/appointments/${appointmentId}`,
        method: "PATCH",
        body: data,
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
        url: `/api/appointments/${appointmentId}/status`,
        method: "PATCH",
        body: { status },
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    cancelAppointment: builder.mutation<Appointment, string>({
      query: (appointmentId) => ({
        url: `/api/appointments/${appointmentId}/cancel`,
        method: "PATCH",
      }),

      transformResponse: (res: AppointmentResponse) => res.data,

      invalidatesTags: ["APPOINTMENT"],
    }),

    deleteAppointment: builder.mutation<Appointment, string>({
      query: (appointmentId) => ({
        url: `/api/appointments/${appointmentId}`,
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
        url: `/api/appointments/doctor/${doctorId}`,
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
        url: `/api/appointments/patient/${patientId}`,
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
