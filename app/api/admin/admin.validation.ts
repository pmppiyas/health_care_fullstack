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
  userId: mongoIdSchema.describe(
    "ObjectId of the User account with role ADMIN"
  ),

  name: z
    .string({ required_error: "Admin name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string({ required_error: "Email is required" })
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
    .array(
      z.enum(Object.values(AdminPermission) as [string, ...string[]], {
        message: `Each permission must be one of: ${Object.values(AdminPermission).join(", ")}`,
      })
    )
    .min(1, "Admin must have at least one permission")
    .default([AdminPermission.VIEW_REPORTS]),

  isSuperAdmin: z.boolean().default(false),
})

export const updateAdminSchema = createAdminSchema
  .omit({ userId: true })
  .partial()

export const grantPermissionSchema = z.object({
  permission: z.enum(Object.values(AdminPermission) as [string, ...string[]], {
    message: `Permission must be one of: ${Object.values(AdminPermission).join(", ")}`,
  }),
})

export const revokePermissionSchema = grantPermissionSchema

export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>
export type GrantPermissionInput = z.infer<typeof grantPermissionSchema>
export type RevokePermissionInput = z.infer<typeof revokePermissionSchema>
