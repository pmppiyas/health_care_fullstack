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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "@/components/shared/Logo"
import { getRoutesByRole } from "@/routes/routes"
import NavLinkClient from "@/components/nav-link-client"
import { useAppSelector } from "@/redux/hooks"
import { Role } from "@/app/api/user/user.interface"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user)
  const role = user?.role ?? Role.ADMIN
  const navMenu = getRoutesByRole(role)

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
        {navMenu.map((section, idx) => (
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
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
