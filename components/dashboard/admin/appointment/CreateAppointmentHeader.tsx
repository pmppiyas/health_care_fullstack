"use client"

import PageHeader from "@/components/dashboard/shared/PageHeader"
import { Calendar, CalendarDays } from "lucide-react"
import { useRouter } from "next/navigation"

const CreateAppointmentHeader = () => {
  const router = useRouter()
  return (
    <PageHeader
      title="Add Appointments"
      description="Manage and view registered appointments"
      icon={<CalendarDays className="size-5" />}

      actions={[
        {
          label: "View All",
          icon: <Calendar className="size-4" />,
          onClick: () => router.push("/admin/dashboard/appointments"),
        },
      ]}
    />
  )
}

export default CreateAppointmentHeader
