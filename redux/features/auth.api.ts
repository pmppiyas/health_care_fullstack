import {
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  AuthUserProfile,
} from "@/interfaces/auth.interface"
import { baseApi } from "@/redux/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["AUTH"],
    }),

    getMe: builder.query<AuthUserProfile, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["AUTH"],
      transformResponse: (res: GetMeResponse) => res.data,
    }),

    logOut: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["AUTH"],
    }),

    updateProfile: builder.mutation<AuthUserProfile, any>({
      query: (data) => ({
        url: "/api/auth/me",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["AUTH"],
      transformResponse: (res: GetMeResponse) => res.data,
    }),
  }),
})

export const {
  useLoginMutation,
  useLogOutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi
