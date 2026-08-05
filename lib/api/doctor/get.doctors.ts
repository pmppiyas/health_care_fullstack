import { IDoctor } from "@/app/api/doctor/doctor.interface"
import { api } from "@/lib/api/api"

export type GetDoctorsMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type GetDoctorsResponse = {
  success: boolean
  message: string
  data: IDoctor[]
  meta: GetDoctorsMeta
}

export type GetDoctorsParams = {
  page?: number
  limit?: number
  search?: string
  specialization?: string
  hospital?: string
}

export const getDoctors = (params?: GetDoctorsParams) => {
  const query = new URLSearchParams()

  if (params?.page) query.set("page", String(params.page))
  if (params?.limit) query.set("limit", String(params.limit))
  if (params?.search) query.set("search", params.search)
  if (params?.specialization) query.set("specialization", params.specialization)
  if (params?.hospital) query.set("hospital", params.hospital)

  const queryString = query.toString()

  return api<GetDoctorsResponse>(
    `/api/doctor${queryString ? `?${queryString}` : ""}`,
    { method: "GET" }
  )
}
