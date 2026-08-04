import { UserPlus, ClipboardList, TrendingUp } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Add a Doctor",
    description:
      "An admin registers a doctor with their specialization, hospital, license number, qualifications, and contact details. The doctor profile is instantly available for patient assignment.",
    items: [
      "Create user account with DOCTOR role",
      "Fill in doctor profile details",
      "Set availability & consultation fee",
    ],
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Manage Patients",
    description:
      "Add patient profiles with their medical condition, diagnosis, blood group, medications, allergies, and emergency contacts. Assign one or more doctors to each patient.",
    items: [
      "Create patient profile & medical info",
      "Assign doctors via relationship type",
      "Track admission & discharge dates",
    ],
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Track Analytics",
    description:
      "View real-time analytics — how many patients each doctor manages, patient status distribution, hospital-wise breakdowns, and overall platform health metrics.",
    items: [
      "View doctor-patient assignments",
      "Monitor patient status changes",
      "Generate reports & insights",
    ],
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and Running in 3 Simple Steps
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            DocZone is designed to be intuitive. No complex setup — just
            straightforward healthcare management.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-8 left-1/2 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Step number */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl font-black text-border">
                    {step.step}
                  </span>
                  <div className={`rounded-xl p-2.5 ${step.bg}`}>
                    <step.icon className={`size-5 ${step.color}`} />
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* Checklist */}
                <ul className="mt-auto space-y-1.5">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 font-bold ${step.color}`}>
                        ✓
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
