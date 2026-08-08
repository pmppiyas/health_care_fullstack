"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Droplets,
  HeartPulse,
  Pill,
  AlertTriangle,
  UserCircle2,
  CalendarClock,
  CalendarCheck,
  ShieldAlert,
  Users,
  ClipboardList,
  Stethoscope,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"

import {
  useGetPATIENTByIdQuery,
  useDeletePATIENTMutation,
} from "@/redux/features/patient.api"
import { PatientStatus, Gender } from "@/app/api/patient/patient.interface"

function formatDate(date?: Date | string) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

const statusConfig: Record<
  string,
  { label: string; banner: string; badge: string; dot: string }
> = {
  [PatientStatus.ACTIVE]: {
    label: "Active",
    banner: "from-green-500/20 via-green-500/10",
    badge: "border-green-500/30 bg-green-500/10 text-green-600",
    dot: "bg-green-500",
  },
  [PatientStatus.INACTIVE]: {
    label: "Inactive",
    banner: "from-muted/60 via-muted/30",
    badge: "border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  [PatientStatus.DISCHARGED]: {
    label: "Discharged",
    banner: "from-blue-500/20 via-blue-500/10",
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-600",
    dot: "bg-blue-500",
  },
}

const genderLabel: Record<string, string> = {
  [Gender.MALE]: "Male",
  [Gender.FEMALE]: "Female",
  [Gender.OTHER]: "Other",
}

function PatientDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
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
  wide?: boolean
}

function InfoCard({ icon, label, value, accent, wide }: InfoCardProps) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${
        wide ? "sm:col-span-2 lg:col-span-3" : ""
      } ${
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

function TagList({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-muted-foreground">—</span>
  return (
    <div className="mt-0.5 flex flex-wrap gap-1">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-block rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

interface PatientDetailWrapperProps {
  patientId: string
}

export default function PatientDetailWrapper({
  patientId,
}: PatientDetailWrapperProps) {
  const router = useRouter()

  const { data, isLoading, isError } = useGetPATIENTByIdQuery(patientId)
  const [deletePatient, { isLoading: isDeleting }] = useDeletePATIENTMutation()

  const [showDelete, setShowDelete] = useState(false)

  const patient = data?.data

  if (isLoading) return <PatientDetailSkeleton />

  if (isError || !patient) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="size-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Patient not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This patient record may have been removed or doesn&apos;t exist.
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

  const status = patient.status ?? PatientStatus.INACTIVE
  const cfg = statusConfig[status] ?? statusConfig[PatientStatus.INACTIVE]

  const handleDelete = async () => {
    try {
      await deletePatient(patientId).unwrap()
      toast.success(`"${patient.name}" deleted successfully.`)
      router.push("/admin/dashboard/patients")
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      toast.error(msg ?? "Failed to delete patient.")
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── top bar ─────────────────────────────────────────────────────── */}
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
                router.replace(`/admin/dashboard/patients/${patient._id}/edit`)
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

        {/* ── hero card ───────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* gradient banner — color driven by status */}
          <div
            className={`h-24 bg-gradient-to-r ${cfg.banner} relative to-transparent`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {/* avatar */}
              <div className="relative shrink-0">
                {patient.photoUrl ? (
                  <img
                    src={patient.photoUrl}
                    alt={patient.name}
                    className="size-24 rounded-2xl object-cover shadow-lg ring-4 ring-card"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 shadow-lg ring-4 ring-card">
                    <UserCircle2 className="size-12 text-primary" />
                  </div>
                )}
                {/* status dot */}
                <span
                  className={`absolute -right-1 -bottom-1 size-5 rounded-full ring-2 ring-card ${cfg.dot}`}
                  title={cfg.label}
                />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
                    {patient.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold ${cfg.badge}`}
                  >
                    {cfg.label}
                  </Badge>
                </div>

                {patient.email && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {patient.email}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] text-primary"
                  >
                    <HeartPulse className="mr-1 size-3" />
                    {patient.condition}
                  </Badge>

                  <Badge variant="outline" className="px-2 py-0.5 text-[11px]">
                    <Users className="mr-1 size-3" />
                    {patient.age} yrs &bull;{" "}
                    {genderLabel[patient.gender] ?? patient.gender}
                  </Badge>

                  {patient.bloodGroup && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-[11px]"
                    >
                      <Droplets className="mr-1 size-3" />
                      {patient.bloodGroup}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── info grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patient.phone && (
            <InfoCard
              icon={<Phone className="size-4" />}
              label="Phone"
              value={patient.phone}
            />
          )}

          {patient.email && (
            <InfoCard
              icon={<Mail className="size-4" />}
              label="Email"
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

          {patient.address && (
            <InfoCard
              icon={<MapPin className="size-4" />}
              label="Address"
              value={patient.address}
            />
          )}

          <InfoCard
            icon={<CalendarClock className="size-4" />}
            label="Admission Date"
            value={formatDate(patient.admissionDate)}
            accent
          />

          {patient.dischargeDate && (
            <InfoCard
              icon={<CalendarCheck className="size-4" />}
              label="Discharge Date"
              value={formatDate(patient.dischargeDate)}
            />
          )}

          {patient.diagnosis && (
            <InfoCard
              icon={<Stethoscope className="size-4" />}
              label="Diagnosis"
              value={patient.diagnosis}
              wide
            />
          )}

          {(patient.allergies?.length ?? 0) > 0 && (
            <InfoCard
              icon={<AlertTriangle className="size-4" />}
              label="Allergies"
              value={<TagList items={patient.allergies} />}
            />
          )}

          {(patient.currentMedications?.length ?? 0) > 0 && (
            <InfoCard
              icon={<Pill className="size-4" />}
              label="Current Medications"
              value={<TagList items={patient.currentMedications} />}
            />
          )}

          {(patient as unknown as { createdAt?: string }).createdAt && (
            <InfoCard
              icon={<CalendarClock className="size-4" />}
              label="Registered On"
              value={formatDate(
                (patient as unknown as { createdAt: string }).createdAt
              )}
            />
          )}
        </div>

        {/* ── emergency contact ────────────────────────────────────────────── */}
        {patient.emergencyContact && (
          <div className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-destructive" />
              <p className="text-sm font-semibold text-destructive">
                Emergency Contact
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="mb-0.5 text-xs tracking-wide text-muted-foreground uppercase">
                  Name
                </p>
                <p className="text-sm font-medium">
                  {patient.emergencyContact.name}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs tracking-wide text-muted-foreground uppercase">
                  Relationship
                </p>
                <p className="text-sm font-medium">
                  {patient.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs tracking-wide text-muted-foreground uppercase">
                  Phone
                </p>
                <a
                  href={`tel:${patient.emergencyContact.phone}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {patient.emergencyContact.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── assigned doctors strip ───────────────────────────────────────── */}
        {(patient.doctorIds?.length ?? 0) > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {patient.doctorIds.length} Doctor
                {patient.doctorIds.length !== 1 ? "s" : ""} assigned
              </p>
              <p className="text-xs text-muted-foreground">
                Total doctors managing this patient
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── delete confirm ────────────────────────────────────────────────── */}
      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Patient?"
        description={`"${patient.name}" will be permanently deleted and cannot be recovered.`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </>
  )
}
