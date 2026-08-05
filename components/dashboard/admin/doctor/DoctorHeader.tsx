"use client"

import { Plus, Stethoscope } from "lucide-react"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import SearchBar from "@/components/dashboard/shared/SearchBar"

interface DoctorHeaderProps {
  onAddDoctor: () => void
}

const DoctorHeader = ({ onAddDoctor }: DoctorHeaderProps) => {
  return (
    <PageHeader
      title="Doctors"
      description="Manage and view all registered doctors"
      icon={<Stethoscope className="size-5" />}
      components={<SearchBar placeholder="Search doctors..." />}
      actions={[
        {
          label: "Add Doctor",
          icon: <Plus className="size-4" />,
          onClick: onAddDoctor,
        },
      ]}
    />
  )
}

export default DoctorHeader
