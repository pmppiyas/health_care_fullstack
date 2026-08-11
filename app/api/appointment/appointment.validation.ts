import { z } from "zod"

import { AppointmentStatus, AppointmentType } from "./appointment.interface"

export const createAppointmentValidationSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  appointmentDate: z.coerce.date({
    message: "Valid appointment date is required",
  }),

  appointmentTime: z
    .string()
    .min(1, "Appointment time is required")
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Appointment time must be in HH:mm format"
    ),

  type: z.nativeEnum(AppointmentType),

  status: z.nativeEnum(AppointmentStatus).optional(),

  reason: z.string().max(500, "Reason cannot exceed 500 characters").optional(),

  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

export const updateAppointmentValidationSchema = z.object({
    patientId: z.string().min(1, "Patient ID is required").optional(),
    doctorId: z.string().min(1, "Doctor ID is required").optional(),
    appointmentDate: z.coerce.date().optional(),

    appointmentTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Appointment time must be in HH:mm format"
      )
      .optional(),

    type: z.nativeEnum(AppointmentType).optional(),

    status: z.nativeEnum(AppointmentStatus).optional(),

    reason: z
      .string()
      .max(500, "Reason cannot exceed 500 characters")
      .optional(),

    notes: z
      .string()
      .max(1000, "Notes cannot exceed 1000 characters")
      .optional(),
  })

export type CreateAppointmentInput = z.infer<
  typeof createAppointmentValidationSchema
>

export type UpdateAppointmentInput = z.infer<
  typeof updateAppointmentValidationSchema
>
