import { api } from "@/lib/api/api"

export type LoginData = {
  email: string
  password: string
  rememberMe: boolean
}

export type LoginResponse = {
  message: string
}

export const login = (data: LoginData) => {
  return api<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: data,
  })
}
