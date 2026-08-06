"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2, Users, UserCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useCreatePATIENTMutation,
  useUpdatePATIENTMutation,
} from "@/redux/features/patient.api"
import { PatientWithId } from "@/interfaces/patient.interface"
import {
  Gender,
  BloodGroup,
  PatientStatus,
} from "@/app/api/patient/patient.interface"
import {
  createPatientSchema,
  updatePatientSchema,
  CreatePatientInput,
} from "@/app/api/patient/patient.validation"

export type PatientFormMode = "add" | "edit"

interface PatientFormModalProps {
  open: boolean
  mode: PatientFormMode
  patient?: PatientWithId
  onClose: () => void
  onSuccess: () => void
}

type FormState = {
  name: string
  age: string
  gender: string
  bloodGroup: string
  phone: string
  email: string
  password: string
  address: string
  condition: string
  diagnosis: string
  allergies: string
  currentMedications: string
  status: string
  admissionDate: string
  dischargeDate: string
  ecName: string
  ecRelationship: string
  ecPhone: string
  photoUrl: string
}

function toDateInputValue(d?: Date | string) {
  if (!d) return ""
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ""
  return dt.toISOString().slice(0, 10)
}

const EMPTY_FORM: FormState = {
  name: "",
  age: "",
  gender: Gender.MALE,
  bloodGroup: "",
  phone: "",
  email: "",
  password: "",
  address: "",
  condition: "",
  diagnosis: "",
  allergies: "",
  currentMedications: "",
  status: PatientStatus.ACTIVE,
  admissionDate: toDateInputValue(new Date()),
  dischargeDate: "",
  ecName: "",
  ecRelationship: "",
  ecPhone: "",
  photoUrl: "",
}

// NOTE: password is intentionally NOT populated here. Patient records
// returned from the server never include a raw/hashed password field,
// and edit mode should never touch the account password anyway.
function patientToForm(p: PatientWithId): FormState {
  return {
    name: p.name ?? "",
    age: String(p.age ?? ""),
    gender: p.gender ?? Gender.MALE,
    bloodGroup: p.bloodGroup ?? "",
    phone: p.phone ?? "",
    email: p.email ?? "",
    password: "",
    address: p.address ?? "",
    condition: p.condition ?? "",
    diagnosis: p.diagnosis ?? "",
    allergies: (p.allergies ?? []).join(", "),
    currentMedications: (p.currentMedications ?? []).join(", "),
    status: p.status ?? PatientStatus.ACTIVE,
    admissionDate: toDateInputValue(p.admissionDate),
    dischargeDate: toDateInputValue(p.dischargeDate),
    ecName: p.emergencyContact?.name ?? "",
    ecRelationship: p.emergencyContact?.relationship ?? "",
    ecPhone: p.emergencyContact?.phone ?? "",
    photoUrl: p.photoUrl ?? "",
  }
}

