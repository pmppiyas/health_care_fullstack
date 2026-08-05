import { IDoctor } from "@/app/api/doctor/doctor.interface"

export type DoctorWithId = IDoctor & { _id: string }

export type GetDoctorsMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type GetDoctorsParams = {
  page?: number
  limit?: number
  search?: string
  specialization?: string
  hospital?: string
}

export type GetDoctorsResponse = {
  success: boolean
  message: string
  data: DoctorWithId[]
  meta: GetDoctorsMeta
}

export type GetDoctorByIdResponse = {
  success: boolean
  message: string
  data: DoctorWithId
}

export type MutateDoctorResponse = {
  success: boolean
  message: string
  data: DoctorWithId
}

export type DeleteDoctorResponse = {
  success: boolean
  message: string
}
