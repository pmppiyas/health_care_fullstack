import {
  BarChart3,
  Database,
  LockKeyhole,
  Search,
  UsersRound,
  Stethoscope,
} from "lucide-react"

const features = [
  {
    icon: Stethoscope,
    title: "Doctor Management",
    description:
      "Create, manage, search and filter doctor records from a centralized dashboard.",
  },
  {
    icon: UsersRound,
    title: "Patient Management",
    description:
      "Keep patient records organized with assignments, search, filtering and pagination.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Understand your healthcare data with meaningful charts and dashboard insights.",
  },
  {
    icon: Search,
    title: "Fast Search",
    description:
      "Quickly find doctors and patients using optimized search and filtering.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Access",
    description:
      "Role-based authentication keeps sensitive healthcare administration protected.",
  },
  {
    icon: Database,
    title: "Optimized Data",
    description:
      "Efficient MongoDB queries and indexing keep the platform fast and scalable.",
  },
]

export default function FeatureSection() {
  return (
    <section id="service" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">
            Powerful Features
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage healthcare data
          </h2>

          <p className="mt-4 text-muted-foreground">
            DocZone brings doctors, patients and analytics together in one
            simple and secure platform.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>

                <h3 className="text-lg font-semibold">{feature.title}</h3>

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
