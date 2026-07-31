import { Types } from "mongoose"

export enum AdminPermission {
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_DOCTORS = "MANAGE_DOCTORS",
  MANAGE_PATIENTS = "MANAGE_PATIENTS",
  VIEW_REPORTS = "VIEW_REPORTS",
  SYSTEM_SETTINGS = "SYSTEM_SETTINGS",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IAdmin {
  userId: Types.ObjectId | string
  name: string
  email: string
  phone?: string
  photoUrl?: string | null
  designation?: string
  permissions: AdminPermission[]
  isSuperAdmin: boolean

  createdAt?: Date
  updatedAt?: Date
}

export type IAdminCreateInput = Omit<IAdmin, "createdAt" | "updatedAt">

export type IAdminUpdateInput = Partial<
  Omit<IAdmin, "userId" | "createdAt" | "updatedAt">
>
