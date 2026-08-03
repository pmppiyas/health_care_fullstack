import Link from "next/link"
import { ArrowRight, HeartPulse, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-75 w-75 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <HeartPulse className="size-4" />
              About DocZone
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Smarter Healthcare
              <span className="block text-primary">
                Starts With Better Management
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              DocZone is a modern healthcare management platform designed to
              simplify doctor and patient management, improve administrative
              workflows, and provide meaningful healthcare insights.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="gap-2">
                <Link href="/login">
                  Explore Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative mx-auto max-w-md rounded-3xl border bg-card p-6 shadow-2xl">
              <div className="rounded-2xl bg-muted/50 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Healthcare Overview
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">DocZone</h3>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HeartPulse className="size-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Doctors</p>
                    <p className="mt-2 text-2xl font-bold">500+</p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Patients</p>
                    <p className="mt-2 text-2xl font-bold">2K+</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                      <ShieldCheck className="size-5" />
                    </div>

                    <div>
                      <p className="font-semibold">Secure & Reliable</p>
                      <p className="text-sm text-muted-foreground">
                        Protected healthcare management
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 -z-10 size-24 rounded-2xl border border-primary/20 bg-primary/5" />
            <div className="absolute -bottom-6 -left-6 -z-10 size-28 rounded-full bg-primary/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
