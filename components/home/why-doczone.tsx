import { Zap, ShieldCheck, Smartphone, Gauge } from "lucide-react"

const reasons = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Built on Next.js with optimized API routes and MongoDB indexing for sub-100ms query response times.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description:
      "JWT authentication, role-based access control, and encrypted data storage keep your healthcare data protected.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Works seamlessly on desktops, tablets, and mobile devices. Manage your clinic from anywhere.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Gauge,
    title: "Optimized Performance",
    description:
      "Paginated queries, lean projections, and database indexes ensure the platform scales with your clinic.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
]

export function WhyDocZone() {
  return (
    <section id="why" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">
            Why DocZone
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Real Healthcare Workflows
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We don't cut corners. DocZone is engineered with production-grade
            standards from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div
                className={`w-fit rounded-xl p-3 ${reason.bg} transition-transform group-hover:scale-110`}
              >
                <reason.icon className={`size-5 ${reason.color}`} />
              </div>
              <div>
                <h3 className="mb-1.5 font-semibold">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
