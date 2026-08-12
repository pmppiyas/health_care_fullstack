import mongoose, { Schema, model, models, Model } from "mongoose"
import {
  IPatient,
  IEmergencyContact,
  Gender,
  BloodGroup,
  PatientStatus,
} from "./patient.interface"

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: {
      type: String,
      required: [true, "Emergency contact name is required"],
      trim: true,
    },
    relationship: {
      type: String,
      required: [true, "Relationship to patient is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Emergency contact phone is required"],
      trim: true,
      match: [/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },
  },
  { _id: false }
)

const patientSchema = new Schema<IPatient>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required to link Patient to a User account"],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: Object.values(Gender),
        message: `Gender must be one of: ${Object.values(Gender).join(", ")}`,
      },
    },

    bloodGroup: {
      type: String,
      enum: {
        values: Object.values(BloodGroup),
        message: `Blood group must be one of: ${Object.values(BloodGroup).join(", ")}`,
      },
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    address: {
      type: String,
      trim: true,
      maxlength: [250, "Address must not exceed 250 characters"],
    },

    condition: {
      type: String,
      required: [true, "Medical condition is required"],
      trim: true,
      minlength: [2, "Condition must be at least 2 characters"],
      maxlength: [500, "Condition must not exceed 500 characters"],
    },

    diagnosis: {
      type: String,
      trim: true,
      maxlength: [1000, "Diagnosis must not exceed 1000 characters"],
    },

    allergies: {
      type: [String],
      default: [],
    },

    currentMedications: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      required: [true, "Patient status is required"],
      enum: {
        values: Object.values(PatientStatus),
        message: `Status must be one of: ${Object.values(PatientStatus).join(", ")}`,
      },
      default: PatientStatus.ACTIVE,
    },

    admissionDate: {
      type: Date,
      required: [true, "Admission date is required"],
    },

    dischargeDate: {
      type: Date,
      validate: {
        validator: function (this: IPatient, value: Date) {
          if (!value) return true
          return value >= this.admissionDate
        },
        message: "Discharge date must be on or after admission date",
      },
    },

    emergencyContact: {
      type: emergencyContactSchema,
    },

    doctorIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
      default: [],
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

patientSchema.index({ status: 1 })
patientSchema.index({ admissionDate: -1 })
patientSchema.index({ doctorIds: 1 })
patientSchema.index({ gender: 1 })

patientSchema.virtual("doctorCount").get(function () {
  return this.doctorIds?.length ?? 0
})

patientSchema.virtual("isAdmitted").get(function () {
  return !this.dischargeDate
})

const Patient: Model<IPatient> =
  models.Patient ?? model<IPatient>("Patient", patientSchema)

export default Patient
