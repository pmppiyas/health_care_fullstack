"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2, Stethoscope, UserCircle2, Eye, EyeOff } from "lucide-react"
import { IDoctor, Specialization } from "@/app/api/doctor/doctor.interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useCreateDOCTORMutation,
  useUpdateDOCTORMutation,
} from "@/redux/features/doctor.api"
import { SPECIALIZATIONS } from "@/constant/user.constant"
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "@/app/api/doctor/doctor.validation"

export type DoctorFormMode = "add" | "edit"

interface DoctorFormModalProps {
  open: boolean
  mode: DoctorFormMode
  doctor?: IDoctor & { _id?: string }
  onClose: () => void
  onSuccess: () => void
}

type FormState = {
  name: string
  email: string
  password: string
  phone: string
  specialization: string
  hospital: string
  department: string
  licenseNumber: string
  yearsOfExperience: string
  consultationFee: string
  qualifications: string
  photoUrl: string
  isAvailable: boolean
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: Specialization.GENERAL_PRACTICE,
  hospital: "",
  department: "",
  licenseNumber: "",
  yearsOfExperience: "",
  consultationFee: "",
  qualifications: "",
  photoUrl: "",
  isAvailable: true,
}

function doctorToForm(doctor: IDoctor & { _id?: string }): FormState {
  return {
    name: doctor.name ?? "",
    email: doctor.email ?? "",
    password: "",
    phone: doctor.phone ?? "",
    specialization: doctor.specialization ?? Specialization.GENERAL_PRACTICE,
    hospital: doctor.hospital ?? "",
    department: doctor.department ?? "",
    licenseNumber: doctor.licenseNumber ?? "",
    yearsOfExperience: String(doctor.yearsOfExperience ?? ""),
    consultationFee: String(doctor.consultationFee ?? ""),
    qualifications: (doctor.qualifications ?? []).join(", "),
    photoUrl: doctor.photoUrl ?? "",
    isAvailable: doctor.isAvailable ?? true,
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

export default function DoctorFormModal({
  open,
  mode,
  doctor,
  onClose,
  onSuccess,
}: DoctorFormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({})
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [createDoctor, { isLoading: isCreating }] = useCreateDOCTORMutation()
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDOCTORMutation()
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    if (open) {
      setServerError("")
      setErrors({})
      setShowPassword(false)
      if (mode === "edit" && doctor) {
        setForm(doctorToForm(doctor))
      } else {
        setForm(EMPTY_FORM)
      }
    }
  }, [open, mode, doctor])

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

  const setBool =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.checked }))

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {}

    const qualificationsArray = form.qualifications
      ? form.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : []

    const dataToValidate = {
      ...form,
      yearsOfExperience: Number(form.yearsOfExperience),
      consultationFee:
        form.consultationFee !== "" ? Number(form.consultationFee) : undefined,
      qualifications: qualificationsArray,
      patientIds: [],
    }

    const schema = mode === "add" ? createDoctorSchema : updateDoctorSchema

    const result = schema.safeParse(dataToValidate)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormState
        if (field) {
          errs[field] = issue.message
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

    const qualifications = form.qualifications
      ? form.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : []

    try {
      if (mode === "edit" && doctor?._id) {
        await updateDoctor({
          doctorId: doctor._id,
          data: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            specialization: form.specialization,
            hospital: form.hospital.trim(),
            department: form.department.trim() || undefined,
            licenseNumber: form.licenseNumber.trim(),
            yearsOfExperience: Number(form.yearsOfExperience),
            consultationFee:
              form.consultationFee !== ""
                ? Number(form.consultationFee)
                : undefined,
            qualifications,
            photoUrl: form.photoUrl.trim() || undefined,
            isAvailable: form.isAvailable,
          },
        }).unwrap()
      } else {
        await createDoctor({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          specialization: form.specialization,
          hospital: form.hospital.trim(),
          department: form.department.trim() || undefined,
          licenseNumber: form.licenseNumber.trim(),
          yearsOfExperience: Number(form.yearsOfExperience),
          consultationFee:
            form.consultationFee !== ""
              ? Number(form.consultationFee)
              : undefined,
          qualifications,
          patientIds: [],
          photoUrl: form.photoUrl.trim() || undefined,
          isAvailable: form.isAvailable,
        }).unwrap()
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setServerError(msg ?? "Something went wrong")
    }
  }

  const title = mode === "add" ? "Add New Doctor" : "Edit Doctor"
  const submitLabel = mode === "add" ? "Add Doctor" : "Save Changes"

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isSubmitting) onClose()
      }}
    >
      {/* Blurred dark overlay */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl animate-in flex-col rounded-2xl border border-border bg-card shadow-2xl duration-200 fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {mode === "add"
                ? "Fill in the details to register a new doctor and create their account"
                : "Update the doctor's information"}
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
            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Photo URL preview */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt="Doctor photo"
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
              <Field label="Photo URL" id="photoUrl" error={errors.photoUrl}>
                <Input
                  id="photoUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={form.photoUrl}
                  onChange={set("photoUrl")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Row: Name + Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" id="name" error={errors.name} required>
                <Input
                  id="name"
                  placeholder="Dr. John Smith"
                  value={form.name}
                  onChange={set("name")}
                  className="h-9"
                />
              </Field>
              <Field label="Email" id="email" error={errors.email} required>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={form.email}
                  onChange={set("email")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Password — only shown in ADD mode */}
            {mode === "add" && (
              <Field
                label="Account Password"
                id="password"
                error={errors.password}
                required
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars, uppercase, number, special char"
                    value={form.password}
                    onChange={set("password")}
                    className="h-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </Field>
            )}

            {/* Row: Phone + License */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone" id="phone" error={errors.phone} required>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={set("phone")}
                  className="h-9"
                />
              </Field>
              <Field
                label="License Number"
                id="licenseNumber"
                error={errors.licenseNumber}
                required
              >
                <Input
                  id="licenseNumber"
                  placeholder="LIC-12345"
                  value={form.licenseNumber}
                  onChange={set("licenseNumber")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Row: Specialization + Hospital */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Specialization"
                id="specialization"
                error={errors.specialization}
                required
              >
                <select
                  id="specialization"
                  value={form.specialization}
                  onChange={set("specialization")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Hospital"
                id="hospital"
                error={errors.hospital}
                required
              >
                <Input
                  id="hospital"
                  placeholder="City General Hospital"
                  value={form.hospital}
                  onChange={set("hospital")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Row: Department + Years of Experience */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Department"
                id="department"
                error={errors.department}
              >
                <Input
                  id="department"
                  placeholder="Cardiology Dept."
                  value={form.department}
                  onChange={set("department")}
                  className="h-9"
                />
              </Field>
              <Field
                label="Years of Experience"
                id="yearsOfExperience"
                error={errors.yearsOfExperience}
                required
              >
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="0–60"
                  value={form.yearsOfExperience}
                  onChange={set("yearsOfExperience")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Row: Consultation Fee + Qualifications */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Consultation Fee ($)"
                id="consultationFee"
                error={errors.consultationFee}
              >
                <Input
                  id="consultationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="150"
                  value={form.consultationFee}
                  onChange={set("consultationFee")}
                  className="h-9"
                />
              </Field>
              <Field
                label="Qualifications"
                id="qualifications"
                error={errors.qualifications}
              >
                <Input
                  id="qualifications"
                  placeholder="MBBS, MD, PhD (comma separated)"
                  value={form.qualifications}
                  onChange={set("qualifications")}
                  className="h-9"
                />
              </Field>
            </div>

            {/* Available toggle */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
              <input
                id="isAvailable"
                type="checkbox"
                checked={form.isAvailable}
                onChange={setBool("isAvailable")}
                className="size-4 cursor-pointer rounded accent-primary"
              />
              <Label
                htmlFor="isAvailable"
                className="cursor-pointer text-sm select-none"
              >
                Available for appointments
              </Label>
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
