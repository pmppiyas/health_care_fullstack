import { NextRequest } from "next/server"
import { CreatePatientInput, UpdatePatientInput } from "./patient.validation"
import { sendResponse } from "@/lib/utils/sendResponse"
import { PatientService } from "./patient.services"
import { StatusCodes } from "http-status-codes"
import { AuthUser } from "@/interfaces/auth.interface"

const createPatient = async (data: CreatePatientInput, user: AuthUser) => {
  const patient = await PatientService.createPatient(data, user)

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Patient created successfully",
    data: patient,
  })
}

const getAllPatients = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const query = Object.fromEntries(searchParams.entries())

  const result = await PatientService.getAllPatients(query)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients retrieved successfully",
    data: result.patients,
    meta: result.meta,
  })
}

const getPatientById = async (req: NextRequest, patientId: string) => {
  const patient = await PatientService.getPatientById(patientId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient retrieved successfully",
    data: patient,
  })
}

const updatePatient = async (
  patientId: string,
  data: UpdatePatientInput,
  user: AuthUser,
) => {
  const patient = await PatientService.updatePatient(patientId, data)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient updated successfully",
    data: patient,
  })
}

const deletePatient = async (req: NextRequest, patientId: string) => {
  await PatientService.deletePatient(patientId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted successfully",
  })
}

const getDoctorsByPatient = async (req: NextRequest, patientId: string) => {
  const doctors = await PatientService.getDoctorsByPatient(patientId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: doctors,
  })
}

export const PatientController = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getDoctorsByPatient,
}
