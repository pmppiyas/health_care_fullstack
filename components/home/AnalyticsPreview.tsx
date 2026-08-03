const hospitalData = [
  { hospital: "City Hospital", doctors: 38, color: "bg-primary" },
  { hospital: "Apollo Clinic", doctors: 29, color: "bg-violet-500" },
  { hospital: "Square Medical", doctors: 22, color: "bg-emerald-500" },
  { hospital: "Ibn Sina", doctors: 17, color: "bg-amber-500" },
  { hospital: "Popular Hospital", doctors: 14, color: "bg-rose-500" },
]

const patientStats = [
  { label: "Active", value: 54, color: "bg-emerald-500" },
  { label: "Recovered", value: 28, color: "bg-primary" },
  { label: "Critical", value: 11, color: "bg-rose-500" },
  { label: "Under Observation", value: 7, color: "bg-amber-500" },
]

const max = Math.max(...hospitalData.map((d) => d.doctors))

export function AnalyticsPreview() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">
            Analytics
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Data-Driven Healthcare Insights
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Understand your clinic's performance with built-in reporting on
            doctors, patients, and assignment trends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Doctors per hospital — bar chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-1 font-semibold">Doctors per Hospital</h3>
            <p className="mb-6 text-xs text-muted-foreground">
              Distribution across affiliated institutions
            </p>
            <div className="space-y-3">
              {hospitalData.map((item) => (
                <div key={item.hospital}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {item.hospital}
                    </span>
                    <span className="font-semibold">{item.doctors}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${(item.doctors / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient statistics — donut-style */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-1 font-semibold">Patient Status Distribution</h3>
            <p className="mb-6 text-xs text-muted-foreground">
              Current patient status breakdown
            </p>

            {/* Stacked bar */}
            <div className="mb-6 flex h-4 w-full overflow-hidden rounded-full">
              {patientStats.map((s) => (
                <div
                  key={s.label}
                  className={`${s.color}`}
                  style={{ width: `${s.value}%` }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {patientStats.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${s.color} shrink-0`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="ml-auto text-xs font-semibold">
                    {s.value}%
                  </span>
                </div>
              ))}
            </div>

            {/* Patients per doctor */}
            <div className="mt-6 rounded-xl bg-muted/50 p-4">
              <p className="mb-1 text-xs text-muted-foreground">
                Avg. Patients per Doctor
              </p>
              <p className="text-2xl font-bold">
                15.9{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  patients / doctor
                </span>
              </p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                ↑ 3.2% from last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
