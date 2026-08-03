import {
  Stethoscope,
  UserRound,
  Search,
  BarChart3,
  ShieldCheck,
} from "lucide-react"

const features = [
  {
    icon: Stethoscope,
    title: "Doctor Management",
    description:
      "Create, update, and manage complete doctor profiles — including specialization, hospital affiliation, license number, qualifications, and availability status.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: UserRound,
    title: "Patient Management",
    description:
      "Maintain comprehensive patient records with medical conditions, diagnoses, medications, allergies, emergency contacts, and admission history.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Search,
    title: "Smart Search & Filter",
    description:
      "Instantly find doctors by specialization or hospital, and filter patients by status, gender, or condition with real-time search and pagination.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Visualize key metrics — doctors per hospital, patients per doctor, admission trends, and status breakdowns — to make data-driven decisions.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Role-based access control for Admins, Doctors, and Patients. JWT-secured endpoints, session management, and account status control.",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
]

export function ServicesSection() {
  return (
    <section id="service" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Run a Modern Clinic
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            DocZone provides a complete suite of tools designed for healthcare
            administrators and medical professionals.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl border ${feature.border} bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 ${
                i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${feature.bg}`}
              >
                <feature.icon className={`size-5 ${feature.color}`} />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
