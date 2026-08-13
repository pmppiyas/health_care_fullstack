"use client"

import Link from "next/link"
import { ArrowUpRight, Clock } from "lucide-react"
import { RecentAppointment } from "@/interfaces/dashboard.interface"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  Scheduled:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Confirmed:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Completed:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Cancelled:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "No Show":
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

function getPatient(a: RecentAppointment) {
  if (typeof a.patientId === "object" && a.patientId !== null) return a.patientId
  return null
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface DoctorRecentAppointmentsProps {
  appointments: RecentAppointment[]
}

export default function DoctorRecentAppointments({
  appointments,
}: DoctorRecentAppointmentsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-base font-semibold">Recent Appointments</h3>
          <p className="text-xs text-muted-foreground">Last 5 appointments</p>
        </div>
        <Link
          href="/doctor/dashboard/appointments"
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
        >
          View All
          <ArrowUpRight className="size-3" />
        </Link>
      </div>

      {/* Table */}
      {appointments.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No appointments yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  Patient
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  Date & Time
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.map((appt) => {
                const patient = getPatient(appt)
                return (
                  <tr
                    key={appt._id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium leading-tight">
                        {patient?.name ?? "—"}
                      </div>
                      {patient?.condition && (
                        <div className="text-xs text-muted-foreground">
                          {patient.condition}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium leading-tight">
                        {formatDate(appt.appointmentDate)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {appt.appointmentTime}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-muted-foreground">
                        {appt.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          STATUS_STYLES[appt.status] ??
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
