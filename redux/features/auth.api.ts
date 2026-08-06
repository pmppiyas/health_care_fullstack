import {
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
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

    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["AUTH"],
    }),

    logOut: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["AUTH"],
    }),
  }),
})

export const { useLoginMutation, useLogOutMutation, useGetMeQuery } = authApi
