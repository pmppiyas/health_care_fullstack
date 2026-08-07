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
}

/**
 * Step 1: A route "matches" the current pathname if it's an exact match
 * or the pathname is nested under it (e.g. href=/doctors matches
 * /doctors/123, /doctors/create, etc).
 */
function routeMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Step 2: Among ALL sibling hrefs that match the current pathname,
 * find the most specific one (longest string = most nested/specific route).
 * Only that href should be considered "active" — this is what stops
 * "/doctors" from lighting up while we're actually on "/doctors/create".
 */
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

  // Step 3: exact-match links behave as before; prefix-match links now
  // resolve against siblings instead of blindly using startsWith.
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
