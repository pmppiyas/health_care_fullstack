import { z } from "zod"
import { Specialization } from "./doctor.interface"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number")

export const createDoctorSchema = z.object({
  userId: mongoIdSchema.describe(
    "ObjectId of the User account with role DOCTOR"
  ),

  name: z
    .string({ required_error: "Doctor name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  specialization: z.enum(
    Object.values(Specialization) as [string, ...string[]],
    {
      required_error: "Specialization is required",
      message: `Specialization must be one of: ${Object.values(Specialization).join(", ")}`,
    }
  ),

  qualifications: z
    .array(
      z.string().trim().min(1, "Each qualification must be a non-empty string")
    )
    .min(1, "At least one qualification is required")
    .default([]),

  hospital: z
    .string({ required_error: "Hospital name is required" })
    .trim()
    .min(2, "Hospital name must be at least 2 characters")
    .max(150, "Hospital name must not exceed 150 characters"),

  department: z
    .string()
    .trim()
    .max(100, "Department must not exceed 100 characters")
    .optional(),

  licenseNumber: z
    .string({ required_error: "License number is required" })
    .trim()
    .min(1, "License number must not be empty")
    .toUpperCase(),

  phone: phoneSchema,

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  yearsOfExperience: z
    .number({ required_error: "Years of experience is required" })
    .int("Years of experience must be a whole number")
    .min(0, "Years of experience cannot be negative")
    .max(60, "Years of experience cannot exceed 60"),

  consultationFee: z
    .number()
    .min(0, "Consultation fee cannot be negative")
    .optional(),

  patientIds: z
    .array(mongoIdSchema, {
      message: "Each patientId must be a valid MongoDB ObjectId",
    })
    .default([]),

  isAvailable: z.boolean().default(true),

  photoUrl: z
    .string()
    .trim()
    .url("photoUrl must be a valid URL")
    .nullable()
    .optional(),
})

export const updateDoctorSchema = createDoctorSchema
  .omit({ userId: true })
  .partial()

export const addPatientToDoctorSchema = z.object({
  patientId: mongoIdSchema,
})

export const removePatientFromDoctorSchema = z.object({
  patientId: mongoIdSchema,
})

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>
export type AddPatientToDoctorInput = z.infer<typeof addPatientToDoctorSchema>
export type RemovePatientFromDoctorInput = z.infer<
  typeof removePatientFromDoctorSchema
>
