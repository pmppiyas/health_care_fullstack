"use client"

import AppointStatus from "@/components/dashboard/shared/AppointStatus"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import SearchBar from "@/components/dashboard/shared/SearchBar"
import { CalendarCheck2 } from "lucide-react"

const DoctorAppointmentHeader = () => {
  return (
    <PageHeader
      title="Appointments"
      description="Manage and view your patient appointments"
      icon={<CalendarCheck2 className="size-5" />}
      components={
        <div className="flex items-center gap-2">
          <SearchBar placeholder="Search patient..." />
          <AppointStatus />
        </div>
      }
    />
  )
}

export default DoctorAppointmentHeader
