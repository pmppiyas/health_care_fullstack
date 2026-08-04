import { Types } from "mongoose"

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export enum PatientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCHARGED = "DISCHARGED",
}

export interface IEmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface IPatient {
  userId: Types.ObjectId
  name: string
  age: number
  gender: Gender
  bloodGroup?: BloodGroup
  phone?: string
  email?: string
  address?: string
  condition: string
  diagnosis?: string
  allergies: string[]
  currentMedications: string[]
  status: PatientStatus
  admissionDate: Date
  dischargeDate?: Date
  emergencyContact?: IEmergencyContact
  doctorIds: Types.ObjectId[]
  photoUrl?: string | null
}

export type IPatientCreateInput = Omit<
  IPatient,
  "doctorIds" | "createdAt" | "updatedAt"
> & { doctorIds?: Array<string> }

export type IPatientUpdateInput = Partial<
  Omit<IPatient, "userId" | "createdAt" | "updatedAt">
>
