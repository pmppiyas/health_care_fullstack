"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  UserPlus,
  UserRoundPlus,
  Settings,
  PhoneCall,
  CalendarCheck,
  ChartNoAxesColumn,
  ChartPie,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type NavLinkProps = {
  title: string
  href: string
  iconName?: string
  exact?: boolean
  allHrefs?: string[]
}

const icons: Record<string, LucideIcon> = {
  LayoutDashboard,
  Stethoscope,
  Users,
  UserPlus,
  UserRoundPlus,
  Settings,
  PhoneCall,
  CalendarCheck,
  ChartNoAxesColumn,
  ChartPie,
}

function routeMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function isBestMatch(pathname: string, href: string, allHrefs: string[]) {
  if (!routeMatches(pathname, href)) return false

  const candidates = allHrefs.filter((h) => routeMatches(pathname, h))

  if (candidates.length === 0) return true

  const best = candidates.reduce((a, b) => (b.length > a.length ? b : a))

  return best === href
}

const NavLink = ({
  title,
  href,
  iconName,
  exact = false,
  allHrefs = [],
}: NavLinkProps) => {
  const pathname = usePathname()

  const isExact = exact || href === "/admin/dashboard"

  const active = isExact
    ? pathname === href
    : isBestMatch(pathname, href, allHrefs)

  const Icon = iconName ? icons[iconName] : null

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "transition-colors duration-200",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            active
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-primary"
          )}
        />
      )}

      <span className="truncate">{title}</span>
    </Link>
  )
}

export default NavLink
