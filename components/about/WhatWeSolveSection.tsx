import {
  ArrowRight,
  ClipboardList,
  FileSearch,
  LineChart,
  UserRoundSearch,
} from "lucide-react"

const solutions = [
  {
    icon: ClipboardList,
    problem: "Scattered Records",
    solution:
      "Centralize doctor and patient information in one organized platform.",
  },
  {
    icon: UserRoundSearch,
    problem: "Difficult Patient Tracking",
    solution: "Track patient assignments and doctor relationships with ease.",
  },
  {
    icon: FileSearch,
    problem: "Manual Searching",
    solution:
      "Search, filter, and paginate records without going through endless lists.",
  },
  {
    icon: LineChart,
    problem: "Limited Insights",
    solution:
      "Turn healthcare data into useful statistics and visual analytics.",
  },
]

export default function WhatWeSolveSection() {
  return (
    <section className="border-y bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          {/* Left */}
          <div>
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              What We Solve
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Turning healthcare management challenges into simple workflows
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              Healthcare teams often deal with scattered records, repetitive
              administrative tasks, and limited visibility into their data.
              DocZone brings these workflows together in one place.
            </p>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {solutions.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.problem}
                  className="group rounded-2xl border bg-background p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Problem
                      </p>

                      <h3 className="mt-1 font-semibold">{item.problem}</h3>
                    </div>

                    <ArrowRight className="hidden size-5 text-primary sm:block" />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">
                        DocZone Solution
                      </p>

                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
