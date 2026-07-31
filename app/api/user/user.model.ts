import mongoose, { Schema, model, models, Model } from "mongoose"
import { IUser, Role } from "./user.interface"

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: Object.values(Role),
        message: `Role must be one of: ${Object.values(Role).join(", ")}`,
      },
      required: [true, "Role is required"],
    },

    photoUrl: {
      type: String,
      trim: true,
      default: null,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ adminId: 1 }, { sparse: true })
userSchema.index({ doctorId: 1 }, { sparse: true })
userSchema.index({ patientId: 1 }, { sparse: true })

userSchema.pre("save", async function () {
  if (this.role === Role.ADMIN && (this.doctorId || this.patientId)) {
    throw new Error(
      "An ADMIN user must not have a doctorId or patientId assigned"
    )
  }

  if (this.role === Role.DOCTOR && this.patientId) {
    throw new Error("A DOCTOR user must not have a patientId assigned")
  }

  if (this.role === Role.PATIENT && this.doctorId) {
    throw new Error("A PATIENT user must not have a doctorId assigned")
  }
})

const User: Model<IUser> = models.User ?? model<IUser>("User", userSchema)

export default User
