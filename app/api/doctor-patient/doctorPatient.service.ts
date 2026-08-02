import mongoose, { Types } from "mongoose"
import DoctorPatient from "./doctorPatient.model"
import Doctor from "../doctor/doctor.model"
import Patient from "../patient/patient.model"
import {
  CreateDoctorPatientInput,
  UpdateDoctorPatientInput,
} from "./doctorPatient.validation"
import { AppError } from "@/lib/error/AppError"
import { NextRequest } from "next/server"

const assignPatientToDoctor = async (
  doctorId: string,
  payload: CreateDoctorPatientInput
) => {
  const session = await mongoose.startSession()

  try {
    let assignment

    await session.withTransaction(async () => {
      const doctor = await Doctor.findById(doctorId).session(session)

      if (!doctor) {
        throw new AppError(404, "Doctor not found")
      }

      const patient = await Patient.findById(payload.patientId).session(session)

      if (!patient) {
        throw new AppError(404, "Patient not found")
      }

      const existingAssignment = await DoctorPatient.findOne({
        doctorId,
        patientId: payload.patientId,
      }).session(session)

      if (existingAssignment) {
        throw new AppError(
          409,
          "This patient is already assigned to this doctor"
        )
      }

      const [createdAssignment] = await DoctorPatient.create(
        [
          {
            doctorId: new Types.ObjectId(doctorId),
            patientId: new Types.ObjectId(payload.patientId),
            relationship: payload.relationship,
            assignedAt: payload.assignedAt ?? new Date(),
          },
        ],
        {
          session,
        }
      )

      assignment = createdAssignment
    })

    return assignment
  } finally {
    await session.endSession()
  }
}

const getPatientsByDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId).select("_id name")

  if (!doctor) {
    throw new AppError(404, "Doctor not found")
  }

  const assignments = await DoctorPatient.find({
    doctorId,
  })
    .populate({
      path: "patientId",
      select: "name email phone condition",
    })
    .sort({ assignedAt: -1 })
    .lean()

  return assignments
}

const getDoctorsByPatient = async (patientId: string) => {
  const patient = await Patient.findById(patientId).select("_id name")

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  const assignments = await DoctorPatient.find({
    patientId,
  })
    .populate({
      path: "doctorId",
      select: "name specialization hospital phone email",
    })
    .sort({ assignedAt: -1 })
    .lean()

  return assignments
}

const updateDoctorPatient = async (
  assignmentId: string,
  payload: UpdateDoctorPatientInput
) => {
  const assignment = await DoctorPatient.findByIdAndUpdate(
    assignmentId,
    {
      relationship: payload.relationship,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("doctorId")
    .populate("patientId")

  if (!assignment) {
    throw new AppError(404, "Doctor-patient assignment not found")
  }

  return assignment
}

const removePatientFromDoctor = async (doctorId: string, patientId: string) => {
  const assignment = await DoctorPatient.findOneAndDelete({
    doctorId,
    patientId,
  })

  if (!assignment) {
    throw new AppError(404, "Doctor-patient assignment not found")
  }

  return assignment
}

const getAllAssignments = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const page = Math.max(Number(searchParams.get("page") ?? "1"), 1)
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "10"), 1), 100)
  const skip = (page - 1) * limit

  const [assignments, total] = await Promise.all([
    DoctorPatient.find()
      .populate({ path: "doctorId", select: "name specialization hospital" })
      .populate({ path: "patientId", select: "name condition status" })
      .sort({ assignedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    DoctorPatient.countDocuments(),
  ])

  return {
    assignments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const getAssignmentById = async (assignmentId: string) => {
  const assignment = await DoctorPatient.findById(assignmentId)
    .populate({ path: "doctorId", select: "name specialization hospital phone email" })
    .populate({ path: "patientId", select: "name condition status phone email" })

  if (!assignment) {
    throw new AppError(404, "Doctor-patient assignment not found")
  }

  return assignment
}

const deleteAssignment = async (assignmentId: string) => {
  const assignment = await DoctorPatient.findByIdAndDelete(assignmentId)

  if (!assignment) {
    throw new AppError(404, "Doctor-patient assignment not found")
  }

  return assignment
}

export const DoctorPatientService = {
  assignPatientToDoctor,
  getPatientsByDoctor,
  getDoctorsByPatient,
  updateDoctorPatient,
  removePatientFromDoctor,
  getAllAssignments,
  getAssignmentById,
  deleteAssignment,
}
