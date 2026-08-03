import {
  BarChart3,
  Database,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Database,
    title: "Centralized Management",
    description:
      "Keep doctor and patient information organized in one centralized system.",
  },
  {
    icon: Users,
    title: "Doctor & Patient Tracking",
    description: "Easily manage doctor-patient relationships and assignments.",
  },
  {
    icon: BarChart3,
    title: "Meaningful Analytics",
    description:
      "Understand healthcare data through dashboards, statistics, and visual insights.",
  },
  {
    icon: Search,
    title: "Fast Search & Filtering",
    description:
      "Quickly find doctors and patients using powerful search and filtering tools.",
  },
  {
    icon: LayoutDashboard,
    title: "Modern Dashboard",
    description:
      "Get an easy-to-understand overview of your healthcare operations.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Role-based authentication keeps administrative features protected.",
  },
]

export default function WhyDocZoneSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wider text-primary uppercase">
            Why DocZone?
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage healthcare operations
          </h2>

          <p className="mt-5 text-muted-foreground">
            Designed to reduce administrative complexity while keeping
            healthcare information accessible and organized.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
