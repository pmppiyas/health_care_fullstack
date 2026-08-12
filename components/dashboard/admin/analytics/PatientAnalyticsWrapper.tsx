"use client"

import {
  Activity,
  CalendarDays,
  HeartPulse,
  Stethoscope,
  Users,
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
import { usePatientAnalyticsQuery } from "@/redux/features/analytics.api"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import StatCard from "@/components/dashboard/shared/StatCard"
import ErrorPage from "@/components/dashboard/shared/ErrorPage"
import AnalyticsSkeleton from "@/components/dashboard/admin/analytics/AnalyticsSkeleton"

import { MONTH_NAMES } from "@/constant/public.constant.meta"

// Vibrant Color Palette for Charts
const VIBRANT_PALETTE = [
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
  "#6366f1", // Indigo
]

const STATUS_COLORS: Record<string, string> = {
  Active: "#10b981",
  "Follow-up": "#f59e0b",
  Recovered: "#3b82f6",
  Critical: "#f43f5e",
}

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

export default function PatientAnalyticsWrapper() {
  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
  } = usePatientAnalyticsQuery()

  if (isLoading || isFetching) {
    return (
      <AnalyticsSkeleton
        title="Patient Analytics"
        description="Loading analytics..."
      />
    )
  }

  if (isError || !analytics) {
    return (
      <ErrorPage head="Patient Analytics" description="Failed to load analytics." />
    )
  }

  const summary = analytics.summary
  const totalPatients = summary?.totalPatients ?? 0
  const activePatients = summary?.activePatients ?? 0
  const followUpPatients = summary?.followUpPatients ?? 0
  const newPatients = summary?.newPatients ?? 0
  const conditionStats = analytics.conditionStats ?? []
  const doctorPatientStats = analytics.doctorPatientStats ?? []
  const monthlyPatientStats = analytics.monthlyPatientStats ?? []

  const monthlyData = monthlyPatientStats.map((item) => ({
    month: MONTH_NAMES[item.month - 1] ?? item.month,
    Patients: item.count,
  }))

  const activePercentage =
    totalPatients > 0
      ? ((activePatients / totalPatients) * 100).toFixed(1)
      : "0.0"

  const recoveredPatients = Math.max(
    totalPatients - activePatients - followUpPatients,
    0
  )

  const patientStatusData = [
    { name: "Active", value: activePatients, color: STATUS_COLORS.Active },
    { name: "Follow-up", value: followUpPatients, color: STATUS_COLORS["Follow-up"] },
    { name: "Recovered", value: recoveredPatients, color: STATUS_COLORS.Recovered },
  ].filter((d) => d.value > 0)

  const topDoctors = [...doctorPatientStats]
    .sort((a, b) => (b.patientCount ?? 0) - (a.patientCount ?? 0))
    .slice(0, 5)

  const maxPatients = Math.max(...topDoctors.map((d) => d.patientCount ?? 0), 1)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Analytics"
        description="Overview of patient statistics, growth trends, conditions, and status."
      />

      {/* Clean Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          description="All registered patients"
          icon={Users}
        />
        <StatCard
          title="New Patients"
          value={newPatients}
          description="Newly registered"
          icon={Activity}
        />
        <StatCard
          title="Active Patients"
          value={activePatients}
          description={`${activePercentage}% of total`}
          icon={HeartPulse}
        />
        <StatCard
          title="Follow-up Patients"
          value={followUpPatients}
          description="Requiring follow-up"
          icon={CalendarDays}
        />
      </div>

      {/* Colorful Charts: Patient Growth + Conditions */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Patient Growth Area Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10">
                <Activity className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Patient Growth Trend</CardTitle>
                <p className="text-xs text-muted-foreground">Registrations over time</p>
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
                      <linearGradient id="vibrantPatientGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
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
                      dataKey="Patients"
                      name="Patients"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#vibrantPatientGrad)"
                      dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                      activeDot={{ r: 7, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No monthly patient data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patients by Condition Colorful Bar Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10">
                <HeartPulse className="size-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Patients by Condition</CardTitle>
                <p className="text-xs text-muted-foreground">Medical condition breakdown</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full min-w-0">
              {conditionStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conditionStats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    barSize={32}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="condition"
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
                    <Bar dataKey="count" name="Patients" radius={[8, 8, 0, 0]}>
                      {conditionStats.map((_, i) => (
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
                  No condition data available
                </div>
              )}
            </div>
            {/* Color Legend Pills */}
            {conditionStats.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {conditionStats.map((c, i) => (
                  <span
                    key={c.condition}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-foreground"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: VIBRANT_PALETTE[i % VIBRANT_PALETTE.length] }}
                    />
                    {c.condition}
                    <span className="font-bold text-muted-foreground">({c.count})</span>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Colorful Charts: Patients per Doctor + Patient Status Donut */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Patients per Doctor Bar Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10">
                <Stethoscope className="size-4 text-sky-600 dark:text-sky-400" />
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
              {topDoctors.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topDoctors}
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
                    <Bar dataKey="patientCount" name="Patients" radius={[0, 8, 8, 0]}>
                      {topDoctors.map((_, i) => (
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
                  No doctor data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Status Donut Chart */}
        <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Patient Status</CardTitle>
                <p className="text-xs text-muted-foreground">Current status distribution</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {patientStatusData.length > 0 ? (
              <>
                <div className="relative h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patientStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="78%"
                        paddingAngle={5}
                        strokeWidth={0}
                      >
                        {patientStatusData.map((item, idx) => (
                          <Cell key={idx} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">
                      {totalPatients}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">Patients</span>
                  </div>
                </div>

                <div className="mt-2 space-y-2.5">
                  {patientStatusData.map((item) => {
                    const pct =
                      totalPatients > 0
                        ? Math.round((item.value / totalPatients) * 100)
                        : 0
                    return (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{item.value}</span>
                          <Badge
                            variant="outline"
                            className="border-border bg-muted/30 text-xs font-semibold text-muted-foreground"
                          >
                            {pct}%
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No patient status data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Doctor Workload Table with Colorful Progress Bars */}
      <Card className="min-w-0 rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Stethoscope className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Doctor Workload Overview</CardTitle>
              <p className="text-xs text-muted-foreground">
                Doctors with the highest assigned patient workload
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
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No doctor patient data available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
