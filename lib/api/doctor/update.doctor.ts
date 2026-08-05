import { IDoctor } from "@/app/api/doctor/doctor.interface"
import { UpdateDoctorInput } from "@/app/api/doctor/doctor.validation"
import { api } from "@/lib/api/api"

export type UpdateDoctorResponse = {
  message: string
  data: IDoctor
}

export const updateDoctor = (doctorId: string, data: UpdateDoctorInput) => {
  return api<UpdateDoctorResponse>(`/api/doctor/${doctorId}`, {
    method: "PATCH",
    body: data,
  })
}
