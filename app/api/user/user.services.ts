import { AppError } from "@/lib/error/AppError"
import User from "./user.model"
import { UpdateUserInput } from "./user.validation"
import { UserStatus } from "./user.interface"

const getAllUsers = async (query: Record<string, string | undefined>) => {
  const { search, role, status, page = "1", limit = "10" } = query

  const pageNumber = Math.max(Number(page), 1)
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100)

  const filter: Record<string, unknown> = {}

  if (role) {
    filter.role = role
  }

  if (status) {
    filter.status = status
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
  }

  const skip = (pageNumber - 1) * limitNumber

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber).lean(),
    User.countDocuments(filter),
  ])

  return {
    users,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

const getUserById = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user
}

const updateUser = async (userId: string, payload: UpdateUserInput) => {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user
}

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId)

  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user
}

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  )

  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user
}

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
}
