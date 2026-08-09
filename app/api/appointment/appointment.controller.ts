import { NextRequest } from "next/server"
import { StatusCodes } from "http-status-codes"

import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.validation"

import { AppointmentService } from "@/app/api/appointment/appointment.service"
import { sendResponse } from "@/lib/utils/sendResponse"

const createAppointment = async (data: CreateAppointmentInput) => {
  const appointment = await AppointmentService.createAppointment(data)

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Appointment created successfully",
    data: appointment,
  })
}

const getAllAppointments = async (req: NextRequest) => {
  const result = await AppointmentService.getAllAppointments(req)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointments retrieved successfully",
    data: result.appointments,
    meta: result.meta,
  })
}

const getAppointmentById = async (req: NextRequest, appointmentId: string) => {
  const appointment = await AppointmentService.getAppointmentById(appointmentId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment retrieved successfully",
    data: appointment,
  })
}

const getAppointmentsByDoctor = async (req: NextRequest, doctorId: string) => {
  const appointments = await AppointmentService.getAppointmentsByDoctor(
    doctorId,
    req
  )

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor appointments retrieved successfully",
    data: appointments,
  })
}

const getAppointmentsByPatient = async (
  req: NextRequest,
  patientId: string
) => {
  const appointments = await AppointmentService.getAppointmentsByPatient(
    patientId,
    req
  )

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient appointments retrieved successfully",
    data: appointments,
  })
}

const updateAppointment = async (
  appointmentId: string,
  data: UpdateAppointmentInput
) => {
  const appointment = await AppointmentService.updateAppointment(
    appointmentId,
    data
  )

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment updated successfully",
    data: appointment,
  })
}

const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  const appointment = await AppointmentService.updateAppointmentStatus(
    appointmentId,
    status
  )

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment status updated successfully",
    data: appointment,
  })
}

const cancelAppointment = async (req: NextRequest, appointmentId: string) => {
  const appointment = await AppointmentService.cancelAppointment(appointmentId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment cancelled successfully",
    data: appointment,
  })
}

const deleteAppointment = async (req: NextRequest, appointmentId: string) => {
  await AppointmentService.deleteAppointment(appointmentId)

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment deleted successfully",
  })
}

export const AppointmentController = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
}
