import { Types } from "mongoose"

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
}

export interface IUser {
  name: string
  email: string
  password: string
  role: Role
  photoUrl?: string | null | undefined

  adminId?: Types.ObjectId | string | null
  doctorId?: Types.ObjectId | string | null
  patientId?: Types.ObjectId | string | null

  status: UserStatus
  createdAt?: Date
  updatedAt?: Date
}

export type IUserCreateInput = Pick<
  IUser,
  "name" | "email" | "password" | "role"
>

export type IUserUpdateInput = Partial<
  Pick<IUser, "name" | "email" | "password" | "status">
>
