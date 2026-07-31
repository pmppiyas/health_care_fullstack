import { Types } from "mongoose"

export enum Specialization {
  GENERAL_PRACTICE = "General Practice",
  CARDIOLOGY = "Cardiology",
  DERMATOLOGY = "Dermatology",
  ENDOCRINOLOGY = "Endocrinology",
  GASTROENTEROLOGY = "Gastroenterology",
  NEUROLOGY = "Neurology",
  ONCOLOGY = "Oncology",
  ORTHOPEDICS = "Orthopedics",
  PEDIATRICS = "Pediatrics",
  PSYCHIATRY = "Psychiatry",
  RADIOLOGY = "Radiology",
  SURGERY = "Surgery",
  UROLOGY = "Urology",
  OTHER = "Other",
}

export interface IDoctor {
  userId: Types.ObjectId | string
  name: string
  specialization: Specialization | string
  qualifications: string[]
  hospital: string
  department?: string
  licenseNumber: string
  phone: string
  email: string
  yearsOfExperience: number
  consultationFee?: number
  patientIds: Array<Types.ObjectId | string>
  isAvailable: boolean
  photoUrl?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type IDoctorCreateInput = Omit<
  IDoctor,
  "patientIds" | "createdAt" | "updatedAt"
> & { patientIds?: Array<string> }

export type IDoctorUpdateInput = Partial<
  Omit<IDoctor, "userId" | "createdAt" | "updatedAt">
>
