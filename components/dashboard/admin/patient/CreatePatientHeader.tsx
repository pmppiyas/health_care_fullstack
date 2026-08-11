"use client"

import PageHeader from "@/components/dashboard/shared/PageHeader"
import { MoveLeft, MoveLeftIcon, UserRound, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreatePatientHeaderProps {
  mode?: "add" | "edit"
}

const CreatePatientHeader = ({ mode = "add" }: CreatePatientHeaderProps) => {
  const router = useRouter()

  return (
    <PageHeader
      title={mode === "add" ? "Add Patient" : "Edit Patient"}
      description={
        mode === "add"
          ? "Register a new patient to the system"
          : "Update patient information"
      }
      icon={<UserRound className="size-5" />}
      actions={[
        {
          label: "View All",
          icon: <Users className="size-4" />,
          onClick: () => router.push("/admin/dashboard/patients"),
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

export default CreatePatientHeader
