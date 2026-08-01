import { NextRequest } from "next/server"
import { createDoctorSchema, updateDoctorSchema } from "./doctor.validation"
import { sendResponse } from "@/lib/utils/sendResponse"
import { DoctorService } from "@/app/api/doctor/doctor.services"

export const createDoctor = async (req: NextRequest) => {
  const body = await req.json()

  const payload = createDoctorSchema.parse(body)

  const doctor = await DoctorService.createDoctor(payload)

  return sendResponse({
    statusCode: 201,
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  })
}

export const getAllDoctors = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const query = Object.fromEntries(searchParams.entries())

  const result = await DoctorService.getAllDoctors(query)

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Doctors retrieved successfully",
    data: result.doctors,
    meta: result.meta,
  })
}

export const getDoctorById = async (req: NextRequest, doctorId: string) => {
  const doctor = await DoctorService.getDoctorById(doctorId)

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Doctor retrieved successfully",
    data: doctor,
  })
}

export const updateDoctor = async (req: NextRequest, doctorId: string) => {
  const body = await req.json()

  const payload = updateDoctorSchema.parse(body)

  const doctor = await DoctorService.updateDoctor(doctorId, payload)

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Doctor updated successfully",
    data: doctor,
  })
}

export const deleteDoctor = async (req: NextRequest, doctorId: string) => {
  await DoctorService.deleteDoctor(doctorId)

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully",
  })
}
