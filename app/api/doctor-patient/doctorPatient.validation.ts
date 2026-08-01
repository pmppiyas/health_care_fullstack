import { z } from "zod"

import { DoctorPatientRelationship } from "./doctorPatient.interface"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")

export const createDoctorPatientSchema = z.object({
  patientId: mongoIdSchema,

  relationship: z
    .enum(Object.values(DoctorPatientRelationship) as [string, ...string[]])
    .default(DoctorPatientRelationship.CONSULTING),

  assignedAt: z.coerce.date().optional(),
})

export const updateDoctorPatientSchema = z.object({
  relationship: z.enum(
    Object.values(DoctorPatientRelationship) as [string, ...string[]]
  ),
})

export type CreateDoctorPatientInput = z.infer<typeof createDoctorPatientSchema>

export type UpdateDoctorPatientInput = z.infer<typeof updateDoctorPatientSchema>
