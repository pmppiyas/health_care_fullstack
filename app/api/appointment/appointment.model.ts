import mongoose, { Schema } from "mongoose"

import {
  AppointmentStatus,
  AppointmentType,
  IAppointment,
} from "./appointment.interface"

const appointmentSchema = new Schema<IAppointment>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
      index: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
      index: true,
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      index: true,
    },

    appointmentTime: {
      type: String,
      required: [true, "Appointment time is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: {
        values: Object.values(AppointmentType),
        message: "Invalid appointment type",
      },
      required: [true, "Appointment type is required"],
    },

    status: {
      type: String,
      enum: {
        values: Object.values(AppointmentStatus),
        message: "Invalid appointment status",
      },
      default: AppointmentStatus.SCHEDULED,
      index: true,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

/**
 * Prevent double booking for the same doctor,
 * date and time.
 */
appointmentSchema.index(
  {
    doctorId: 1,
    appointmentDate: 1,
    appointmentTime: 1,
  },
  {
    unique: true,
  }
)

/**
 * Useful when fetching patient's appointment history.
 */
appointmentSchema.index({
  patientId: 1,
  appointmentDate: -1,
})

/**
 * Useful for doctor appointment listing.
 */
appointmentSchema.index({
  doctorId: 1,
  appointmentDate: -1,
})

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema)

export default Appointment
