import { AppError } from "@/lib/error/AppError"
import { ZodError } from "zod"

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    }
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      message: "Validation Error",
      errors: error.flatten().fieldErrors,
    }
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message,
    }
  }

  return {
    statusCode: 500,
    message: "Something went wrong",
  }
}
