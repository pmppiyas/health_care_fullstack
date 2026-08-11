"use client"

import AppointStatus from "@/components/dashboard/shared/AppointStatus"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import SearchBar from "@/components/dashboard/shared/SearchBar"
import { Plus, CalendarCheck2 } from "lucide-react"
import { useRouter } from "next/navigation"

const AppointmentHeader = () => {
  const router = useRouter()

  return (
    <PageHeader
      title="Appointments"
      description="Manage and view registered appointments"
      icon={<CalendarCheck2 className="size-5" />}
      components={
        <div className="flex items-center gap-2">
          <SearchBar placeholder="Search appointment..." />
          <AppointStatus />
        </div>
      }
      actions={[
        {
          label: "Add Appointment",
          icon: <Plus className="size-4" />,
          onClick: () => router.push("/admin/dashboard/appointments/create"),
        },
      ]}
    />
  )
}

export default AppointmentHeader
