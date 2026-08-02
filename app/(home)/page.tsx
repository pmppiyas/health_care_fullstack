import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full bg-muted/40 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Modern Healthcare <br className="hidden md:block" />
            <span className="text-primary">Management System</span>
          </h1>
          <p className="mx-auto mt-4 mb-10 max-w-2xl text-xl text-muted-foreground">
            Streamline your clinic operations, manage patient records, and
            empower your doctors with our all-in-one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Features Section */}
      <section className="w-full bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold">Doctor Management</h3>
              <p className="text-muted-foreground">
                Easily manage doctor schedules, appointments, and specialized
                departments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold">Patient Records</h3>
              <p className="text-muted-foreground">
                Keep track of patient history, prescriptions, and billing in a
                secure environment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold">Analytics & Reports</h3>
              <p className="text-muted-foreground">
                Get insights into clinic performance with real-time data and
                actionable reports.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
