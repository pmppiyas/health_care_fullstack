import mongoose from "mongoose"
import bcrypt from "bcrypt"

import User from "@/app/api/user/user.model"
import Admin from "@/app/api/admin/admin.model"

import { ENV } from "@/config/env.config"
import { Role } from "@/app/api/user/user.interface"

const seedAdmin = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI)

    console.log("✅ MongoDB Connected")

    await User.init()
    await Admin.init()

    await mongoose.connection.transaction(async (session) => {
      const existingUser = await User.findOne({
        email: ENV.ADMIN_EMAIL,
      }).session(session)

      if (existingUser) {
        throw new Error(`Admin user already exists: ${ENV.ADMIN_EMAIL}`)
      }

      const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASS, ENV.SALT_ROUND)

      const [user] = await User.create(
        [
          {
            name: "Super Admin",
            email: ENV.ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.ADMIN,
            isActive: true,
          },
        ],
        { session }
      )

      const [admin] = await Admin.create(
        [
          {
            userId: user._id,
            name: "Super Admin",
            email: ENV.ADMIN_EMAIL,
            isSuperAdmin: true,
          },
        ],
        { session }
      )

      return {
        userId: user._id,
        adminId: admin._id,
        email: admin.email,
      }
    })

    console.log("✅ Super Admin Created Successfully")
  } catch (error) {
    console.error("❌ Seed Error:", error)

    process.exitCode = 1
  } finally {
    await mongoose.disconnect()

    console.log("🔌 MongoDB Disconnected")
  }
}

seedAdmin()
