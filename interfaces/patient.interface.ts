import { IPatient } from "@/app/api/patient/patient.interface"

export type PatientWithId = IPatient & { _id: string }

export type GetPatientsMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type GetPatientsParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  gender?: string
}

export type GetPatientsResponse = {
  success: boolean
  message: string
  data: PatientWithId[]
  meta: GetPatientsMeta
}

export type GetPatientByIdResponse = {
  success: boolean
  message: string
  data: PatientWithId
}

export type MutatePatientResponse = {
  success: boolean
  message: string
  data: PatientWithId
}

export type DeletePatientResponse = {
  success: boolean
  message: string
}
