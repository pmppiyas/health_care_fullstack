"use client"

import PageHeader from "@/components/dashboard/shared/PageHeader"
import { Calendar, CalendarDays, MoveLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateAppointmentHeaderProps {
  basePath?: string
}

const CreateAppointmentHeader = ({
  basePath = "/admin/dashboard/appointments",
}: CreateAppointmentHeaderProps) => {
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
          onClick: () => router.push(basePath),
          variant: "outline",
        },
        {
          label: "Back",
          icon: <MoveLeftIcon className="size-4" />,
          onClick: () => router.back(),
          variant: "ghost",
        },
      ]}
    />
  )
}

export default CreateAppointmentHeader
