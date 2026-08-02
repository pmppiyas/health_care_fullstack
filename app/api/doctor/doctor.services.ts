import { AppError } from "@/lib/error/AppError"
import Doctor from "./doctor.model"
import { CreateDoctorInput, UpdateDoctorInput } from "./doctor.validation"
import { AuthUser } from "@/interfaces/auth.interface"

const createDoctor = async (payload: CreateDoctorInput, user: AuthUser) => {
  const existingDoctor = await Doctor.findOne({
    $or: [{ email: payload.email }, { licenseNumber: payload.licenseNumber }],
  })

  if (existingDoctor) {
    throw new AppError(
      409,
      "Doctor with this email or license number already exists"
    )
  }

  const doctor = await Doctor.create(payload)

  return doctor
}

const getAllDoctors = async (query: Record<string, string | undefined>) => {
  const { search, specialization, hospital, page = "1", limit = "10" } = query

  const pageNumber = Math.max(Number(page), 1)
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100)

  const filter: Record<string, unknown> = {}

  if (specialization) {
    filter.specialization = specialization
  }

  if (hospital) {
    filter.hospital = hospital
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { hospital: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
    ]
  }

  const skip = (pageNumber - 1) * limitNumber

  const [doctors, total] = await Promise.all([
    Doctor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Doctor.countDocuments(filter),
  ])

  return {
    doctors,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

const getDoctorById = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId)

  if (!doctor) {
    throw new AppError(404, "Doctor not found")
  }

  return doctor
}

const updateDoctor = async (doctorId: string, payload: UpdateDoctorInput) => {
  const doctor = await Doctor.findByIdAndUpdate(doctorId, payload, {
    new: true,
    runValidators: true,
  })

  if (!doctor) {
    throw new AppError(404, "Doctor not found")
  }

  return doctor
}

const deleteDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findByIdAndDelete(doctorId)

  if (!doctor) {
    throw new AppError(404, "Doctor not found")
  }

  return doctor
}

export const DoctorService = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
}
