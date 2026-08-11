"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  Users,
  UserCircle2,
  Phone,
  Mail,
  MapPin,
  Droplets,
  HeartPulse,
  Pill,
  AlertTriangle,
  CalendarClock,
  CalendarCheck,
  ImageIcon,
  Lock,
  ShieldAlert,
  ClipboardList,
  Stethoscope,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

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
import { toast } from "sonner"

export type PatientFormMode = "add" | "edit"

interface PatientAddEditFormProps {
  mode: PatientFormMode
  patient?: PatientWithId
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

const statusBadge: Record<string, string> = {
  [PatientStatus.ACTIVE]: "border-green-500/30 bg-green-500/10 text-green-600",
  [PatientStatus.INACTIVE]: "border-border bg-muted text-muted-foreground",
  [PatientStatus.DISCHARGED]: "border-blue-500/30 bg-blue-500/10 text-blue-600",
}

export default function PatientAddEditForm({
  mode,
  patient,
}: PatientAddEditFormProps) {
  const [form, setForm] = useState<FormState>(
    mode === "edit" && patient ? patientToForm(patient) : EMPTY_FORM
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({})
  const [serverError, setServerError] = useState("")

  const [createPatient, { isLoading: isCreating }] = useCreatePATIENTMutation()
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePATIENTMutation()
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    setServerError("")
    setErrors({})
    if (mode === "edit" && patient) {
      setForm(patientToForm(patient))
    } else {
      setForm(EMPTY_FORM)
    }
  }, [mode, patient])

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    try {
      if (mode === "edit" && patient?._id) {
        const {
          password: _password,
          doctorIds: _doctorIds,
          ...updateData
        } = buildPayload()
        await updatePatient({
          patientId: patient._id,
          data: updateData,
        }).unwrap()
        toast.success("Patient updated successfull")
      } else {
        const data = await createPatient(
          buildPayload() as CreatePatientInput
        ).unwrap()
        toast.success("Patient added successfull")
        window.location.href = `/admin/dashboard/patients?id=${data?.data?._id}`
      }

      window.location.href = "/admin/dashboard/patients"
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setServerError(msg ?? "Something went wrong")
      toast.error(serverError)
    }
  }

  const title = mode === "add" ? "Add New Patient" : "Edit Patient"
  const description =
    mode === "add"
      ? "Fill in the details to register a new patient and create their account"
      : "Update the patient's information"
  const submitLabel = mode === "add" ? "Add Patient" : "Save Changes"

  return (
    <div className="space-y-6">
      {/* ── top bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/admin/dashboard/patients">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ── hero card (matches detail page banner) ────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt="Patient photo"
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
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Users className="size-4" />
                  </div>
                  <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {form.condition && (
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] text-primary"
                    >
                      <HeartPulse className="mr-1 size-3" />
                      {form.condition}
                    </Badge>
                  )}

                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-[10px] font-semibold ${
                      statusBadge[form.status] ??
                      statusBadge[PatientStatus.INACTIVE]
                    }`}
                  >
                    {form.status}
                  </Badge>

                  {form.bloodGroup && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-[11px]"
                    >
                      <Droplets className="mr-1 size-3" />
                      {form.bloodGroup}
                    </Badge>
                  )}
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
                placeholder="Jane Doe"
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
              required={mode === "add"}
              icon={<Mail className="size-3.5" />}
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

          {mode === "add" && (
            <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:col-span-2">
              <Field
                label="Account Password"
                id="password"
                error={errors.password}
                required
                icon={<Lock className="size-3.5" />}
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special"
                  value={form.password}
                  onChange={set("password")}
                  className="h-9 max-w-md"
                  autoComplete="new-password"
                />
              </Field>
            </div>
          )}

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Phone"
              id="phone"
              error={errors.phone}
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field label="Gender" id="gender" error={errors.gender} required>
              <select
                id="gender"
                value={form.gender}
                onChange={set("gender")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.values(Gender).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Field
              label="Blood Group"
              id="bloodGroup"
              error={errors.bloodGroup}
              icon={<Droplets className="size-3.5" />}
            >
              <select
                id="bloodGroup"
                value={form.bloodGroup}
                onChange={set("bloodGroup")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Status"
              id="status"
              error={errors.status}
              required
              icon={<Stethoscope className="size-3.5" />}
            >
              <select
                id="status"
                value={form.status}
                onChange={set("status")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.values(PatientStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Address"
              id="address"
              error={errors.address}
              icon={<MapPin className="size-3.5" />}
            >
              <Input
                id="address"
                placeholder="123 Main St, City"
                value={form.address}
                onChange={set("address")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Field
              label="Medical Condition"
              id="condition"
              error={errors.condition}
              required
              icon={<HeartPulse className="size-3.5" />}
            >
              <Input
                id="condition"
                placeholder="e.g. Hypertension, Diabetes"
                value={form.condition}
                onChange={set("condition")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Admission Date"
              id="admissionDate"
              error={errors.admissionDate}
              required
              icon={<CalendarClock className="size-3.5" />}
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

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Discharge Date"
              id="dischargeDate"
              error={errors.dischargeDate}
              icon={<CalendarCheck className="size-3.5" />}
            >
              <Input
                id="dischargeDate"
                type="date"
                value={form.dischargeDate}
                onChange={set("dischargeDate")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4 sm:col-span-2">
            <Field
              label="Diagnosis"
              id="diagnosis"
              error={errors.diagnosis}
              icon={<ClipboardList className="size-3.5" />}
            >
              <textarea
                id="diagnosis"
                placeholder="Detailed diagnosis notes..."
                value={form.diagnosis}
                onChange={set("diagnosis")}
                rows={3}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Allergies"
              id="allergies"
              error={errors.allergies}
              icon={<AlertTriangle className="size-3.5" />}
            >
              <Input
                id="allergies"
                placeholder="Penicillin, Peanuts (comma separated)"
                value={form.allergies}
                onChange={set("allergies")}
                className="h-9"
              />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4">
            <Field
              label="Current Medications"
              id="currentMedications"
              error={errors.currentMedications}
              icon={<Pill className="size-3.5" />}
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
        </div>

        {/* ── emergency contact ───────────────────────────────────────────── */}
        <div className="space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-destructive" />
            <p className="text-sm font-semibold text-destructive">
              Emergency Contact
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name" id="ecName" error={errors.ecName}>
              <Input
                id="ecName"
                placeholder="John Doe"
                value={form.ecName}
                onChange={set("ecName")}
                className="h-9 bg-card"
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
                className="h-9 bg-card"
              />
            </Field>
            <Field label="Phone" id="ecPhone" error={errors.ecPhone}>
              <Input
                id="ecPhone"
                placeholder="+1 (555) 000-0000"
                value={form.ecPhone}
                onChange={set("ecPhone")}
                className="h-9 bg-card"
              />
            </Field>
          </div>
        </div>

        {/* ── footer actions ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card px-6 py-4">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href="/admin/dashboard/patients">Cancel</Link>
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
