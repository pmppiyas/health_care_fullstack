"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  PatientStatusStat,
  PatientConditionStat,
} from "@/interfaces/dashboard.interface"
import { Users, HeartPulse } from "lucide-react"

// ── Status colours ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; bar: string; dot: string; pie: string }
> = {
  Active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    pie: "#10b981",
  },
  Inactive: {
    bg: "bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    bar: "bg-slate-400",
    dot: "bg-slate-400",
    pie: "#94a3b8",
  },
  Recovered: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    pie: "#3b82f6",
  },
  Critical: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    dot: "bg-rose-500",
    pie: "#f43f5e",
  },
}

const CONDITION_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6",
]

interface Props {
  byStatus: PatientStatusStat[]
  byCondition: PatientConditionStat[]
  totalPatients: number
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function StatusTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{d.name}</p>
      <p className="text-muted-foreground">
        Patients: <span className="font-bold text-foreground">{d.value}</span>
      </p>
    </div>
  )
}

// ── Custom pie label ───────────────────────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, outerRadius, percent, name }: any) {
  if (percent < 0.07) return null
  const RAD = Math.PI / 180
  const r = outerRadius + 18
  const x = cx + r * Math.cos(-midAngle * RAD)
  const y = cy + r * Math.sin(-midAngle * RAD)
  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--muted-foreground))"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={10}
    >
      {name} {Math.round(percent * 100)}%
    </text>
  )
}

export default function PatientAnalytics({
  byStatus,
  byCondition,
  totalPatients,
}: Props) {
  const total = byStatus.reduce((s, d) => s + d.count, 0) || totalPatients || 1

  const pieData = byStatus.map((s) => ({
    name: s.status,
    value: s.count,
    color:
      STATUS_CONFIG[s.status]?.pie ??
      CONDITION_COLORS[byStatus.indexOf(s) % CONDITION_COLORS.length],
  }))

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10">
          <Users className="size-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Patient Analytics</h3>
          <p className="text-xs text-muted-foreground">Status distribution & top conditions</p>
        </div>
        <span className="ml-auto text-2xl font-bold text-foreground">{totalPatients}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Status donut + bars */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Donut chart */}
          {pieData.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                By Status
              </p>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                    strokeWidth={0}
                    dataKey="value"
                    labelLine={false}
                    label={<PieLabel />}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<StatusTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Status legend pills */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {byStatus.map((s) => {
                  const cfg = STATUS_CONFIG[s.status]
                  return (
                    <span
                      key={s.status}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cfg?.bg ?? "bg-muted"} ${cfg?.text ?? "text-muted-foreground"}`}
                    >
                      <span className={`size-1.5 rounded-full ${cfg?.dot ?? "bg-muted-foreground"}`} />
                      {s.status} ({s.count})
                    </span>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground">No status data</p>
          )}

          {/* Progress bar breakdown */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status Breakdown
            </p>
            <div className="space-y-3">
              {byStatus.map((s) => {
                const cfg = STATUS_CONFIG[s.status]
                const pct = Math.round((s.count / total) * 100)
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${cfg?.text ?? "text-muted-foreground"}`}>
                        {s.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {s.count} <span className="opacity-60">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cfg?.bar ?? "bg-primary"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top Conditions */}
        {byCondition.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse className="size-3.5 text-rose-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Top Conditions
              </p>
            </div>
            <div className="space-y-2">
              {byCondition.map((c, i) => {
                const pct = Math.round((c.count / total) * 100)
                const color = CONDITION_COLORS[i % CONDITION_COLORS.length]
                return (
                  <div key={c.condition} className="flex items-center gap-3">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="flex-1 truncate text-xs text-foreground">
                      {c.condition}
                    </span>
                    <div className="flex w-24 items-center gap-2">
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                      <span className="w-5 shrink-0 text-right text-[10px] text-muted-foreground">
                        {c.count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
