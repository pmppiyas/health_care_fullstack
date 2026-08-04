export type NavItem = {
  title: string
  href: string
  iconName?: string
}

export type RouteSection = {
  title: string
  nav: NavItem[]
}

export const adminRoutes: RouteSection[] = [
  {
    title: "Main Menu",
    nav: [
      {
        title: "Overview",
        href: "/admin/dashboard",
        iconName: "LayoutDashboard",
      },
      {
        title: "Doctors",
        href: "/admin/dashboard/doctors",
        iconName: "Stethoscope",
      },
      {
        title: "Patients",
        href: "/admin/dashboard/patients",
        iconName: "Users",
      },
    ],
  },
  {
    title: "Management",
    nav: [
      {
        title: "Add Doctor",
        href: "/admin/dashboard/doctors/create",
        iconName: "UserPlus",
      },
      {
        title: "Add Patient",
        href: "/admin/dashboard/patients/create",
        iconName: "UserRoundPlus",
      },
    ],
  },
  {
    title: "Analytics",
    nav: [
      {
        title: "Doctor Analytics",
        href: "/admin/dashboard/analytics/doctors",
        iconName: "ChartNoAxesColumn",
      },
      {
        title: "Patient Analytics",
        href: "/admin/dashboard/analytics/patients",
        iconName: "ChartPie",
      },
    ],
  },
  {
    title: "Support & Settings",
    nav: [
      {
        title: "Settings",
        href: "/admin/dashboard/settings",
        iconName: "Settings",
      },
      {
        title: "Helpline",
        href: "/admin/dashboard/helpline",
        iconName: "PhoneCall",
      },
    ],
  },
]

export const getRoutesByRole = (role: string): RouteSection[] => {
  switch (role) {
    case "ADMIN":
      return adminRoutes

    default:
      return []
  }
}
