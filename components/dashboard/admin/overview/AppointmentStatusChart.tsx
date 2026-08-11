"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AppointmentStatusStat } from "@/interfaces/dashboard.interface"

const STATUS_COLORS: Record<string, string> = {
  Scheduled: "#6366f1",
  Confirmed: "#10b981",
  Completed: "#3b82f6",
  Cancelled: "#f43f5e",
  "No Show": "#f59e0b",
}

const FALLBACK_COLORS = [
  "#6366f1",
  "#10b981",
  "#3b82f6",
  "#f43f5e",
  "#f59e0b",
  "#8b5cf6",
]

interface AppointmentStatusChartProps {
  data: AppointmentStatusStat[]
}

export default function AppointmentStatusChart({
  data,
}: AppointmentStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No appointment data yet
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Appointments by Status</h3>
        <p className="text-xs text-muted-foreground">
          Distribution across all statuses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.status}
                fill={
                  STATUS_COLORS[entry.status] ??
                  FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                }
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              fontSize: "13px",
            }}
            formatter={(value: any, name: any) => [value ?? 0, name ?? ""]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: "12px" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
