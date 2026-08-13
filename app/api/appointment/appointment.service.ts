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
import { AppointmentStatus } from "@/interfaces/appointment.interface"

const createAppointment = async (payload: CreateAppointmentInput) => {
  const doctor = await Doctor.findById(payload.doctorId)

  if (!doctor) {
    throw new AppError(404, "Doctor not found")
  }

  const patient = await Patient.findById(payload.patientId)

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  const existingAppointment = await Appointment.findOne({
    doctorId: payload.doctorId,
    appointmentDate: payload.appointmentDate,
    appointmentTime: payload.appointmentTime,
    status: {
      $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
    },
  })

  if (existingAppointment) {
    throw new AppError(409, "Doctor already has an appointment at this time")
  }

  const appointment = await Appointment.create({
    doctorId: new Types.ObjectId(payload.doctorId),
    patientId: new Types.ObjectId(payload.patientId),
    appointmentDate: payload.appointmentDate,
    appointmentTime: payload.appointmentTime,
    type: payload.type,
    status: payload.status ?? AppointmentStatus.SCHEDULED,
    reason: payload.reason,
    notes: payload.notes,
  })

  return appointment
}

const getAllAppointments = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const page = Math.max(Number(searchParams.get("page") ?? "1"), 1)
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? "10"), 1),
    100
  )
  const skip = (page - 1) * limit

  const status = searchParams.get("status")
  const search = searchParams.get("search")?.trim()
  const doctorIdParam = searchParams.get("doctorId")
  const patientIdParam = searchParams.get("patientId")
  const userIdParam = searchParams.get("userId")

  let resolvedDoctorId = doctorIdParam
  if (!resolvedDoctorId && userIdParam) {
    const doctor = await Doctor.findOne({ userId: userIdParam }).select("_id")
    if (doctor) {
      resolvedDoctorId = doctor._id.toString()
    }
  }

  // Pre-lookup match stage for doctorId/patientId filtering (before $lookup)
  const preLookupMatch: Record<string, unknown> = {}
  if (resolvedDoctorId && Types.ObjectId.isValid(resolvedDoctorId)) {
    preLookupMatch.doctorId = new Types.ObjectId(resolvedDoctorId)
  }
  if (patientIdParam && Types.ObjectId.isValid(patientIdParam)) {
    preLookupMatch.patientId = new Types.ObjectId(patientIdParam)
  }

  const pipeline: Record<string, unknown>[] = [
    ...(Object.keys(preLookupMatch).length > 0
      ? [{ $match: preLookupMatch }]
      : []),
    // 1. Join doctor
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctorId",
        pipeline: [
          {
            $project: {
              name: 1,
              specialization: 1,
              hospital: 1,
              phone: 1,
              email: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$doctorId", preserveNullAndEmptyArrays: true } },

    // 2. Join patient
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "patientId",
        pipeline: [
          {
            $project: { name: 1, condition: 1, status: 1, phone: 1, email: 1 },
          },
        ],
      },
    },
    { $unwind: { path: "$patientId", preserveNullAndEmptyArrays: true } },
  ]

  // 3. Filter by status
  const matchStage: Record<string, unknown> = {}
  if (status) matchStage.status = status

  // 4. Filter by search (doctor name OR patient name)
  if (search) {
    matchStage.$or = [
      { "doctorId.name": { $regex: search, $options: "i" } },
      { "patientId.name": { $regex: search, $options: "i" } },
    ]
  }

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage })
  }

  // 5. Count total (before pagination)
  const countPipeline = [...pipeline, { $count: "total" }]

  // 6. Sort + paginate
  pipeline.push({ $sort: { createdAt: -1 } })
  pipeline.push({ $skip: skip })
  pipeline.push({ $limit: limit })

  const [appointments, countResult] = await Promise.all([
    Appointment.aggregate(pipeline as any),
    Appointment.aggregate(countPipeline as any),
  ])

  const total = (countResult[0] as { total?: number } | undefined)?.total ?? 0

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
