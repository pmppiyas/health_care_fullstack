"use client"

import {
  Phone,
  Mail,
  Clock,
  Globe,
  Terminal,
  HeartHandshake,
  ShieldCheck,
  Headphones,
} from "lucide-react"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import { useGetMeQuery } from "@/redux/features/auth.api"
import { Role } from "@/app/api/user/user.interface"

export default function HelplineWrapper() {
  const { data: user } = useGetMeQuery()
  const isAdmin = user?.role === Role.ADMIN

  return (
    <div className="space-y-6">
      <PageHeader
        title="Helpline & Support"
        description="Get in touch with support teams and system administrators"
        icon={<Headphones className="size-5" />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Developer Contact Section - ALWAYS SHOWN */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          {/* Top-left soft glow */}
          <div className="absolute -top-6 -left-6 size-24 rounded-full bg-violet-500/10 opacity-25 blur-2xl transition-opacity group-hover:opacity-40" />

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Terminal className="size-6" />
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                Developer Support
              </span>
              <h3 className="text-lg font-bold">Healthcare Technical Team</h3>
              <p className="text-sm text-muted-foreground">
                For software bugs, system performance issues, feature requests, or website crashes.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-border/60 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Mail className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                <a href="mailto:support@healthcare.dev" className="font-medium text-primary hover:underline">
                  support@healthcare.dev
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Phone className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Helpline Number</p>
                <a href="tel:+18005550199" className="font-medium text-foreground hover:text-primary transition-colors">
                  +1 (800) 555-0199
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Availability</p>
                <p className="font-medium text-foreground">24/7 Critical System Monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Globe className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Developer Portal</p>
                <a
                  href="https://www.healthcare.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  www.healthcare.dev
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Admin/Clinic Contact Section - HIDDEN FOR ADMINS */}
        {!isAdmin && (
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            {/* Top-left soft glow */}
            <div className="absolute -top-6 -left-6 size-24 rounded-full bg-emerald-500/10 opacity-25 blur-2xl transition-opacity group-hover:opacity-40" />

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Clinic Administration
                </span>
                <h3 className="text-lg font-bold">Central Support Desk</h3>
                <p className="text-sm text-muted-foreground">
                  For patient registrations, scheduling issues, billing questions, and clinic policy details.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-border/60 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                  <a href="mailto:admin@healthcare.com" className="font-medium text-primary hover:underline">
                    admin@healthcare.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Direct Office Line</p>
                  <a href="tel:+15550123456" className="font-medium text-foreground hover:text-primary transition-colors">
                    +1 (555) 012-3456
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Clock className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Office Hours</p>
                  <p className="font-medium text-foreground">Mon - Fri, 9:00 AM - 5:00 PM (EST)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <HeartHandshake className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Role Scope</p>
                  <p className="font-medium text-foreground">Immediate Clinic Administration Desk</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
