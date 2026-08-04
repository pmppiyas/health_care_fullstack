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

const NavLink = ({ title, href, iconName, exact = false }: NavLinkProps) => {
  const pathname = usePathname()

  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)

  const Icon = iconName ? icons[iconName] : null

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "transition-colors duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
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
