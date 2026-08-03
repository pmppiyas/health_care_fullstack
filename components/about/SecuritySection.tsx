import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserCog,
} from "lucide-react"

const securityFeatures = [
  "Secure authentication",
  "Role-based access control",
  "Protected API routes",
  "Password hashing",
  "Zod request validation",
  "Database-level data validation",
]

export default function SecuritySection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm sm:p-12 lg:p-16">
          {/* Background */}
          <div className="pointer-events-none absolute top-0 right-0 -z-0 size-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Content */}
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-7" />
              </div>

              <p className="mt-6 text-sm font-semibold tracking-wider text-primary uppercase">
                Security & Reliability
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Your healthcare data deserves protection
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                DocZone is designed with security and reliability in mind.
                Authentication, authorization, validation, and protected APIs
                work together to keep the platform safe and dependable.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {securityFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <SecurityCard
                icon={LockKeyhole}
                title="Protected"
                description="Authenticated access to sensitive resources."
              />

              <SecurityCard
                icon={UserCog}
                title="Role Based"
                description="Different permissions for different user roles."
              />

              <SecurityCard
                icon={KeyRound}
                title="Encrypted"
                description="Passwords are securely hashed before storage."
              />

              <SecurityCard
                icon={ShieldCheck}
                title="Validated"
                description="Incoming data is validated before processing."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SecurityCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof LockKeyhole
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
