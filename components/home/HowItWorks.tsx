import { ClipboardList, Link2, BarChart3 } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Add Your Records",
    description:
      "Create doctor and patient profiles with the information your clinic needs.",
  },
  {
    number: "02",
    icon: Link2,
    title: "Connect Doctors & Patients",
    description:
      "Assign patients to doctors and manage their relationships from one place.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Track & Analyze",
    description:
      "Use the dashboard to monitor records, assignments and healthcare trends.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">
            How It Works
          </span>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Simple workflow, powerful results
          </h2>

          <p className="mt-4 text-muted-foreground">
            Manage your healthcare data in just a few simple steps.
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border bg-background p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>

                  <span className="text-4xl font-bold text-primary/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
