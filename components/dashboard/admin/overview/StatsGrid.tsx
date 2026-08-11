"use client"

import {
  Users,
  Stethoscope,
  CalendarCheck,
  CalendarClock,
  TrendingUp,
  Activity,
  CheckCircle2,
  UserCheck,
} from "lucide-react"
import { DashboardStats } from "@/interfaces/dashboard.interface"
import { cn } from "@/lib/utils"

interface StatItem {
  title: string
  value: number
  sub: string
  icon: React.ElementType
  color: string
  bg: string
}

interface StatsGridProps {
  stats: DashboardStats
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items: StatItem[] = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      sub: `${stats.activeDoctors} available`,
      icon: Stethoscope,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      sub: `${stats.activePatients} active`,
      icon: Users,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      sub: `${stats.scheduledAppointments} scheduled total`,
      icon: CalendarCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      sub: `${stats.completedAppointments} completed`,
      icon: CalendarClock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Subtle top-left glow */}
            <div
              className={cn(
                "absolute -top-6 -left-6 size-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30",
                item.bg
              )}
            />

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {item.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>

              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  item.bg
                )}
              >
                <Icon className={cn("size-5", item.color)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
