import { z } from "zod"
import { AdminPermission } from "./admin.interface"

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId")

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number")

const photoUrlSchema = z
  .string()
  .trim()
  .url("photoUrl must be a valid URL")
  .nullable()
  .optional()

export const createAdminSchema = z.object({
  userId: mongoIdSchema,

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  phone: phoneSchema.optional(),

  photoUrl: photoUrlSchema,

  designation: z
    .string()
    .trim()
    .max(100, "Designation must not exceed 100 characters")
    .optional(),

  permissions: z
    .array(z.nativeEnum(AdminPermission))
    .min(1, "Admin must have at least one permission")
    .default([AdminPermission.VIEW_REPORTS]),

  isSuperAdmin: z.boolean().default(false),
})

export const updateAdminSchema = createAdminSchema
  .omit({ userId: true })
  .partial()

export const grantPermissionSchema = z.object({
  permission: z.nativeEnum(AdminPermission),
})

export const revokePermissionSchema = grantPermissionSchema

export type CreateAdminInput = z.infer<typeof createAdminSchema>

export type UpdateAdminInput = z.infer<typeof updateAdminSchema>

export type GrantPermissionInput = z.infer<typeof grantPermissionSchema>

export type RevokePermissionInput = z.infer<typeof revokePermissionSchema>
