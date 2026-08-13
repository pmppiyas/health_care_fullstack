"use client"

import * as React from "react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import Logo from "@/components/shared/Logo"
import { getRoutesByRole } from "@/routes/routes"
import NavLinkClient from "@/components/nav-link-client"
import { useAppSelector } from "@/redux/hooks"
import { useGetMeQuery } from "@/redux/features/auth.api"

function SidebarSkeleton() {
  return (
    <div className="space-y-6 px-4 py-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-lg" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isLoading: isMeLoading } = useGetMeQuery()
  const user = useAppSelector((state) => state.auth.user)

  const role = user?.role
  const navMenu = role ? getRoutesByRole(role) : []

  const allHrefs = React.useMemo(
    () => navMenu.flatMap((section) => section.nav.map((item) => item.href)),
    [navMenu]
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="ml-3 flex items-center">
              <Logo />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isMeLoading ? (
          <SidebarSkeleton />
        ) : (
          navMenu.map((section, idx) => (
            <SidebarGroup key={idx} className="mb-4 last:mb-0">
              {section.title && (
                <SidebarGroupLabel className="mb-2 px-4 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                  {section.title}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-2">
                  {section.nav.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <NavLinkClient
                        href={item.href}
                        title={item.title}
                        iconName={item.iconName || ""}
                        allHrefs={allHrefs}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
