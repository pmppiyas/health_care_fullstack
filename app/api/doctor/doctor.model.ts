import mongoose, { Schema, model, models, Model } from "mongoose"
import { IDoctor, Specialization } from "./doctor.interface"

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required to link Doctor to a User account"],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      enum: {
        values: Object.values(Specialization),
        message: `Specialization must be one of: ${Object.values(Specialization).join(", ")}`,
      },
    },

    qualifications: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.every((q) => q.trim().length > 0),
        message: "Qualifications must not contain empty strings",
      },
    },

    hospital: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
      minlength: [2, "Hospital name must be at least 2 characters"],
      maxlength: [150, "Hospital name must not exceed 150 characters"],
    },

    department: {
      type: String,
      trim: true,
      maxlength: [100, "Department must not exceed 100 characters"],
    },

    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Years of experience cannot be negative"],
      max: [60, "Years of experience cannot exceed 60"],
    },

    consultationFee: {
      type: Number,
      min: [0, "Consultation fee cannot be negative"],
    },

    patientIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    photoUrl: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
)

doctorSchema.index({ specialization: 1 })
doctorSchema.index({ hospital: 1 })
doctorSchema.index({ patientIds: 1 })

doctorSchema.virtual("patientCount").get(function () {
  return this.patientIds?.length ?? 0
})

const Doctor: Model<IDoctor> =
  mongoose.models.Doctor ?? mongoose.model<IDoctor>("Doctor", doctorSchema)

export default Doctor
