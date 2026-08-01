import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  ADMIN_EMAIL: z.string().email("Invalid admin email"),

  ADMIN_PASS: z.string().min(6, "Admin password must be at least 6 characters"),

  SALT_ROUND: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value), "SALT_ROUND must be a number"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
})

export const ENV = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASS: process.env.ADMIN_PASS,
  SALT_ROUND: process.env.SALT_ROUND,
})
