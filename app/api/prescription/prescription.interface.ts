import { Types } from "mongoose"

export interface IMedicine {
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  route: string
  instructions: string
}

export interface IPrescription {
  doctorId: Types.ObjectId
  patientId: Types.ObjectId
  appointmentId: Types.ObjectId
  diagnosis: string
  medicines: IMedicine[]
  notes?: string
  followUpDate?: Date
  createdAt?: Date
  updatedAt?: Date
}
