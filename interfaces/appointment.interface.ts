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

export interface AppointmentDoctor {
  _id: string
  name: string
  specialization?: string
  hospital?: string
  phone?: string
  email?: string
}

export interface AppointmentPatient {
  _id: string
  name: string
  condition?: string
  status?: string
  phone?: string
  email?: string
}

export interface Appointment {
  _id: string

  doctorId: string | Types.ObjectId | AppointmentDoctor
  patientId: string | Types.ObjectId | AppointmentPatient

  appointmentDate: string | Date
  appointmentTime: string

  type: AppointmentType
  status: AppointmentStatus

  reason?: string
  notes?: string

  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface AppointmentMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AppointmentResponse {
  success: boolean
  statusCode: number
  message: string
  data: Appointment
}

export interface AppointmentListResponse {
  success: boolean
  statusCode: number
  message: string
  data: Appointment[]
  meta: AppointmentMeta
}

export interface AppointmentArrayResponse {
  success: boolean
  statusCode: number
  message: string
  data: Appointment[]
}

export interface CreateAppointmentInput {
  doctorId: string
  patientId: string
  appointmentDate: string
  appointmentTime: string
  type: AppointmentType
  status?: AppointmentStatus
  reason?: string
  notes?: string
}

export interface UpdateAppointmentInput {
  doctorId?: string
  patientId?: string
  appointmentDate?: string
  appointmentTime?: string
  type?: AppointmentType
  status?: AppointmentStatus
  reason?: string
  notes?: string
}
