import { Role } from "@/app/api/user/user.interface"

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
        title: "Appointments",
        href: "/admin/dashboard/appointments",
        iconName: "CalendarCheck",
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
        title: "Add Appointment",
        href: "/admin/dashboard/appointments/create",
        iconName: "UserRoundPlus",
      },
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
        title: "Profile",
        href: "/admin/dashboard/profile",
        iconName: "ProfileShield",
      },
      {
        title: "Helpline",
        href: "/admin/dashboard/helpline",
        iconName: "PhoneCall",
      },
    ],
  },
]

export const doctorRoutes: RouteSection[] = [
  {
    title: "Main Menu",
    nav: [
      {
        title: "Overview",
        href: "/doctor/dashboard",
        iconName: "LayoutDashboard",
      },
      {
        title: "Appointments",
        href: "/doctor/dashboard/appointments",
        iconName: "CalendarCheck",
      },
      {
        title: "My Patients",
        href: "/doctor/dashboard/patients",
        iconName: "Users",
      },
    ],
  },

  {
    title: "Medical",
    nav: [
      {
        title: "Patient Records",
        href: "/doctor/dashboard/patient-records",
        iconName: "ClipboardList",
      },
      {
        title: "Prescriptions",
        href: "/doctor/dashboard/prescriptions",
        iconName: "FileText",
      },
    ],
  },

  {
    title: "Support & Settings",
    nav: [
      {
        title: "Profile",
        href: "/doctor/dashboard/profile",
        iconName: "ProfileShield",
      },
      {
        title: "Helpline",
        href: "/doctor/dashboard/helpline",
        iconName: "PhoneCall",
      },
    ],
  },
]

export const getRoutesByRole = (role: string): RouteSection[] => {
  switch (role) {
    case Role.ADMIN:
    case "ADMIN":
      return adminRoutes
    case Role.DOCTOR:
    case "DOCTOR":
      return doctorRoutes
    default:
      return []
  }
}

export const getDefaultDashboardRoutes = (
  role?: string | Role | null
): string => {
  switch (role) {
    case Role.ADMIN:
    case "ADMIN":
      return "/admin/dashboard"
    case Role.DOCTOR:
    case "DOCTOR":
      return "/doctor/dashboard"
    case Role.PATIENT:
    case "PATIENT":
      return "/patient/dashboard"
    default:
      return "/"
  }
}
