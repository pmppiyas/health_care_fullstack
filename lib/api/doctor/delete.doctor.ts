import { api } from "@/lib/api/api"

export type DeleteDoctorResponse = {
  message: string
}

export const deleteDoctor = (doctorId: string) => {
  return api<DeleteDoctorResponse>(`/api/doctor/${doctorId}`, {
    method: "DELETE",
  })
}
