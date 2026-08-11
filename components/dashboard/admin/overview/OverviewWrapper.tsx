"use client"

import { useGetDashboardOverviewQuery } from "@/redux/features/dashboard.api"
import { useAppSelector } from "@/redux/hooks"
import StatsGrid from "./StatsGrid"
import AppointmentStatusChart from "./AppointmentStatusChart"
import MonthlyTrendChart from "./MonthlyTrendChart"
import RecentAppointments from "./RecentAppointments"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutDashboard } from "lucide-react"

function OverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-10 w-72 rounded-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function OverviewWrapper() {
  const { data, isLoading, isError } = useGetDashboardOverviewQuery()
  const user = useAppSelector((s) => s.auth.user)

  if (isLoading) return <OverviewSkeleton />

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 text-sm text-destructive">
        Failed to load dashboard data. Please refresh.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <LayoutDashboard className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {user?.name ?? "Admin"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening in your clinic today.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <StatsGrid stats={data.stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AppointmentStatusChart data={data.appointmentsByStatus} />
        <MonthlyTrendChart data={data.monthlyAppointments} />
      </div>

      {/* Recent appointments */}
      <RecentAppointments appointments={data.recentAppointments} />
    </div>
  )
}
