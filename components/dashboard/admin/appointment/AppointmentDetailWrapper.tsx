"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CalendarCheck2,
  CalendarX2,
  Clock,
  Stethoscope,
  UserCircle2,
  FileText,
  Phone,
  Mail,
  ShieldX,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"

import {
  useGetAppointmentByIdQuery,
  useDeleteAppointmentMutation,
  useCancelAppointmentMutation,
} from "@/redux/features/appointment.api"

import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "@/interfaces/appointment.interface"

import {
  statusConfig,
  typeConfig,
} from "@/components/dashboard/admin/appointment/AppointmentColorConfig"

function formatDate(d?: string | Date) {
  if (!d) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(d))
}

function AppointmentDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <Skeleton className="size-20 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-36" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface InfoCardProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  accent?: boolean
}

function InfoCard({ icon, label, value, accent }: InfoCardProps) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${
        accent
          ? "border-primary/20 bg-primary/5 hover:border-primary/40"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
          accent
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div className="text-sm font-medium wrap-break-word text-foreground">
          {value}
        </div>
      </div>
    </div>
  )
}

interface AppointmentDetailWrapperProps {
  appointmentId: string
}

export default function AppointmentDetailWrapper({
  appointmentId,
}: AppointmentDetailWrapperProps) {
  const router = useRouter()

  const { data, isLoading, isError } = useGetAppointmentByIdQuery(appointmentId)
  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation()
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation()

  const [showDelete, setShowDelete] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  if (isLoading) return <AppointmentDetailSkeleton />

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="size-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Appointment not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This appointment may have been removed or doesn&apos;t exist.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const appointment = data

  const statusCfg =
    statusConfig[appointment.status as AppointmentStatus] ??
    statusConfig[AppointmentStatus.SCHEDULED]

  const typeCfg =
    typeConfig[appointment.type as AppointmentType] ??
    typeConfig[AppointmentType.CONSULTATION]

  const isCancellable =
    appointment.status !== AppointmentStatus.CANCELLED &&
    appointment.status !== AppointmentStatus.COMPLETED

  const doctor =
    typeof appointment.doctorId === "object" && appointment.doctorId !== null
      ? (appointment.doctorId as {
          _id: string
          name?: string
          specialization?: string
          hospital?: string
          phone?: string
          email?: string
        })
      : null

  const patient =
    typeof appointment.patientId === "object" && appointment.patientId !== null
      ? (appointment.patientId as {
          _id: string
          name?: string
          condition?: string
          phone?: string
          email?: string
        })
      : null

  const handleDelete = async () => {
    try {
      await deleteAppointment(appointmentId).unwrap()
      toast.success("Appointment deleted successfully.")
      router.push("/admin/dashboard/appointments")
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      toast.error(msg ?? "Failed to delete appointment.")
    }
  }

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointmentId).unwrap()
      toast.success("Appointment cancelled.")
      setShowCancel(false)
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      toast.error(msg ?? "Failed to cancel appointment.")
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(
                  `/admin/dashboard/appointments/${appointment._id}/edit`
                )
              }
              className="gap-2"
            >
              <Pencil className="size-4" />
              Edit
            </Button>

            {isCancellable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancel(true)}
                className="gap-2 border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
              >
                <XCircle className="size-4" />
                Cancel
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDelete(true)}
              className="gap-2"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* ── hero card ───────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* status-coloured banner */}
          <div
            className="relative h-24 bg-linear-to-r to-transparent"
            style={{
              background: `linear-gradient(to right, ${
                appointment.status === AppointmentStatus.CONFIRMED
                  ? "rgba(34,197,94,0.2)"
                  : appointment.status === AppointmentStatus.COMPLETED
                    ? "rgba(16,185,129,0.2)"
                    : appointment.status === AppointmentStatus.CANCELLED
                      ? "rgba(239,68,68,0.2)"
                      : appointment.status === AppointmentStatus.NO_SHOW
                        ? "rgba(249,115,22,0.2)"
                        : "rgba(59,130,246,0.2)"
              }, transparent)`,
            }}
          />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {/* icon block */}
              <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 shadow-lg ring-4 ring-card">
                <CalendarCheck2 className="size-12 text-primary" />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    {formatDate(appointment.appointmentDate)}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold ${statusCfg.className}`}
                  >
                    <span
                      className={`mr-1.5 inline-block size-1.5 rounded-full ${statusCfg.dot}`}
                    />
                    {statusCfg.label}
                  </Badge>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {appointment.appointmentTime}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-[11px] ${typeCfg.className}`}
                  >
                    {typeCfg.label}
                  </Badge>

                  {doctor?.name && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-[11px]"
                    >
                      <Stethoscope className="mr-1 size-3" />
                      {doctor.name}
                    </Badge>
                  )}

                  {patient?.name && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-[11px]"
                    >
                      <UserCircle2 className="mr-1 size-3" />
                      {patient.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── info grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Doctor */}
          <InfoCard
            icon={<Stethoscope className="size-4" />}
            label="Doctor"
            accent
            value={
              <div>
                <p>{doctor?.name ?? "—"}</p>
                {doctor?.specialization && (
                  <p className="text-xs text-muted-foreground">
                    {doctor.specialization}
                  </p>
                )}
                {doctor?.hospital && (
                  <p className="text-xs text-muted-foreground">
                    {doctor.hospital}
                  </p>
                )}
              </div>
            }
          />

          {/* Patient */}
          <InfoCard
            icon={<UserCircle2 className="size-4" />}
            label="Patient"
            value={
              <div>
                <p>{patient?.name ?? "—"}</p>
                {patient?.condition && (
                  <p className="text-xs text-muted-foreground">
                    {patient.condition}
                  </p>
                )}
              </div>
            }
          />

          {/* Date */}
          <InfoCard
            icon={<CalendarCheck2 className="size-4" />}
            label="Appointment Date"
            value={formatDate(appointment.appointmentDate)}
            accent
          />

          {/* Time */}
          <InfoCard
            icon={<Clock className="size-4" />}
            label="Appointment Time"
            value={appointment.appointmentTime || "—"}
          />

          {/* Type */}
          <InfoCard
            icon={<CalendarX2 className="size-4" />}
            label="Type"
            value={
              <Badge
                variant="outline"
                className={`mt-0.5 px-2 py-0.5 text-[11px] ${typeCfg.className}`}
              >
                {typeCfg.label}
              </Badge>
            }
          />

          {/* Status */}
          <InfoCard
            icon={<CalendarCheck2 className="size-4" />}
            label="Status"
            value={
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusCfg.className}`}
              >
                <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            }
          />

          {/* Doctor contact */}
          {doctor?.phone && (
            <InfoCard
              icon={<Phone className="size-4" />}
              label="Doctor Phone"
              value={
                <a
                  href={`tel:${doctor.phone}`}
                  className="text-primary hover:underline"
                >
                  {doctor.phone}
                </a>
              }
            />
          )}

          {doctor?.email && (
            <InfoCard
              icon={<Mail className="size-4" />}
              label="Doctor Email"
              value={
                <a
                  href={`mailto:${doctor.email}`}
                  className="text-primary hover:underline"
                >
                  {doctor.email}
                </a>
              }
            />
          )}

          {/* Patient contact */}
          {patient?.phone && (
            <InfoCard
              icon={<Phone className="size-4" />}
              label="Patient Phone"
              value={
                <a
                  href={`tel:${patient.phone}`}
                  className="text-primary hover:underline"
                >
                  {patient.phone}
                </a>
              }
            />
          )}

          {patient?.email && (
            <InfoCard
              icon={<Mail className="size-4" />}
              label="Patient Email"
              value={
                <a
                  href={`mailto:${patient.email}`}
                  className="text-primary hover:underline"
                >
                  {patient.email}
                </a>
              }
            />
          )}

          {/* Reason */}
          {appointment.reason && (
            <InfoCard
              icon={<FileText className="size-4" />}
              label="Reason"
              value={appointment.reason}
            />
          )}

          {/* Notes */}
          {appointment.notes && (
            <InfoCard
              icon={<FileText className="size-4" />}
              label="Notes"
              value={appointment.notes}
            />
          )}
        </div>
      </div>

      {/* ── modals ──────────────────────────────────────────────────── */}
      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Appointment?"
        description="This appointment will be permanently deleted and cannot be recovered."
        confirmLabel="Yes, Delete"
        variant="danger"
      />

      <ConfirmModal
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        isLoading={isCancelling}
        title="Cancel Appointment?"
        description="This appointment will be marked as Cancelled. You can change the status later by editing."
        confirmLabel="Yes, Cancel"
        variant="warning"
      />
    </>
  )
}
