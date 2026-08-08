"use client"

import { Activity, CalendarDays, Stethoscope, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import { useDoctorAnalyticsQuery } from "@/redux/features/analytics.api"
import { MONTH_NAMES } from "@/constant/public.constant.meta"
import DoctorAnalyticsSkeleton from "@/components/dashboard/admin/analytics/DoctorAnalyticsSkeleton"
import DoctorAnalyticsError from "@/components/dashboard/admin/analytics/DoctorAnalyticsError"

type StatCardProps = {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="w-full rounded-2xl">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm text-muted-foreground">{title}</p>

          <p className="text-2xl font-bold tracking-tight">{value}</p>

          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"]

export default function DoctorAnalyticsWrapper() {
  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
  } = useDoctorAnalyticsQuery()

  if (isLoading) {
    return <DoctorAnalyticsSkeleton />
  }

  if (isError || !analytics) {
    return <DoctorAnalyticsError />
  }

  const {
    summary,
    specializationStats,
    doctorPatientStats,
    monthlyDoctorStats,
  } = analytics

  const monthlyDoctorData = monthlyDoctorStats.map((item) => ({
    month: MONTH_NAMES[item.month - 1] ?? item.month,
    doctors: item.count,
  }))

  const availabilityData = [
    {
      name: "Available",
      value: summary.activeDoctors,
    },
    {
      name: "Unavailable",
      value: summary.unavailableDoctors,
    },
  ]

  const patientDistribution = doctorPatientStats.slice(0, 5).map((doctor) => ({
    name: doctor.name,
    patients: doctor.patientCount,
  }))

  const topDoctors = doctorPatientStats.slice(0, 5)

  const availabilityPercentage =
    summary.totalDoctors > 0
      ? ((summary.activeDoctors / summary.totalDoctors) * 100).toFixed(1)
      : "0"

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Doctor Analytics"
        description="Monitor doctor growth, availability, specialization, and patient workload."
      />

      {/* Optional fetching indicator */}
      {isFetching && (
        <div className="text-xs text-muted-foreground">
          Updating analytics...
        </div>
      )}

      {/* Stats */}
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
          description={`${availabilityPercentage}% of total`}
          icon={Activity}
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
          icon={CalendarDays}
        />
      </div>

      {/* Doctor Growth + Specialization */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Doctor Growth */}
        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Doctor Growth</CardTitle>

            <p className="text-sm text-muted-foreground">
              Number of doctors registered over time
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0">
              {monthlyDoctorData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyDoctorData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />

                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="doctors"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No doctor growth data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">
              Doctors by Specialization
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Distribution across specialties
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0">
              {specializationStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={specializationStats}
                    margin={{
                      top: 5,
                      right: 5,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />

                    <XAxis
                      dataKey="specialization"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      interval={0}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Doctors"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No specialization data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Distribution + Availability */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Patients per Doctor */}
        <Card className="min-w-0 rounded-2xl xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Patients per Doctor</CardTitle>

            <p className="text-sm text-muted-foreground">
              Doctors with the highest number of assigned patients
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0">
              {patientDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientDistribution}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 10,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />

                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="patients"
                      name="Patients"
                      fill="hsl(var(--primary))"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No patient distribution data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Doctor Availability</CardTitle>

            <p className="text-sm text-muted-foreground">
              Current availability status
            </p>
          </CardHeader>

          <CardContent>
            <div className="relative h-64 w-full">
              {summary.totalDoctors > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={availabilityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="75%"
                        paddingAngle={4}
                      >
                        {availabilityData.map((item, index) => (
                          <Cell key={item.name} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">
                      {summary.totalDoctors}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Doctors
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No availability data
                </div>
              )}
            </div>

            <div className="mt-2 space-y-3">
              {availabilityData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: PIE_COLORS[index],
                      }}
                    />

                    <span className="truncate">{item.name}</span>
                  </div>

                  <span className="shrink-0 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Doctors */}
      <Card className="min-w-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Top Doctors</CardTitle>

          <p className="text-sm text-muted-foreground">
            Doctors with the highest patient workload
          </p>
        </CardHeader>

        <CardContent>
          {topDoctors.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-2 py-3 font-medium whitespace-nowrap text-muted-foreground">
                      Doctor
                    </th>

                    <th className="px-2 py-3 font-medium whitespace-nowrap text-muted-foreground">
                      Specialization
                    </th>

                    <th className="px-2 py-3 font-medium whitespace-nowrap text-muted-foreground">
                      Patients
                    </th>

                    <th className="px-2 py-3 text-right font-medium whitespace-nowrap text-muted-foreground">
                      Availability
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topDoctors.map((doctor) => (
                    <tr key={doctor._id} className="border-b last:border-0">
                      <td className="px-2 py-4 font-medium whitespace-nowrap">
                        {doctor.name}
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap text-muted-foreground">
                        {doctor.specialization}
                      </td>

                      <td className="px-2 py-4 font-medium whitespace-nowrap">
                        {doctor.patientCount}
                      </td>

                      <td className="px-2 py-4 text-right whitespace-nowrap">
                        <span
                          className={
                            doctor.isAvailable
                              ? "text-sm font-medium text-emerald-600"
                              : "text-sm font-medium text-muted-foreground"
                          }
                        >
                          {doctor.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                    </tr>
                  ))}
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
