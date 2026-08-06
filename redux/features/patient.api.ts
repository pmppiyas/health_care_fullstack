import {
  CreatePatientInput,
  UpdatePatientInput,
} from "@/app/api/patient/patient.validation"
import {
  DeletePatientResponse,
  GetPatientByIdResponse,
  GetPatientsParams,
  GetPatientsResponse,
  MutatePatientResponse,
} from "@/interfaces/patient.interface"
import { baseApi } from "@/redux/baseApi"

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPATIENTs: builder.query<GetPatientsResponse, GetPatientsParams | void>({
      query: (params) => ({
        url: "/api/patient",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({
                type: "PATIENT" as const,
                id: _id,
              })),
              { type: "PATIENT", id: "LIST" },
            ]
          : [{ type: "PATIENT", id: "LIST" }],
    }),

    getPATIENTById: builder.query<GetPatientByIdResponse, string>({
      query: (patientId) => ({
        url: `/api/patient/${patientId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, patientId) => [
        { type: "PATIENT", id: patientId },
      ],
    }),

    createPATIENT: builder.mutation<MutatePatientResponse, CreatePatientInput>({
      query: (body) => ({
        url: "/api/patient",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "PATIENT", id: "LIST" }],
    }),

    updatePATIENT: builder.mutation<
      MutatePatientResponse,
      { patientId: string; data: UpdatePatientInput }
    >({
      query: ({ patientId, data }) => ({
        url: `/api/patient/${patientId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { patientId }) => [
        { type: "PATIENT", id: patientId },
        { type: "PATIENT", id: "LIST" },
      ],
    }),

    deletePATIENT: builder.mutation<DeletePatientResponse, string>({
      query: (patientId) => ({
        url: `/api/patient/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, patientId) => [
        { type: "PATIENT", id: patientId },
        { type: "PATIENT", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetPATIENTsQuery,
  useGetPATIENTByIdQuery,
  useCreatePATIENTMutation,
  useUpdatePATIENTMutation,
  useDeletePATIENTMutation,
} = patientApi
