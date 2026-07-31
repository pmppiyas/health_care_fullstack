import { z } from "zod"
import { Role } from "./user.interface"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")
  .optional()
  .nullable()

export const createUserSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    role: z.enum([Role.ADMIN, Role.DOCTOR, Role.PATIENT], {
      required_error: "Role is required",
      message: `Role must be one of: ${Object.values(Role).join(", ")}`,
    }),

    photoUrl: z
      .string()
      .trim()
      .url("photoUrl must be a valid URL")
      .nullable()
      .optional(),
  })
  .strip()

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address")
      .optional(),

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
      )
      .optional(),

    isActive: z.boolean().optional(),

    photoUrl: z
      .string()
      .trim()
      .url("photoUrl must be a valid URL")
      .nullable()
      .optional(),
  })
  .strip()

export const linkDoctorSchema = z.object({
  doctorId: mongoIdSchema.pipe(
    z.string().regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")
  ),
})

export const linkPatientSchema = z.object({
  patientId: mongoIdSchema.pipe(
    z.string().regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")
  ),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LinkDoctorInput = z.infer<typeof linkDoctorSchema>
export type LinkPatientInput = z.infer<typeof linkPatientSchema>