interface FieldProps {
  label: string
  id: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

const Field = ({ label, id, error, children, required }: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
)

export default function PatientFormModal({
  open,
  mode,
  patient,
  onClose,
  onSuccess,
}: PatientFormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({})
  const [serverError, setServerError] = useState("")

  const [createPatient, { isLoading: isCreating }] = useCreatePATIENTMutation()
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePATIENTMutation()
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    if (open) {
      setServerError("")
      setErrors({})
      if (mode === "edit" && patient) {
        setForm(patientToForm(patient))
      } else {
        setForm(EMPTY_FORM)
      }
    }
  }, [open, mode, patient])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose()
    }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, isSubmitting, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const splitComma = (str: string) =>
    str
      ? str
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  const buildPayload = () => ({
    name: form.name.trim(),
    age: Number(form.age),
    gender: form.gender as Gender,
    bloodGroup: form.bloodGroup ? (form.bloodGroup as BloodGroup) : undefined,
    phone: form.phone.trim() || undefined,
    email: form.email.trim(),
    address: form.address.trim() || undefined,
    condition: form.condition.trim(),
    diagnosis: form.diagnosis.trim() || undefined,
    allergies: splitComma(form.allergies),
    currentMedications: splitComma(form.currentMedications),
    status: form.status as PatientStatus,
    admissionDate: new Date(form.admissionDate),
    dischargeDate: form.dischargeDate
      ? new Date(form.dischargeDate)
      : undefined,
    emergencyContact:
      form.ecName.trim() && form.ecRelationship.trim() && form.ecPhone.trim()
        ? {
            name: form.ecName.trim(),
            relationship: form.ecRelationship.trim(),
            phone: form.ecPhone.trim(),
          }
        : undefined,
    photoUrl: form.photoUrl.trim() || undefined,
    doctorIds: [] as string[],
    ...(mode === "add" ? { password: form.password } : {}),
  })

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {}
    const schema = mode === "add" ? createPatientSchema : updatePatientSchema
    const payload = buildPayload()

    const result = schema.safeParse(payload)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const [key, nestedKey] = issue.path

        if (key === "emergencyContact" && nestedKey === "name") {
          errs.ecName = issue.message
        } else if (key === "emergencyContact" && nestedKey === "relationship") {
          errs.ecRelationship = issue.message
        } else if (key === "emergencyContact" && nestedKey === "phone") {
          errs.ecPhone = issue.message
        } else if (typeof key === "string" && key in EMPTY_FORM) {
          errs[key as keyof FormState] = issue.message
        }
      })
    }

    setErrors(errs)
    return result.success
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    try {
      if (mode === "edit" && patient?._id) {
        const { password: _password, doctorIds: _doctorIds, ...updateData } =
          buildPayload()
        await updatePatient({
          patientId: patient._id,
          data: updateData,
        }).unwrap()
      } else {
        await createPatient(buildPayload() as CreatePatientInput).unwrap()
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setServerError(msg ?? "Something went wrong")
      console.error("Failed to submit patient form:", err)
    }
  }

  const title = mode === "add" ? "Add New Patient" : "Edit Patient"
  const submitLabel = mode === "add" ? "Add Patient" : "Save Changes"

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isSubmitting) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl animate-in flex-col rounded-2xl border border-border bg-card shadow-2xl duration-200 fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Users className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {mode === "add"
                ? "Fill in the details to register a new patient"
                : "Update the patient's information"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="ml-auto flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-6">
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Photo URL */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt="Patient photo"
                    className="size-16 rounded-full object-cover ring-2 ring-border"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <UserCircle2 className="size-8 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Name + Age */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" id="name" error={errors.name} required>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={set("name")}
                  className="h-9"
                />
              </Field>
              <Field label="Age" id="age" error={errors.age} required>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="150"
                  placeholder="0–150"
                  value={form.age}
                  onChange={set("age")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Gender + Blood Group */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Gender" id="gender" error={errors.gender} required>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={set("gender")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {Object.values(Gender).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Blood Group"
                id="bloodGroup"
                error={errors.bloodGroup}
              >
                <select
                  id="bloodGroup"
                  value={form.bloodGroup}
                  onChange={set("bloodGroup")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="">— None —</option>
                  {Object.values(BloodGroup).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone" id="phone" error={errors.phone}>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={set("phone")}
                  className="h-9"
                />
              </Field>
              <Field
                label="Email"
                id="email"
                error={errors.email}
                required={mode === "add"}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="patient@example.com"
                  value={form.email}
                  onChange={set("email")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Password — only for account creation, never shown/edited afterward */}
            {mode === "add" && (
              <Field
                label="Password"
                id="password"
                error={errors.password}
                required
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special"
                  value={form.password}
                  onChange={set("password")}
                  className="h-9"
                  autoComplete="new-password"
                />
              </Field>
            )}

            {/* Address */}
            <Field label="Address" id="address" error={errors.address}>
              <Input
                id="address"
                placeholder="123 Main St, City"
                value={form.address}
                onChange={set("address")}
                className="h-9"
              />
            </Field>

            {/* Condition */}
            <Field
              label="Medical Condition"
              id="condition"
              error={errors.condition}
              required
            >
              <Input
                id="condition"
                placeholder="e.g. Hypertension, Diabetes"
                value={form.condition}
                onChange={set("condition")}
                className="h-9"
              />
            </Field>

            {/* Diagnosis */}
            <Field label="Diagnosis" id="diagnosis" error={errors.diagnosis}>
              <textarea
                id="diagnosis"
                placeholder="Detailed diagnosis notes..."
                value={form.diagnosis}
                onChange={set("diagnosis")}
                rows={2}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </Field>

            {/* Allergies + Medications */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Allergies" id="allergies" error={errors.allergies}>
                <Input
                  id="allergies"
                  placeholder="Penicillin, Peanuts (comma separated)"
                  value={form.allergies}
                  onChange={set("allergies")}
                  className="h-9"
                />
              </Field>
              <Field
                label="Current Medications"
                id="currentMedications"
                error={errors.currentMedications}
              >
                <Input
                  id="currentMedications"
                  placeholder="Aspirin, Metformin (comma separated)"
                  value={form.currentMedications}
                  onChange={set("currentMedications")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Status + Admission Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Status" id="status" error={errors.status} required>
                <select
                  id="status"
                  value={form.status}
                  onChange={set("status")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {Object.values(PatientStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Admission Date"
                id="admissionDate"
                error={errors.admissionDate}
                required
              >
                <Input
                  id="admissionDate"
                  type="date"
                  value={form.admissionDate}
                  onChange={set("admissionDate")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Discharge Date */}
            <Field
              label="Discharge Date"
              id="dischargeDate"
              error={errors.dischargeDate}
            >
              <Input
                id="dischargeDate"
                type="date"
                value={form.dischargeDate}
                onChange={set("dischargeDate")}
                className="h-9"
              />
            </Field>

            {/* Emergency Contact */}
            <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                Emergency Contact
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Name" id="ecName" error={errors.ecName}>
                  <Input
                    id="ecName"
                    placeholder="John Doe"
                    value={form.ecName}
                    onChange={set("ecName")}
                    className="h-9"
                  />
                </Field>
                <Field
                  label="Relationship"
                  id="ecRelationship"
                  error={errors.ecRelationship}
                >
                  <Input
                    id="ecRelationship"
                    placeholder="Spouse, Parent..."
                    value={form.ecRelationship}
                    onChange={set("ecRelationship")}
                    className="h-9"
                  />
                </Field>
                <Field label="Phone" id="ecPhone" error={errors.ecPhone}>
                  <Input
                    id="ecPhone"
                    placeholder="+1 (555) 000-0000"
                    value={form.ecPhone}
                    onChange={set("ecPhone")}
                    className="h-9"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 gap-2 border-t border-border px-6 py-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : (
                submitLabel
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
