"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Stethoscope,
  UserCircle2,
  Phone,
  Mail,
  Building2,
  BadgeCheck,
  Clock,
  DollarSign,
  GraduationCap,
  Layers,
  ImageIcon,
  Lock,
  ShieldCheck,
  ShieldX,
} from "lucide-react"

import { IDoctor, Specialization } from "@/app/api/doctor/doctor.interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import {
  useCreateDOCTORMutation,
  useUpdateDOCTORMutation,
} from "@/redux/features/doctor.api"

import { SPECIALIZATIONS } from "@/constant/user.constant"

import {
  createDoctorSchema,
  updateDoctorSchema,
} from "@/app/api/doctor/doctor.validation"
import { toast } from "sonner"

export type DoctorFormMode = "add" | "edit"

type DoctorWithId = IDoctor & {
  _id?: string
}

interface DoctorAddEditFormProps {
  mode: DoctorFormMode
  doctor?: DoctorWithId
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

function doctorToForm(doctor: DoctorWithId): FormState {
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
  icon?: React.ReactNode
}

function Field({ label, id, error, children, required, icon }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium"
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function DoctorAddEditForm({
  mode,
  doctor,
}: DoctorAddEditFormProps) {
  const [form, setForm] = useState<FormState>(
    mode === "edit" && doctor ? doctorToForm(doctor) : EMPTY_FORM
  )

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({})

  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [createDoctor, { isLoading: isCreating }] = useCreateDOCTORMutation()

  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDOCTORMutation()

  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    setServerError("")
    setErrors({})
    setShowPassword(false)

    if (mode === "edit" && doctor) {
      setForm(doctorToForm(doctor))
    } else {
      setForm(EMPTY_FORM)
    }
  }, [mode, doctor])

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }))

      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }))
    }

  const setBool =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.checked,
      }))
    }

  const getQualifications = () => {
    return form.qualifications
      ? form.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : []
  }

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {}

    const dataToValidate = {
      ...form,
      yearsOfExperience: Number(form.yearsOfExperience),
      consultationFee:
        form.consultationFee !== "" ? Number(form.consultationFee) : undefined,
      qualifications: getQualifications(),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setServerError("")

    if (!validate()) {
      return
    }

    const qualifications = getQualifications()

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
        toast.success("Doctor updated successfull")
        window.location.href = "/admin/dashboard/doctors"
      } else {
        const data = await createDoctor({
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
        toast.success("Doctor added succcessfull")
        window.location.href = `/admin/dashboard/doctors?id=${data?.data?._id}`
      }
    } catch (err: unknown) {
      const msg = (
        err as {
          data?: {
            message?: string
          }
        }
      )?.data?.message

      setServerError(msg ?? "Something went wrong")
    }
  }

  const title = mode === "add" ? "Add New Doctor" : "Edit Doctor"

  const description =
    mode === "add"
      ? "Fill in the details to register a new doctor and create their account"
      : "Update the doctor's information"

  const submitLabel = mode === "add" ? "Add Doctor" : "Save Changes"

  return (
    <div className="space-y-6">
      {/* ── top bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/admin/dashboard/doctors">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ── hero card (matches detail page banner) ────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* gradient banner */}
          <div className="relative h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
          </div>

          <div className="px-6 pb-6">
            {/* avatar row — overlaps banner */}
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt="Doctor photo"
                    className="size-24 rounded-2xl object-cover shadow-lg ring-4 ring-card"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 shadow-lg ring-4 ring-card">
                    <UserCircle2 className="size-12 text-primary" />
                  </div>
                )}

                {/* availability dot */}
                <span
                  className={`absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full ring-2 ring-card ${
                    form.isAvailable ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                  title={form.isAvailable ? "Available" : "Unavailable"}
                >
                  {form.isAvailable ? (
                    <ShieldCheck className="size-3 text-white" />
                  ) : (
                    <ShieldX className="size-3 text-white" />
                  )}
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Stethoscope className="size-4" />
                  </div>
                  <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] text-primary"
                  >
                    <Stethoscope className="mr-1 size-3" />
                    {form.specialization}
                  </Badge>

                  <Badge
                    className={`px-2 py-0.5 text-[10px] font-semibold ${
                      form.isAvailable
                        ? "border-green-500/30 bg-green-500/10 text-green-600"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                    variant="outline"
                  >
                    {form.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="mt-3">
                  <Field
                    label="Photo URL"
                    id="photoUrl"
                    error={errors.photoUrl}
                    icon={<ImageIcon className="size-3.5" />}
                  >
                    <Input
                      id="photoUrl"
                      placeholder="https://example.com/photo.jpg"
                      value={form.photoUrl}
                      onChange={set("photoUrl")}
                      className="h-9 max-w-md"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </div>

        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Full Name"
              id="name"
              error={errors.name}
              required
              icon={<UserCircle2 className="size-3.5" />}
            >
              <Input
                id="name"
                placeholder="Dr. John Smith"
                value={form.name}
                onChange={set("name")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Email"
              id="email"
              error={errors.email}
              required
              icon={<Mail className="size-3.5" />}
            >
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

          {mode === "add" && (
            <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:col-span-2">
              <Field
                label="Account Password"
                id="password"
                error={errors.password}
                required
                icon={<Lock className="size-3.5" />}
              >
                <div className="relative max-w-md">
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
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </Field>
            </div>
          )}

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Phone"
              id="phone"
              error={errors.phone}
              required
              icon={<Phone className="size-3.5" />}
            >
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={set("phone")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Field
              label="License Number"
              id="licenseNumber"
              error={errors.licenseNumber}
              required
              icon={<BadgeCheck className="size-3.5" />}
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Specialization"
              id="specialization"
              error={errors.specialization}
              required
              icon={<Stethoscope className="size-3.5" />}
            >
              <select
                id="specialization"
                value={form.specialization}
                onChange={set("specialization")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                {SPECIALIZATIONS.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Hospital"
              id="hospital"
              error={errors.hospital}
              required
              icon={<Building2 className="size-3.5" />}
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Department"
              id="department"
              error={errors.department}
              icon={<Layers className="size-3.5" />}
            >
              <Input
                id="department"
                placeholder="Cardiology Dept."
                value={form.department}
                onChange={set("department")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Years of Experience"
              id="yearsOfExperience"
              error={errors.yearsOfExperience}
              required
              icon={<Clock className="size-3.5" />}
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Consultation Fee ($)"
              id="consultationFee"
              error={errors.consultationFee}
              icon={<DollarSign className="size-3.5" />}
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
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Qualifications"
              id="qualifications"
              error={errors.qualifications}
              icon={<GraduationCap className="size-3.5" />}
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
        </div>

        {/* ── availability toggle ──────────────────────────────────────── */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <input
            id="isAvailable"
            type="checkbox"
            checked={form.isAvailable}
            onChange={setBool("isAvailable")}
            className="size-4 cursor-pointer rounded accent-primary"
          />

          <div>
            <Label
              htmlFor="isAvailable"
              className="cursor-pointer text-sm font-medium"
            >
              Available for appointments
            </Label>

            <p className="text-xs text-muted-foreground">
              Patients can book appointments with this doctor.
            </p>
          </div>
        </div>

        {/* ── footer actions ───────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card px-6 py-4">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href="/admin/dashboard/doctors">Cancel</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 gap-2"
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
        </div>
      </form>
    </div>
  )
}
