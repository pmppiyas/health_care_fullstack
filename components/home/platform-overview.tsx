import { Users, UserRound, FileText, ShieldCheck } from "lucide-react"

const stats = [
  {
    icon: Users,
    label: "Total Doctors",
    value: "128",
    description: "Actively managing patient care",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: UserRound,
    label: "Total Patients",
    value: "2,041",
    description: "Records tracked in real-time",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: FileText,
    label: "Patient Records",
    value: "5,783",
    description: "Diagnoses, medications & notes",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    label: "Secure Management",
    value: "100%",
    description: "End-to-end encrypted & role-based",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
]

export function PlatformOverview() {
  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Platform at a Glance
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real numbers. Real impact. Built for healthcare professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${stat.bg} transition-transform group-hover:scale-110`}
              >
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 font-semibold">{stat.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
