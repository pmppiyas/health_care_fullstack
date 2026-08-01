import { z } from "zod"
import { DoctorPatientRelationship } from "./doctorPatient.interface"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")

export const createDoctorPatientSchema = z.object({
  patientId: mongoIdSchema,

  relationship: z.nativeEnum(DoctorPatientRelationship, {
    required_error: "Relationship is required",
  }),

  assignedAt: z.coerce.date().optional(),
})

export const updateDoctorPatientSchema = z.object({
  relationship: z.nativeEnum(DoctorPatientRelationship).optional(),
})

export type CreateDoctorPatientInput = z.infer<typeof createDoctorPatientSchema>

export type UpdateDoctorPatientInput = z.infer<typeof updateDoctorPatientSchema>
