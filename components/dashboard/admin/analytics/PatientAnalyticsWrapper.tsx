"use client"

import { Activity, CalendarDays, HeartPulse, Users } from "lucide-react"
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
import { usePatientAnalyticsQuery } from "@/redux/features/analytics.api"
import StatCard from "@/components/dashboard/shared/StatCard"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import ErrorPage from "@/components/dashboard/shared/ErrorPage"
import AnalyticsSkeleton from "@/components/dashboard/admin/analytics/AnalyticsSkeleton"

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

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
        title="Patients Analytics"
        description={
          isLoading ? "Loading Analytices..." : "Loading Analytices... "
        }
      />
    )
  }

  if (isError || !analytics) {
    return (
      <ErrorPage
        head="Patient Analytics"
        description="Loading Analytices Faild!"
      />
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

  const activePercentage =
    totalPatients > 0
      ? ((activePatients / totalPatients) * 100).toFixed(1)
      : "0.0"

  const recoveredPatients = Math.max(
    totalPatients - activePatients - followUpPatients,
    0
  )

  const patientStatusData = [
    {
      name: "Active",
      value: activePatients,
    },
    {
      name: "Follow-up",
      value: followUpPatients,
    },
    {
      name: "Recovered",
      value: recoveredPatients,
    },
  ].filter((item) => item.value > 0)

  const topDoctors = [...doctorPatientStats]
    .sort((a, b) => (b.patientCount ?? 0) - (a.patientCount ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Analytics"
        description={"Overview of patient statistics and activity"}
      />

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
          description="Newly registered patients"
          icon={Activity}
        />

        <StatCard
          title="Active Patients"
          value={activePatients}
          description={`${activePercentage}% of total patients`}
          icon={HeartPulse}
        />

        <StatCard
          title="Follow-up Patients"
          value={followUpPatients}
          description="Patients requiring follow-up"
          icon={CalendarDays}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Patient Growth */}

        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Patient Growth</CardTitle>

            <p className="text-sm text-muted-foreground">
              Number of patients registered over time
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0">
              {monthlyPatientStats.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  minHeight={280}
                >
                  <LineChart
                    data={monthlyPatientStats}
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
                      dataKey="patients"
                      name="Patients"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No monthly patient data available.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}

        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Patients by Condition</CardTitle>

            <p className="text-sm text-muted-foreground">
              Distribution of patients by medical condition
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0">
              {conditionStats.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  minHeight={280}
                >
                  <BarChart
                    data={conditionStats}
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
                      dataKey="condition"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
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
                      name="Patients"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No condition data available.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Doctor Patient Stats */}

        <Card className="min-w-0 rounded-2xl xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Patients per Doctor</CardTitle>

            <p className="text-sm text-muted-foreground">
              Doctors with the highest number of assigned patients
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0">
              {topDoctors.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  minHeight={280}
                >
                  <BarChart
                    data={topDoctors}
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
                      width={120}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="patientCount"
                      name="Patients"
                      fill="hsl(var(--primary))"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No doctor data available.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Status */}

        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Patient Status</CardTitle>

            <p className="text-sm text-muted-foreground">
              Current patient status distribution
            </p>
          </CardHeader>

          <CardContent>
            {patientStatusData.length > 0 ? (
              <>
                <div className="relative h-64 w-full min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={0}
                    minHeight={250}
                  >
                    <PieChart>
                      <Pie
                        data={patientStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="75%"
                        paddingAngle={4}
                      >
                        {patientStatusData.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{totalPatients}</span>

                    <span className="text-xs text-muted-foreground">
                      Patients
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-3">
                  {patientStatusData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              PIE_COLORS[index % PIE_COLORS.length],
                          }}
                        />

                        <span className="truncate">{item.name}</span>
                      </div>

                      <span className="shrink-0 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No patient status data available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* =========================
          Doctor Workload Table
      ========================= */}

      <Card className="min-w-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Doctor Patient Workload</CardTitle>

          <p className="text-sm text-muted-foreground">
            Doctors with the highest number of assigned patients
          </p>
        </CardHeader>

        <CardContent>
          {doctorPatientStats.length > 0 ? (
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
                      Workload
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topDoctors.map((doctor) => {
                    const patientCount = doctor.patientCount ?? 0

                    const workloadPercentage = Math.min(
                      (patientCount / 50) * 100,
                      100
                    )

                    return (
                      <tr key={doctor._id} className="border-b last:border-0">
                        <td className="px-2 py-4 font-medium whitespace-nowrap">
                          {doctor.name}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap text-muted-foreground">
                          {doctor.specialization}
                        </td>

                        <td className="px-2 py-4 font-medium whitespace-nowrap">
                          {patientCount}
                        </td>

                        <td className="px-2 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${workloadPercentage}%`,
                                }}
                              />
                            </div>

                            <span className="w-10 text-right text-xs text-muted-foreground">
                              {Math.round(workloadPercentage)}%
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

      {/* =========================
          All Doctors
      ========================= */}

      {doctorPatientStats.length > 5 && (
        <Card className="min-w-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">All Doctor Statistics</CardTitle>

            <p className="text-sm text-muted-foreground">
              Complete doctor patient distribution
            </p>
          </CardHeader>

          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-2 py-3 font-medium text-muted-foreground">
                      #
                    </th>

                    <th className="px-2 py-3 font-medium text-muted-foreground">
                      Doctor
                    </th>

                    <th className="px-2 py-3 font-medium text-muted-foreground">
                      Specialization
                    </th>

                    <th className="px-2 py-3 text-right font-medium text-muted-foreground">
                      Patients
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {doctorPatientStats.map((doctor, index) => (
                    <tr key={doctor._id} className="border-b last:border-0">
                      <td className="px-2 py-4 text-muted-foreground">
                        {index + 1}
                      </td>

                      <td className="px-2 py-4 font-medium">{doctor.name}</td>

                      <td className="px-2 py-4 text-muted-foreground">
                        {doctor.specialization}
                      </td>

                      <td className="px-2 py-4 text-right font-medium">
                        {doctor.patientCount ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
