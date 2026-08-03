import { Activity, HeartHandshake, Target } from "lucide-react"

const missionPoints = [
  {
    icon: Target,
    title: "Our Goal",
    description:
      "Make healthcare administration simpler, faster, and more organized for modern clinics.",
  },
  {
    icon: HeartHandshake,
    title: "Our Approach",
    description:
      "Connect doctors, patients, and administrative data through one intuitive platform.",
  },
  {
    icon: Activity,
    title: "Our Impact",
    description:
      "Help healthcare teams spend less time managing data and more time focusing on patients.",
  },
]

export default function MissionSection() {
  return (
    <section className="border-y bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wider text-primary uppercase">
            Our Mission
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Building a simpler future for healthcare management
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            DocZone was created with a simple idea: healthcare administration
            should not be complicated. Our platform brings essential tools
            together so healthcare teams can manage information efficiently.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {missionPoints.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>

                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
