import { NextRequest } from "next/server"
import { CreateDoctorInput, updateDoctorSchema } from "./doctor.validation"
import { sendResponse } from "@/lib/utils/sendResponse"
import { DoctorService } from "@/app/api/doctor/doctor.services"
import { StatusCodes } from "http-status-codes"
import { AuthUser } from "@/interfaces/auth.interface"

const createDoctor = async (data: CreateDoctorInput, user: AuthUser) => {
  const doctor = await DoctorService.createDoctor(data, user)

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  })
}

const getAllDoctors = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const query = Object.fromEntries(searchParams.entries())

  const result = await DoctorService.getAllDoctors(query)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: result.doctors,
    meta: result.meta,
  })
}

const getDoctorById = async (req: NextRequest, doctorId: string) => {
  const doctor = await DoctorService.getDoctorById(doctorId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: doctor,
  })
}

const updateDoctor = async (req: NextRequest, doctorId: string) => {
  const body = await req.json()

  const payload = updateDoctorSchema.parse(body)

  const doctor = await DoctorService.updateDoctor(doctorId, payload)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor updated successfully",
    data: doctor,
  })
}

const deleteDoctor = async (req: NextRequest, doctorId: string) => {
  await DoctorService.deleteDoctor(doctorId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor deleted successfully",
  })
}

export const DoctorController = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
}
