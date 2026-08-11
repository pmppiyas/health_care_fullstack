import { Types } from "mongoose"

export enum AppointmentStatus {
  SCHEDULED = "Scheduled",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  NO_SHOW = "No Show",
}

export enum AppointmentType {
  CONSULTATION = "Consultation",
  FOLLOW_UP = "Follow-up",
  EMERGENCY = "Emergency",
}

export interface IAppointment {
  doctorId: Types.ObjectId
  patientId: Types.ObjectId

  appointmentDate: Date
  appointmentTime: string

  type: AppointmentType
  status: AppointmentStatus

  reason?: string
  notes?: string

  createdAt?: Date
  updatedAt?: Date
}

export type IAppointmentCreateInput = Omit<
  IAppointment,
  "status" | "createdAt" | "updatedAt"
> & {
  status?: AppointmentStatus
}

export type IAppointmentUpdateInput = Partial<
  Pick<
    IAppointment,
    | "appointmentDate"
    | "appointmentTime"
    | "type"
    | "status"
    | "reason"
    | "notes"
  >
>
