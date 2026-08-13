import { Schema, model, models } from "mongoose"
import { IPrescription } from "./prescription.interface"

const medicineSchema = new Schema(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    route: { type: String, required: true },
    instructions: { type: String, required: true },
  },
  { _id: false }
)

const prescriptionSchema = new Schema<IPrescription>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true, index: true },
    diagnosis: { type: String, required: true },
    medicines: { type: [medicineSchema], required: true },
    notes: { type: String },
    followUpDate: { type: Date },
  },
  {
    timestamps: true,
  }
)

const Prescription = models.Prescription || model<IPrescription>("Prescription", prescriptionSchema)

export default Prescription
