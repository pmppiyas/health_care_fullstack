"use client"

import PageHeader from "@/components/dashboard/shared/PageHeader"
import { MoveLeftIcon, Stethoscope, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateDoctorHeaderProps {
  mode?: "add" | "edit"
}

const CreateDoctorHeader = ({ mode = "add" }: CreateDoctorHeaderProps) => {
  const router = useRouter()

  return (
    <PageHeader
      title={mode === "add" ? "Add Doctor" : "Edit Doctor"}
      description={
        mode === "add"
          ? "Register a new doctor to the system"
          : "Update doctor information"
      }
      icon={<Stethoscope className="size-5" />}
      actions={[
        {
          label: "View All",
          icon: <Users className="size-4" />,
          onClick: () => router.push("/admin/dashboard/doctors"),
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

export default CreateDoctorHeader
