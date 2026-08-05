import { z } from "zod"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number")

export const createDoctorSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  name: z.string().min(2, "Doctor name must be at least 2 characters"),

  specialization: z.string().min(2, "Specialization is required"),

  hospital: z.string().min(2, "Hospital is required"),

  licenseNumber: z.string().min(2, "License number is required"),

  phone: phoneSchema,

  email: z.string().email("Invalid email address"),

  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .max(60, "Years of experience cannot exceed 60"),

  qualifications: z.array(z.string()).default([]),

  patientIds: z.array(mongoIdSchema).default([]),

  isAvailable: z.boolean().default(true),

  department: z.string().optional(),

  consultationFee: z.number().min(0).optional(),

  photoUrl: z.string().optional(),
})

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>

export const updateDoctorSchema = createDoctorSchema
  .omit({ password: true })
  .partial()

export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>

export const addPatientToDoctorSchema = z.object({
  patientId: mongoIdSchema,
})

export type AddPatientToDoctorInput = z.infer<typeof addPatientToDoctorSchema>

export const removePatientFromDoctorSchema = z.object({
  patientId: mongoIdSchema,
})

export type RemovePatientFromDoctorInput = z.infer<
  typeof removePatientFromDoctorSchema
>
