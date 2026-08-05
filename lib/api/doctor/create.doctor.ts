import { IDoctor } from "@/app/api/doctor/doctor.interface"
import { CreateDoctorInput } from "@/app/api/doctor/doctor.validation"
import { api } from "@/lib/api/api"

export type CreateDoctorResponse = {
  message: string
  data: IDoctor
}

export const createDoctor = (data: CreateDoctorInput) => {
  return api<CreateDoctorResponse>("/api/doctor", {
    method: "POST",
    body: data,
  })
}
