import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-2xl shadow-primary/30">
          {/* Background texture */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              <LayoutDashboard className="size-3" />
              Ready to get started?
            </div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Managing Your Clinic Smarter Today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
              Join healthcare administrators already using DocZone to streamline
              doctor and patient management.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="gap-2 bg-white px-8 text-primary hover:bg-white/90"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
              >
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
