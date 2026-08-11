import {
  AppointmentStatus,
  AppointmentType,
} from "@/interfaces/appointment.interface"

export const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string; dot: string }
> = {
  [AppointmentStatus.SCHEDULED]: {
    label: "Scheduled",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    dot: "bg-blue-500",
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Confirmed",
    className: "border-green-500/20 bg-green-500/10 text-green-600",
    dot: "bg-green-500",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Completed",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },
  [AppointmentStatus.CANCELLED]: {
    label: "Cancelled",
    className: "border-red-500/20 bg-red-500/10 text-red-600",
    dot: "bg-red-400",
  },
  [AppointmentStatus.NO_SHOW]: {
    label: "No Show",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-600",
    dot: "bg-orange-400",
  },
}

export const typeConfig: Record<
  AppointmentType,
  { label: string; className: string }
> = {
  [AppointmentType.CONSULTATION]: {
    label: "Consultation",
    className: "border-primary/20 bg-primary/5 text-primary",
  },
  [AppointmentType.FOLLOW_UP]: {
    label: "Follow-up",
    className: "border-purple-500/20 bg-purple-500/10 text-purple-600",
  },
  [AppointmentType.EMERGENCY]: {
    label: "Emergency",
    className: "border-red-500/30 bg-red-500/10 text-red-700 font-semibold",
  },
}
