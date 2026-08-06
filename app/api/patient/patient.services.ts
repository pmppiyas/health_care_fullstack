import { AppError } from "@/lib/error/AppError"
import Patient from "./patient.model"
import DoctorPatient from "@/app/api/doctor-patient/doctorPatient.model"
import { CreatePatientInput, UpdatePatientInput } from "./patient.validation"
import { AuthUser } from "@/interfaces/auth.interface"
import User from "@/app/api/user/user.model"
import { Role } from "@/app/api/user/user.interface"
import { hashPassword } from "@/lib/auth/password"

const createPatient = async (payload: CreatePatientInput, _user: AuthUser) => {
  const { password, ...patientData } = payload

  const existingUser = await User.findOne({ email: payload.email })
  if (existingUser) {
    throw new AppError(409, "A user account with this email already exists")
  }

  const hashedPassword = await hashPassword(password)

  const newUser = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: Role.PATIENT,
    photoUrl: payload.photoUrl ?? null,
  })

  let patient
  try {
    patient = await Patient.create({
      ...patientData,
      userId: newUser._id,
    })
  } catch (error) {
    await User.findByIdAndDelete(newUser._id)
    throw error
  }

  await User.findByIdAndUpdate(newUser._id, { patientId: patient._id })

  return patient
}

const getAllPatients = async (query: Record<string, string | undefined>) => {
  const { search, status, gender, page = "1", limit = "10" } = query

  const pageNumber = Math.max(Number(page), 1)
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100)

  const filter: Record<string, unknown> = {}

  if (status) filter.status = status
  if (gender) filter.gender = gender

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { condition: { $regex: search, $options: "i" } },
    ]
  }

  const skip = (pageNumber - 1) * limitNumber

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Patient.countDocuments(filter),
  ])

  return {
    patients,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

const getPatientById = async (patientId: string) => {
  const patient = await Patient.findById(patientId)

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  return patient
}

const updatePatient = async (
  patientId: string,
  payload: UpdatePatientInput
) => {
  const patient = await Patient.findByIdAndUpdate(patientId, payload, {
    new: true,
    runValidators: true,
  })

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  return patient
}

const deletePatient = async (patientId: string) => {
  const patient = await Patient.findByIdAndDelete(patientId)

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  return patient
}

const getDoctorsByPatient = async (patientId: string) => {
  const patient = await Patient.findById(patientId).select("_id name")

  if (!patient) {
    throw new AppError(404, "Patient not found")
  }

  const assignments = await DoctorPatient.find({ patientId })
    .populate({
      path: "doctorId",
      select: "name specialization hospital phone email photoUrl",
    })
    .sort({ assignedAt: -1 })
    .lean()

  return assignments
}

export const PatientService = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getDoctorsByPatient,
}
