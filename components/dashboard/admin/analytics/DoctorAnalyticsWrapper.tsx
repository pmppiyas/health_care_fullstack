"use client"

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  Users,
  XCircle,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import StatCard from "@/components/dashboard/shared/StatCard"
import { useDoctorAnalyticsQuery } from "@/redux/features/analytics.api"
import { MONTH_NAMES } from "@/constant/public.constant.meta"
import ErrorPage from "@/components/dashboard/shared/ErrorPage"
import AnalyticsSkeleton from "@/components/dashboard/admin/analytics/AnalyticsSkeleton"

// Vibrant Color Palette for Charts
const VIBRANT_PALETTE = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-xs shadow-xl">
      {label && <p className="mb-1.5 font-semibold text-foreground">{label}</p>}
      {payload.map((p: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: p.color || p.fill }}
          />
          <span>{p.name}:</span>
          <span className="font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DoctorAnalyticsWrapper() {
  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
  } = useDoctorAnalyticsQuery()

  if (isLoading || isFetching) {
    return (
      <AnalyticsSkeleton
        title="Doctor Analytics"
        description="Loading analytics..."
      />
    )
  }

  if (isError || !analytics) {
    return (
      <ErrorPage
        head="Doctor Analytics"
        description="Failed to load analytics."
      />
    )
  }

  const { summary, specializationStats, doctorPatientStats, monthlyDoctorStats } =
    analytics

  const monthlyData = monthlyDoctorStats.map((item) => ({
    month: MONTH_NAMES[item.month - 1] ?? item.month,
    Doctors: item.count,
  }))

  const availabilityData = [
    { name: "Available", value: summary.activeDoctors, color: "#10b981" },
    { name: "Unavailable", value: summary.unavailableDoctors, color: "#f43f5e" },
  ]

  const patientDistribution = doctorPatientStats.slice(0, 5).map((d) => ({
    name: d.name,
    Patients: d.patientCount,
  }))

  const topDoctors = doctorPatientStats.slice(0, 5)

  const availPct =
    summary.totalDoctors > 0
      ? ((summary.activeDoctors / summary.totalDoctors) * 100).toFixed(1)
      : "0"

  const maxPatients = Math.max(
    ...doctorPatientStats.map((d) => d.patientCount ?? 0),
    1
  )

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Doctor Analytics"
        description={
          isFetching
            ? "Updating analytics..."
            : "Monitor doctor growth, availability, specialization, and patient workload."
        }
      />

      {/* Clean Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Doctors"
          value={summary.totalDoctors}
          description="All registered doctors"
          icon={Stethoscope}
        />
        <StatCard
          title="Available Doctors"
          value={summary.activeDoctors}
          description={`${availPct}% of total`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Patients"
          value={summary.totalPatients}
          description="Across all doctors"
          icon={Users}
        />
        <StatCard
          title="Unavailable Doctors"
          value={summary.unavailableDoctors}
          description="Currently unavailable"
          icon={XCircle}
        />
      </div>

      {/* Colorful Charts: Doctor Growth + Specialization */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Doctor Growth Area Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10">
                <Activity className="size-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Doctor Growth Trend</CardTitle>
                <p className="text-xs text-muted-foreground">
                  New doctor registrations per month
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full min-w-0">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="vibrantGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Doctors"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#vibrantGrowthGrad)"
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                      activeDot={{ r: 7, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No growth data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctors by Specialization Colorful Bar Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10">
                <Stethoscope className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Doctors by Specialization</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution across specialties</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full min-w-0">
              {specializationStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={specializationStats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    barSize={32}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="specialization"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      interval={0}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
                    <Bar dataKey="count" name="Doctors" radius={[8, 8, 0, 0]}>
                      {specializationStats.map((_, i) => (
                        <Cell
                          key={i}
                          fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No specialization data available
                </div>
              )}
            </div>
            {/* Color Legend Pills */}
            {specializationStats.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {specializationStats.map((s, i) => (
                  <span
                    key={s.specialization}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-foreground"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: VIBRANT_PALETTE[i % VIBRANT_PALETTE.length] }}
                    />
                    {s.specialization}
                    <span className="font-bold text-muted-foreground">({s.count})</span>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Colorful Charts: Patients per Doctor + Doctor Availability Donut */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Horizontal Colorful Bar Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Patients per Doctor</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Doctors with highest patient workload
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full min-w-0">
              {patientDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientDistribution}
                    layout="vertical"
                    margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
                    barSize={16}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
                    <Bar dataKey="Patients" radius={[0, 8, 8, 0]}>
                      {patientDistribution.map((_, i) => (
                        <Cell
                          key={i}
                          fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No patient distribution data
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Availability Donut Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10">
                <CalendarDays className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Doctor Availability</CardTitle>
                <p className="text-xs text-muted-foreground">Current active status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {summary.totalDoctors > 0 ? (
              <>
                <div className="relative h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={availabilityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="78%"
                        paddingAngle={5}
                        strokeWidth={0}
                      >
                        {availabilityData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">
                      {summary.totalDoctors}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">Doctors</span>
                  </div>
                </div>

                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-[#10b981]" />
                      <span className="font-medium text-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{summary.activeDoctors}</span>
                      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {availPct}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-[#f43f5e]" />
                      <span className="font-medium text-foreground">Unavailable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{summary.unavailableDoctors}</span>
                      <Badge className="border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {(100 - parseFloat(availPct)).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No availability data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Doctors Workload Table with Colorful Progress Bars */}
      <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Stethoscope className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Top Doctors Workload</CardTitle>
              <p className="text-xs text-muted-foreground">
                Doctors with the highest assigned patient volume
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {topDoctors.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Doctor
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Specialization
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Patients
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Workload Ratio
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topDoctors.map((doctor, i) => {
                    const count = doctor.patientCount ?? 0
                    const pct = Math.round((count / maxPatients) * 100)
                    const barColor = VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]

                    return (
                      <tr key={doctor._id} className="transition-colors hover:bg-muted/40">
                        <td className="px-3 py-3.5 font-medium text-foreground whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: barColor }}
                            />
                            {doctor.name}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-muted-foreground whitespace-nowrap">
                          {doctor.specialization}
                        </td>
                        <td className="px-3 py-3.5 font-bold text-foreground whitespace-nowrap">
                          {count}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: barColor,
                                }}
                              />
                            </div>
                            <span className="w-10 text-xs font-medium text-muted-foreground">
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-right whitespace-nowrap">
                          {doctor.isAvailable ? (
                            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              Available
                            </Badge>
                          ) : (
                            <Badge className="border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400">
                              Unavailable
                            </Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              No doctor data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
