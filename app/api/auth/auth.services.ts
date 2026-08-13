import { StatusCodes } from "http-status-codes"
import User from "@/app/api/user/user.model"
import Admin from "@/app/api/admin/admin.model"
import Doctor from "@/app/api/doctor/doctor.model"
import Patient from "@/app/api/patient/patient.model"
import { comparePassword, hashPassword } from "@/lib/auth/password"
import { LoginInput } from "@/app/api/auth/auth.validation"
import { AppError } from "@/lib/error/AppError"
import { Role, UserStatus } from "@/app/api/user/user.interface"
import { createAccessToken } from "@/lib/token/createToken"
import { AuthUser } from "@/interfaces/auth.interface"

const loginUser = async (data: LoginInput) => {
  const user = await User.findOne({
    email: data.email,
  }).select("+password")

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not found")
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account is not active")
  }

  const isPasswordMatched = await comparePassword(data.password, user.password)

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Password is Incorrect")
  }

  const accessToken = createAccessToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  })

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl ?? null,
    },
  }
}

const getMe = async (authUser: AuthUser) => {
  const user = await User.findById(authUser.id)
    .select("name email role photoUrl status adminId doctorId patientId")
    .populate("adminId")
    .populate("doctorId")
    .populate("patientId")
    .lean()

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found")
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account is not active")
  }

  return user
}

const updateMyProfile = async (authUser: AuthUser, payload: any) => {
  const user = await User.findById(authUser.id).select("+password")
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found")
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account is not active")
  }

  const { name, photoUrl, password, ...roleFields } = payload

  // Update base User
  if (name) user.name = name
  if (photoUrl !== undefined) user.photoUrl = photoUrl
  if (password) {
    user.password = await hashPassword(password)
  }

  await user.save()

  // Update role-specific profile document
  if (user.role === Role.ADMIN) {
    await Admin.findOneAndUpdate(
      { userId: user._id },
      {
        name: user.name,
        photoUrl: user.photoUrl,
        phone: roleFields.phone,
        designation: roleFields.designation,
      },
      { new: true, runValidators: true }
    )
  } else if (user.role === Role.DOCTOR) {
    await Doctor.findOneAndUpdate(
      { userId: user._id },
      {
        name: user.name,
        photoUrl: user.photoUrl,
        phone: roleFields.phone,
        specialization: roleFields.specialization,
        qualifications: roleFields.qualifications,
        hospital: roleFields.hospital,
        department: roleFields.department,
        licenseNumber: roleFields.licenseNumber,
        yearsOfExperience: roleFields.yearsOfExperience,
        consultationFee: roleFields.consultationFee,
        isAvailable: roleFields.isAvailable,
      },
      { new: true, runValidators: true }
    )
  } else if (user.role === Role.PATIENT) {
    await Patient.findOneAndUpdate(
      { userId: user._id },
      {
        name: user.name,
        photoUrl: user.photoUrl,
        phone: roleFields.phone,
        address: roleFields.address,
        condition: roleFields.condition,
        diagnosis: roleFields.diagnosis,
        allergies: roleFields.allergies,
        currentMedications: roleFields.currentMedications,
        status: roleFields.status,
        gender: roleFields.gender,
        bloodGroup: roleFields.bloodGroup,
        admissionDate: roleFields.admissionDate,
        dischargeDate: roleFields.dischargeDate,
        emergencyContact: roleFields.emergencyContact,
      },
      { new: true, runValidators: true }
    )
  }

  // Return fresh populated user
  return await getMe(authUser)
}

export const AuthService = {
  loginUser,
  getMe,
  updateMyProfile,
}
