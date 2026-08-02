import mongoose, { Schema, Model } from "mongoose"
import {
  IDoctorPatient,
  DoctorPatientRelationship,
} from "./doctorPatient.interface"

const doctorPatientSchema = new Schema<IDoctorPatient>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },

    relationship: {
      type: String,
      enum: {
        values: Object.values(DoctorPatientRelationship),
        message: `Relationship must be one of: ${Object.values(
          DoctorPatientRelationship
        ).join(", ")}`,
      },
      default: DoctorPatientRelationship.CONSULTANT,
      required: [true, "Relationship is required"],
    },

    assignedAt: {
      type: Date,
      default: Date.now,
      required: [true, "Assigned date is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

doctorPatientSchema.index({ doctorId: 1, patientId: 1 }, { unique: true })

doctorPatientSchema.index({ doctorId: 1, assignedAt: -1 })

doctorPatientSchema.index({ patientId: 1, assignedAt: -1 })

const DoctorPatient: Model<IDoctorPatient> =
  mongoose.models.DoctorPatient ??
  mongoose.model<IDoctorPatient>("DoctorPatient", doctorPatientSchema)

export default DoctorPatient
