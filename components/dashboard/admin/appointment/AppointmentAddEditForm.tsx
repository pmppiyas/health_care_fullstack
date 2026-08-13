"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  Stethoscope,
  UserCircle2,
  ClipboardList,
} from "lucide-react"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "@/interfaces/appointment.interface"

import {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from "@/redux/features/appointment.api"

import {
  createAppointmentValidationSchema,
  updateAppointmentValidationSchema,
} from "@/app/api/appointment/appointment.validation"

type AppointmentFormMode = "add" | "edit"

type DoctorOption = {
  _id: string
  name?: string
  specialization?: string
}

type PatientOption = {
  _id: string
  name?: string
  condition?: string
  status?: string
}

type AppointmentWithId = Appointment

interface AppointmentAddEditFormProps {
  mode: AppointmentFormMode
  appointment?: AppointmentWithId
  doctors: DoctorOption[]
  patients: PatientOption[]
  defaultDoctorId?: string
  defaultPatientId?: string
  basePath?: string
}

type AppointmentFormValues = {
  doctorId: string
  patientId: string
  appointmentDate: Date
  appointmentTime: string
  type: AppointmentType
  status: AppointmentStatus
  reason?: string
  notes?: string
}

function getId(value: unknown): string {
  if (typeof value === "string") return value
  if (value && typeof value === "object") {
    if ("_id" in value) return String((value as { _id: unknown })._id)
    return String(value)
  }
  return ""
}

function appointmentToForm(
  appointment: AppointmentWithId
): AppointmentFormValues {
  return {
    doctorId: getId(appointment.doctorId),
    patientId: getId(appointment.patientId),
    appointmentDate: new Date(appointment.appointmentDate),
    appointmentTime: appointment.appointmentTime ?? "",
    type: appointment.type ?? AppointmentType.CONSULTATION,
    status: appointment.status ?? AppointmentStatus.SCHEDULED,
    reason: appointment.reason ?? "",
    notes: appointment.notes ?? "",
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
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium"
      >
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function AppointmentAddEditForm({
  mode,
  appointment,
  doctors,
  patients,
  defaultDoctorId,
  defaultPatientId,
  basePath = "/admin/dashboard/appointments",
}: AppointmentAddEditFormProps) {
  const [serverError, setServerError] = useState("")

  const [createAppointment, { isLoading: isCreating }] =
    useCreateAppointmentMutation()

  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation()

  const isSubmitting = isCreating || isUpdating

  const schema = useMemo(
    () =>
      mode === "add"
        ? createAppointmentValidationSchema
        : updateAppointmentValidationSchema,
    [mode]
  )

  const defaultValues = useMemo<AppointmentFormValues>(() => {
    if (mode === "edit" && appointment) {
      return appointmentToForm(appointment)
    }

    return {
      doctorId: defaultDoctorId ?? "",
      patientId: defaultPatientId ?? "",
      appointmentDate: new Date(),
      appointmentTime: "",
      type: AppointmentType.CONSULTATION,
      status: AppointmentStatus.SCHEDULED,
      reason: "",
      notes: "",
    }
  }, [mode, appointment, defaultDoctorId, defaultPatientId])

  type FormInput = z.input<typeof schema>
  type FormOutput = z.output<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormInput,
  })

  useEffect(() => {
    reset(defaultValues as FormInput)
    setServerError("")
  }, [defaultValues, reset])

  const onSubmit = async (data: FormOutput) => {
    setServerError("")

    if (!data.appointmentDate) {
      setServerError("Appointment date is required")
      return
    }

    if (!data.doctorId) {
      setServerError("Doctor is required")
      return
    }

    if (!data.patientId) {
      setServerError("Patient is required")
      return
    }

    if (!data.appointmentTime) {
      setServerError("Appointment time is required")
      return
    }

    const payload = {
      doctorId: data.doctorId,
      patientId: data.patientId,
      appointmentDate: data.appointmentDate.toISOString(),
      appointmentTime: data.appointmentTime,
      type: data.type ?? AppointmentType.CONSULTATION,
      status: data.status ?? AppointmentStatus.SCHEDULED,
      reason: data.reason ?? "",
      notes: data.notes ?? "",
    }

    try {
      if (mode === "edit" && appointment?._id) {
        await updateAppointment({
          appointmentId: appointment._id,
          data: payload,
        }).unwrap()

        toast.success("Appointment updated successfully")

        window.location.href = basePath

        return
      }

      await createAppointment(payload).unwrap()

      toast.success("Appointment created successfully")

      window.location.href = basePath
    } catch (err: unknown) {
      const message = (
        err as {
          data?: {
            message?: string
          }
        }
      )?.data?.message

      setServerError(message ?? "Something went wrong")
    }
  }

  const submitLabel = mode === "add" ? "Create Appointment" : "Save Changes"

  return (
    <div className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Field
              label="Doctor"
              id="doctorId"
              required
              icon={<Stethoscope className="size-3.5" />}
              error={errors.doctorId?.message as string}
            >
              <select
                id="doctorId"
                {...register("doctorId")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select a doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name ?? "Unknown Doctor"}
                    {doctor.specialization ? ` — ${doctor.specialization}` : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Field
              label="Patient"
              id="patientId"
              required
              icon={<UserCircle2 className="size-3.5" />}
              error={errors.patientId?.message as string}
            >
              <select
                id="patientId"
                {...register("patientId")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select a patient</option>

                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name ?? "Unknown Patient"}
                    {patient.condition ? ` — ${patient.condition}` : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <Field
              label="Appointment Date"
              id="appointmentDate"
              required
              icon={<CalendarDays className="size-3.5" />}
              error={errors.appointmentDate?.message as string}
            >
              <Controller
                name="appointmentDate"
                control={control}
                render={({ field }) => {
                  const dateValue =
                    field.value instanceof Date && !isNaN(field.value.getTime())
                      ? field.value.toISOString().split("T")[0]
                      : typeof field.value === "string" && field.value
                        ? (field.value as string).split("T")[0]
                        : ""
                  return (
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={dateValue}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(
                          val ? new Date(`${val}T00:00:00`) : undefined
                        )
                      }}
                      onBlur={field.onBlur}
                      className="h-9"
                    />
                  )
                }}
              />
            </Field>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <Field
              label="Appointment Time"
              id="appointmentTime"
              required
              icon={<Clock className="size-3.5" />}
              error={errors.appointmentTime?.message as string}
            >
              <Input
                id="appointmentTime"
                type="time"
                {...register("appointmentTime")}
                className="h-9"
              />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <Field
              label="Appointment Type"
              id="type"
              required
              icon={<ClipboardList className="size-3.5" />}
              error={errors.type?.message as string}
            >
              <select
                id="type"
                {...register("type")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.values(AppointmentType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <Field
              label="Status"
              id="status"
              required
              icon={<ClipboardList className="size-3.5" />}
              error={errors.status?.message as string}
            >
              <select
                id="status"
                {...register("status")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.values(AppointmentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <Field
            label="Reason"
            id="reason"
            icon={<FileText className="size-3.5" />}
            error={errors.reason?.message as string}
          >
            <textarea
              id="reason"
              {...register("reason")}
              placeholder="Reason for appointment..."
              rows={4}
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </Field>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <Field
            label="Notes"
            id="notes"
            icon={<FileText className="size-3.5" />}
            error={errors.notes?.message as string}
          >
            <textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes..."
              rows={5}
              className="flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card px-6 py-4">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href={basePath}>Cancel</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-40 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />

                {mode === "add" ? "Creating..." : "Saving..."}
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
