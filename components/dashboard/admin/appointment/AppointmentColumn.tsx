import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Stethoscope,
  UserCircle2,
  CalendarDays,
  Clock,
  XCircle,
} from "lucide-react"

import { ColumnDef } from "@/components/dashboard/shared/DataTable"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Appointment,
  AppointmentStatus,
} from "@/interfaces/appointment.interface"

import { statusConfig, typeConfig } from "./AppointmentColorConfig"

interface AppointmentColumnActions {
  onView: (a: Appointment) => void
  onEdit: (a: Appointment) => void
  onCancel: (a: Appointment) => void
  onDelete: (a: Appointment) => void
}

function getDoctor(a: Appointment) {
  if (typeof a.doctorId === "object" && a.doctorId !== null) {
    return a.doctorId as { _id: string; name?: string; specialization?: string }
  }
  return null
}

function getPatient(a: Appointment) {
  if (typeof a.patientId === "object" && a.patientId !== null) {
    return a.patientId as { _id: string; name?: string; condition?: string }
  }
  return null
}

function formatDate(date: string | Date) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export const getAppointmentColumns = ({
  onView,
  onEdit,
  onCancel,
  onDelete,
}: AppointmentColumnActions): ColumnDef<Appointment>[] => [
  {
    key: "doctor",
    header: "Doctor",
    render: (row) => {
      const doctor = getDoctor(row)
      return (
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Stethoscope className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {doctor?.name ?? "—"}
            </p>
            {doctor?.specialization && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {doctor.specialization}
              </p>
            )}
          </div>
        </div>
      )
    },
  },

  {
    key: "patient",
    header: "Patient",
    render: (row) => {
      const patient = getPatient(row)
      return (
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserCircle2 className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {patient?.name ?? "—"}
            </p>
            {patient?.condition && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {patient.condition}
              </p>
            )}
          </div>
        </div>
      )
    },
  },

  {
    key: "appointmentDate",
    header: "Date",
    width: "120px",
    render: (row) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5 text-primary" />
        {formatDate(row.appointmentDate)}
      </div>
    ),
  },

  {
    key: "appointmentTime",
    header: "Time",
    width: "90px",
    render: (row) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        {row.appointmentTime || "—"}
      </div>
    ),
  },

  {
    key: "type",
    header: "Type",
    width: "120px",
    render: (row) => {
      const cfg = typeConfig[row.type as keyof typeof typeConfig]
      return (
        <Badge
          variant="outline"
          className={`px-2 py-0.5 text-[10px] font-semibold ${cfg?.className ?? "border-border bg-muted text-muted-foreground"}`}
        >
          {cfg?.label ?? row.type}
        </Badge>
      )
    },
  },

  {
    key: "status",
    header: "Status",
    width: "115px",
    align: "center",
    render: (row) => {
      const cfg = statusConfig[row.status as AppointmentStatus]
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${cfg?.className ?? "border-border bg-muted text-muted-foreground"}`}
        >
          <span
            className={`size-1.5 rounded-full ${cfg?.dot ?? "bg-muted-foreground"}`}
          />
          {cfg?.label ?? row.status}
        </span>
      )
    },
  },

  // {
  //   key: "reason",
  //   header: "Reason",
  //   render: (row) => (
  //     <span
  //       className="block max-w-40 truncate text-xs text-muted-foreground"
  //       title={row.reason ?? ""}
  //     >
  //       {row.reason || "—"}
  //     </span>
  //   ),
  // },

  {
    key: "actions",
    header: "",
    width: "48px",
    align: "center",
    render: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onView(row)
            }}
          >
            <Eye className="size-3.5" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(row)
            }}
          >
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>

          {row.status !== AppointmentStatus.CANCELLED &&
            row.status !== AppointmentStatus.COMPLETED && (
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-orange-600 focus:bg-orange-500/10 focus:text-orange-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel(row)
                }}
              >
                <XCircle className="size-3.5" />
                Cancel
              </DropdownMenuItem>
            )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(row)
            }}
          >
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
