import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  ADMIN_EMAIL: z.string().email("Invalid admin email"),

  ADMIN_PASS: z.string().min(6, "Admin password must be at least 6 characters"),

  SALT_ROUND: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value), "SALT_ROUND must be a number"),

  JWT_ACCESS_TOKEN: z.string().min(1, "JWT_ACCESS_TOKEN is required"),
  JWT_ACCESS_EXPIRED: z.string().min(1, "JWT_ACCESS_EXPIRED is required"),
})

export const ENV = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASS: process.env.ADMIN_PASS,
  SALT_ROUND: process.env.SALT_ROUND,
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
  JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED,
})
