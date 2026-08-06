"use client"

import { Plus, Users } from "lucide-react"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import SearchBar from "@/components/dashboard/shared/SearchBar"

interface PatientHeaderProps {
  onAddPatient: () => void
}

const PatientHeader = ({ onAddPatient }: PatientHeaderProps) => {
  return (
    <PageHeader
      title="Patients"
      description="Manage and view all registered patients"
      icon={<Users className="size-5" />}
      components={<SearchBar placeholder="Search patients..." />}
      actions={[
        {
          label: "Add Patient",
          icon: <Plus className="size-4" />,
          onClick: onAddPatient,
        },
      ]}
    />
  )
}

export default PatientHeader
