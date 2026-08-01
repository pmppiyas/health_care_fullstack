import { Types } from "mongoose"

export enum DoctorPatientRelationship {
  PRIMARY = "Primary",
  SECONDARY = "Secondary",
  CONSULTANT = "Consultant",
}

export interface IDoctorPatient {
  doctorId: Types.ObjectId
  patientId: Types.ObjectId
  relationship: DoctorPatientRelationship
  assignedAt: Date
  createdAt?: Date
  updatedAt?: Date
}

export type IDoctorPatientCreateInput = Omit<
  IDoctorPatient,
  "createdAt" | "updatedAt"
>

export type IDoctorPatientUpdateInput = Partial<
  Pick<IDoctorPatient, "relationship">
>
