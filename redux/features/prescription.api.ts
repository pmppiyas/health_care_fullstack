import { baseApi } from "@/redux/baseApi"

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: (params) => ({
        url: "/api/prescription",
        method: "GET",
        params,
      }),
      providesTags: ["PRESCRIPTION"],
    }),
    getPrescriptionById: builder.query({
      query: (id) => ({
        url: `/api/prescription/${id}`,
        method: "GET",
      }),
      providesTags: ["PRESCRIPTION"],
    }),
    createPrescription: builder.mutation({
      query: (data) => ({
        url: "/api/prescription",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PRESCRIPTION"],
    }),
    updatePrescription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/prescription/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PRESCRIPTION"],
    }),
    deletePrescription: builder.mutation({
      query: (id) => ({
        url: `/api/prescription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRESCRIPTION"],
    }),
    suggestPrescription: builder.mutation({
      query: (data) => ({
        url: "/api/prescription/suggest",
        method: "POST",
        data,
      }),
    }),
  }),
})

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useSuggestPrescriptionMutation,
} = prescriptionApi
