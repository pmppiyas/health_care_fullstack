import {
  CreateDoctorInput,
  UpdateDoctorInput,
} from "@/app/api/doctor/doctor.validation"
import {
  DeleteDoctorResponse,
  GetDoctorByIdResponse,
  GetDoctorsParams,
  GetDoctorsResponse,
  MutateDoctorResponse,
} from "@/interfaces/doctor.interface"
import { baseApi } from "@/redux/baseApi"

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDOCTORs: builder.query<GetDoctorsResponse, GetDoctorsParams | void>({
      query: (params) => ({
        url: "/api/doctor",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({
                type: "DOCTOR" as const,
                id: _id,
              })),
              { type: "DOCTOR", id: "LIST" },
            ]
          : [{ type: "DOCTOR", id: "LIST" }],
    }),

    getDOCTORById: builder.query<GetDoctorByIdResponse, string>({
      query: (doctorId) => ({
        url: `/api/doctor/${doctorId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, doctorId) => [
        { type: "DOCTOR", id: doctorId },
      ],
    }),

    createDOCTOR: builder.mutation<MutateDoctorResponse, CreateDoctorInput>({
      query: (body) => ({
        url: "/api/doctor",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "DOCTOR", id: "LIST" }],
    }),

    updateDOCTOR: builder.mutation<
      MutateDoctorResponse,
      { doctorId: string; data: UpdateDoctorInput }
    >({
      query: ({ doctorId, data }) => ({
        url: `/api/doctor/${doctorId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { doctorId }) => [
        { type: "DOCTOR", id: doctorId },
        { type: "DOCTOR", id: "LIST" },
      ],
    }),

    deleteDOCTOR: builder.mutation<DeleteDoctorResponse, string>({
      query: (doctorId) => ({
        url: `/api/doctor/${doctorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, doctorId) => [
        { type: "DOCTOR", id: doctorId },
        { type: "DOCTOR", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetDOCTORsQuery,
  useGetDOCTORByIdQuery,
  useCreateDOCTORMutation,
  useUpdateDOCTORMutation,
  useDeleteDOCTORMutation,
} = doctorApi
