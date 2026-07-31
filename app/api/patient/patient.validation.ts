import { z } from "zod"
import { Gender, BloodGroup, PatientStatus } from "./patient.interface"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number")

export const emergencyContactSchema = z.object({
  name: z
    .string({ required_error: "Emergency contact name is required" })
    .trim()
    .min(1, "Emergency contact name must not be empty"),

  relationship: z
    .string({ required_error: "Relationship is required" })
    .trim()
    .min(1, "Relationship must not be empty"),

  phone: phoneSchema,
})

const basePatientSchemaObject = z.object({
  userId: mongoIdSchema.describe(
    "ObjectId of the User account with role PATIENT"
  ),

  name: z
    .string({ required_error: "Patient name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  age: z
    .number({ required_error: "Age is required" })
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(150, "Age cannot exceed 150"),

  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
    required_error: "Gender is required",
    message: `Gender must be one of: ${Object.values(Gender).join(", ")}`,
  }),

  bloodGroup: z
    .enum(Object.values(BloodGroup) as [string, ...string[]], {
      message: `Blood group must be one of: ${Object.values(BloodGroup).join(", ")}`,
    })
    .optional(),

  phone: phoneSchema.optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .optional(),

  address: z
    .string()
    .trim()
    .max(250, "Address must not exceed 250 characters")
    .optional(),

  condition: z
    .string({ required_error: "Medical condition is required" })
    .trim()
    .min(2, "Condition must be at least 2 characters")
    .max(500, "Condition must not exceed 500 characters"),

  diagnosis: z
    .string()
    .trim()
    .max(1000, "Diagnosis must not exceed 1000 characters")
    .optional(),

  allergies: z.array(z.string().trim().min(1)).default([]),

  currentMedications: z.array(z.string().trim().min(1)).default([]),

  status: z
    .enum(Object.values(PatientStatus) as [string, ...string[]], {
      message: `Status must be one of: ${Object.values(PatientStatus).join(", ")}`,
    })
    .default(PatientStatus.ACTIVE),

  admissionDate: z.coerce.date({
    required_error: "Admission date is required",
    invalid_type_error: "Admission date must be a valid date",
  }),

  dischargeDate: z.coerce
    .date({ invalid_type_error: "Discharge date must be a valid date" })
    .optional(),

  emergencyContact: emergencyContactSchema.optional(),

  doctorIds: z
    .array(mongoIdSchema, {
      message: "Each doctorId must be a valid MongoDB ObjectId",
    })
    .default([]),

  photoUrl: z
    .string()
    .trim()
    .url("photoUrl must be a valid URL")
    .nullable()
    .optional(),
})

const dateValidationRefinement = (data: any) => {
  if (data.dischargeDate && data.admissionDate) {
    return data.dischargeDate >= data.admissionDate
  }
  return true
}

const dateValidationError = {
  message: "Discharge date must be on or after admission date",
  path: ["dischargeDate"],
}

const basePatientSchema = basePatientSchemaObject.refine(
  dateValidationRefinement,
  dateValidationError
)

export const createPatientSchema = basePatientSchema.refine(
  dateValidationRefinement,
  dateValidationError
)

export const updatePatientSchema = basePatientSchemaObject
  .omit({ userId: true })
  .partial()
  .refine(dateValidationRefinement, dateValidationError)

export const addDoctorToPatientSchema = z.object({
  doctorId: mongoIdSchema,
})

export const removeDoctorFromPatientSchema = z.object({
  doctorId: mongoIdSchema,
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>
export type AddDoctorToPatientInput = z.infer<typeof addDoctorToPatientSchema>
export type RemoveDoctorFromPatientInput = z.infer<
  typeof removeDoctorFromPatientSchema
>
