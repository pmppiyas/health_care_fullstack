"use client"

import { useGetDashboardOverviewQuery } from "@/redux/features/dashboard.api"
import { useAppSelector } from "@/redux/hooks"
import StatsGrid from "./StatsGrid"
import AppointmentStatusChart from "./AppointmentStatusChart"
import MonthlyTrendChart from "./MonthlyTrendChart"
import RecentAppointments from "./RecentAppointments"
import { Skeleton } from "@/components/ui/skeleton"
import OverviewHeader from "@/components/dashboard/admin/overview/OverviewHeader"

function OverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
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
      <OverviewHeader user={user} />

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
