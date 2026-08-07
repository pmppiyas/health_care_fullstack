"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Stethoscope,
  Phone,
  Mail,
  Building2,
  BadgeCheck,
  Clock,
  DollarSign,
  GraduationCap,
  Layers,
  UserCircle2,
  CalendarClock,
  ShieldCheck,
  ShieldX,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"
import DoctorFormModal, {
  DoctorFormMode,
} from "@/components/dashboard/admin/doctor/DoctorFormModal"

import {
  useGetDOCTORByIdQuery,
  useDeleteDOCTORMutation,
} from "@/redux/features/doctor.api"

function formatDate(date?: Date | string) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

function DoctorDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* back + actions bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

      {/* hero card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Skeleton className="size-24 shrink-0 rounded-full" />
          <div className="w-full flex-1 space-y-3">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-64" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* info grid */}
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
        <div className="text-sm font-medium break-words text-foreground">
          {value}
        </div>
      </div>
    </div>
  )
}

interface DoctorDetailWrapperProps {
  doctorId: string
}

export default function DoctorDetailWrapper({
  doctorId,
}: DoctorDetailWrapperProps) {
  const router = useRouter()

  const { data, isLoading, isError } = useGetDOCTORByIdQuery(doctorId)
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDOCTORMutation()

  const [showDelete, setShowDelete] = useState(false)

  const doctor = data?.data

  if (isLoading) return <DoctorDetailSkeleton />

  if (isError || !doctor) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="size-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Doctor not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This doctor record may have been removed or doesn&apos;t exist.
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

  const handleDelete = async () => {
    try {
      await deleteDoctor(doctorId).unwrap()
      toast.success(`"${doctor.name}" deleted successfully.`)
      router.push("/admin/dashboard/doctors")
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      toast.error(msg ?? "Failed to delete doctor.")
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── top bar ──── */}
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
                router.replace(`/admin/dashboard/doctors/${doctor._id}/edit`)
              }
              className="gap-2"
            >
              <Pencil className="size-4" />
              Edit
            </Button>
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

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* gradient banner */}
          <div className="relative h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
          </div>

          <div className="px-6 pb-6">
            {/* avatar row — overlaps banner */}
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                {doctor.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    className="size-24 rounded-2xl object-cover shadow-lg ring-4 ring-card"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 shadow-lg ring-4 ring-card">
                    <UserCircle2 className="size-12 text-primary" />
                  </div>
                )}

                {/* availability dot */}
                <span
                  className={`absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full ring-2 ring-card ${
                    doctor.isAvailable ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                  title={doctor.isAvailable ? "Available" : "Unavailable"}
                >
                  {doctor.isAvailable ? (
                    <ShieldCheck className="size-3 text-white" />
                  ) : (
                    <ShieldX className="size-3 text-white" />
                  )}
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
                    {doctor.name}
                  </h1>
                  <Badge
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold ${
                      doctor.isAvailable
                        ? "border-green-500/30 bg-green-500/10 text-green-600"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                    variant="outline"
                  >
                    {doctor.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {doctor.email}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] text-primary"
                  >
                    <Stethoscope className="mr-1 size-3" />
                    {doctor.specialization}
                  </Badge>

                  {doctor.department && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-[11px]"
                    >
                      <Layers className="mr-1 size-3" />
                      {doctor.department}
                    </Badge>
                  )}

                  <Badge variant="outline" className="px-2 py-0.5 text-[11px]">
                    <Clock className="mr-1 size-3" />
                    {doctor.yearsOfExperience} yrs exp.
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── info grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<Phone className="size-4" />}
            label="Phone"
            value={doctor.phone ?? "—"}
          />

          <InfoCard
            icon={<Mail className="size-4" />}
            label="Email"
            value={
              <a
                href={`mailto:${doctor.email}`}
                className="text-primary hover:underline"
              >
                {doctor.email}
              </a>
            }
          />

          <InfoCard
            icon={<Building2 className="size-4" />}
            label="Hospital"
            value={doctor.hospital}
          />

          <InfoCard
            icon={<BadgeCheck className="size-4" />}
            label="License Number"
            value={doctor.licenseNumber}
            accent
          />

          <InfoCard
            icon={<DollarSign className="size-4" />}
            label="Consultation Fee"
            value={
              doctor.consultationFee != null
                ? `$${doctor.consultationFee.toLocaleString()}`
                : "—"
            }
          />

          <InfoCard
            icon={<Clock className="size-4" />}
            label="Years of Experience"
            value={`${doctor.yearsOfExperience} years`}
          />

          {doctor.qualifications?.length > 0 && (
            <InfoCard
              icon={<GraduationCap className="size-4" />}
              label="Qualifications"
              value={
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {doctor.qualifications.map((q, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              }
            />
          )}

          {doctor.createdAt && (
            <InfoCard
              icon={<CalendarClock className="size-4" />}
              label="Registered On"
              value={formatDate(doctor.createdAt)}
            />
          )}

          {doctor.updatedAt && (
            <InfoCard
              icon={<CalendarClock className="size-4" />}
              label="Last Updated"
              value={formatDate(doctor.updatedAt)}
            />
          )}
        </div>

        {/* ── patients count strip ─────────────────────────────────────────── */}
        {doctor.patientIds?.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {doctor.patientIds.length} Patient
                {doctor.patientIds.length !== 1 ? "s" : ""} assigned
              </p>
              <p className="text-xs text-muted-foreground">
                Total patients under this doctor
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Doctor?"
        description={`"${doctor.name}" will be permanently deleted and cannot be recovered.`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </>
  )
}
