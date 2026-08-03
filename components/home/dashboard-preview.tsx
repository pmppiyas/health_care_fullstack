import {
  Users,
  UserRound,
  FileText,
  ShieldCheck,
  Activity,
  TrendingUp,
} from "lucide-react"

const rows = [
  {
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
    name: "Dr. Arif Rahman",
    role: "Cardiologist · City Hospital",
    status: "Active",
    patients: 24,
  },
  {
    icon: UserRound,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    name: "Farida Begum",
    role: "Patient · Under Observation",
    status: "Critical",
    patients: null,
  },
  {
    icon: Users,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    name: "Dr. Sumon Hossain",
    role: "Neurologist · Apollo Clinic",
    status: "Active",
    patients: 18,
  },
]

export function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Fade out at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-yellow-400" />
          <span className="size-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-muted-foreground">
            DocZone — Dashboard
          </span>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {[
            { icon: Users, label: "Total Doctors", value: "128", change: "+4%" },
            { icon: UserRound, label: "Total Patients", value: "2,041", change: "+12%" },
            { icon: FileText, label: "Patient Records", value: "5,783", change: "+8%" },
            { icon: ShieldCheck, label: "Secure Sessions", value: "100%", change: "Encrypted" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-border bg-background p-3"
            >
              <div className="flex items-center justify-between">
                <card.icon className="size-4 text-primary" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  {card.change}
                </span>
              </div>
              <p className="mt-2 text-xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Table preview */}
        <div className="px-4 pb-4">
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-xs font-semibold">Recent Records</span>
              <TrendingUp className="size-3.5 text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-1.5 ${row.bg}`}>
                      <row.icon className={`size-3.5 ${row.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.role}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
