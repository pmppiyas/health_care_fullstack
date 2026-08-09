import { Types } from "mongoose"
import Appointment from "./appointment.model"
import Doctor from "../doctor/doctor.model"
import Patient from "../patient/patient.model"
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.validation"
import { AppError } from "@/lib/error/AppError"
import { NextRequest } from "next/server"
import DoctorPatient from "@/app/api/doctor-patient/doctorPatient.model"

const createAppointment = async (payload: CreateAppointmentInput) => {
  const session = await Appointment.startSession()

  try {
    let appointment

    await session.withTransaction(async () => {
      const doctor = await Doctor.findById(payload.doctorId).session(session)

      if (!doctor) {
        throw new AppError(404, "Doctor not found")
      }

      const patient = await Patient.findById(payload.patientId).session(session)

      if (!patient) {
        throw new AppError(404, "Patient not found")
      }

      const assignment = await DoctorPatient.findOne({
        doctorId: payload.doctorId,
        patientId: payload.patientId,
      }).session(session)

      if (!assignment) {
        throw new AppError(400, "Patient is not assigned to this doctor")
      }

      const existingAppointment = await Appointment.findOne({
        doctorId: payload.doctorId,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,

        status: {
          $nin: ["Cancelled", "Completed"],
        },
      }).session(session)

      if (existingAppointment) {
        throw new AppError(
          409,
          "Doctor already has an appointment at this time"
        )
      }

      const [createdAppointment] = await Appointment.create(
        [
          {
            doctorId: new Types.ObjectId(payload.doctorId),
            patientId: new Types.ObjectId(payload.patientId),
            type: payload.type,
            appointmentDate: payload.appointmentDate,
            appointmentTime: payload.appointmentTime,
            status: payload.status ?? "Scheduled",
            reason: payload.reason,
            notes: payload.notes,
          },
        ],
        { session }
      )

      appointment = createdAppointment
    })

    return appointment
  } finally {
    await session.endSession()
  }
}

const getAllAppointments = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const page = Math.max(Number(searchParams.get("page") ?? "1"), 1)

  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? "10"), 1),
    100
  )

  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = {}

  const status = searchParams.get("status")
  const doctorId = searchParams.get("doctorId")
  const patientId = searchParams.get("patientId")

  if (status) {
    filter.status = status
  }

  if (doctorId) {
    filter.doctorId = doctorId
  }

  if (patientId) {
    filter.patientId = patientId
  }

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate({
        path: "doctorId",
        select: "name specialization hospital phone email",
      })
      .populate({
        path: "patientId",
        select: "name condition status phone email",
      })
      .sort({ scheduledAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Appointment.countDocuments(filter),
  ])

  return {
    appointments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const getAppointmentById = async (appointmentId: string) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: "doctorId",
      select: "name specialization hospital phone email",
    })
    .populate({
      path: "patientId",
      select: "name condition status phone email",
    })

  if (!appointment) {
    throw new AppError(404, "Appointment not found")
  }

  return appointment
}

const getAppointmentsByDoctor = async (doctorId: string, req: NextRequest) => {
  const doctor = await Doctor.findById(doctorId).select(
    "_id name specialization"
  )

  if (!doctor) {
    throw new AppError(404, "Doctor not found")
  }

  const searchParams = req.nextUrl.searchParams
  const status = searchParams.get("status")

  const filter: Record<string, unknown> = {
    doctorId,
  }

  if (status) {
    filter.status = status
  }

  return Appointment.find(filter)
    .populate({
      path: "patientId",
      select: "name condition status phone email",
    })
    .sort({ scheduledAt: -1 })
    .lean()
}

const getAppointmentsByPatient = async (
  patientId: string,
  req: NextRequest
) => {
  const patient = await Patient.findById(patientId).select(
    "_id name condition status"
  )

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  const searchParams = req.nextUrl.searchParams
  const status = searchParams.get("status")

  const filter: Record<string, unknown> = {
    patientId,
  }

  if (status) {
    filter.status = status
  }

  return Appointment.find(filter)
    .populate({
      path: "doctorId",
      select: "name specialization hospital phone email",
    })
    .sort({ scheduledAt: -1 })
    .lean()
}

const updateAppointment = async (
  appointmentId: string,
  payload: UpdateAppointmentInput
) => {
  const appointment = await Appointment.findById(appointmentId)

  if (!appointment) {
    throw new AppError(404, "Appointment not found")
  }

  const doctorId = appointment.doctorId.toString()

  const patientId = appointment.patientId.toString()

  if (payload.doctorId || payload.patientId) {
    const assignment = await DoctorPatient.findOne({
      doctorId,
      patientId,
    })

    if (!assignment) {
      throw new AppError(400, "Patient is not assigned to this doctor")
    }
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      ...(payload.doctorId && {
        doctorId: new Types.ObjectId(payload.doctorId),
      }),

      ...(payload.patientId && {
        patientId: new Types.ObjectId(payload.patientId),
      }),

      ...(payload.type && {
        type: payload.type,
      }),

      ...(payload.appointmentDate && {
        appointmentDate: payload.appointmentDate,
      }),

      ...(payload.appointmentTime && {
        appointmentTime: payload.appointmentTime,
      }),

      ...(payload.status && {
        status: payload.status,
      }),

      ...(payload.reason !== undefined && {
        reason: payload.reason,
      }),

      ...(payload.notes !== undefined && {
        notes: payload.notes,
      }),
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "doctorId",
      select: "name specialization hospital phone email",
    })
    .populate({
      path: "patientId",
      select: "name condition status phone email",
    })

  if (!updatedAppointment) {
    throw new AppError(404, "Appointment not found")
  }

  return updatedAppointment
}

const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "doctorId",
      select: "name specialization",
    })
    .populate({
      path: "patientId",
      select: "name condition status",
    })

  if (!appointment) {
    throw new AppError(404, "Appointment not found")
  }

  return appointment
}

const cancelAppointment = async (appointmentId: string) => {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      status: "Cancelled",
    },
    {
      new: true,
      runValidators: true,
    }
  )

  if (!appointment) {
    throw new AppError(404, "Appointment not found")
  }

  return appointment
}

const deleteAppointment = async (appointmentId: string) => {
  const appointment = await Appointment.findByIdAndDelete(appointmentId)

  if (!appointment) {
    throw new AppError(404, "Appointment not found")
  }

  return appointment
}

export const AppointmentService = {
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
