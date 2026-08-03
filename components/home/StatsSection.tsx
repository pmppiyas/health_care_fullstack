import { Activity, CalendarCheck, Stethoscope, Users } from "lucide-react"

const stats = [
  {
    value: "500+",
    label: "Doctors",
    description: "Healthcare professionals",
    icon: Stethoscope,
  },
  {
    value: "2,000+",
    label: "Patients",
    description: "Patient records managed",
    icon: Users,
  },
  {
    value: "99.9%",
    label: "Uptime",
    description: "Reliable platform",
    icon: Activity,
  },
  {
    value: "24/7",
    label: "Tracking",
    description: "Always available",
    icon: CalendarCheck,
  },
]

export function StatsSection() {
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border bg-background p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>

                <p className="mt-1 font-medium">{stat.label}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
