"use client"

import { Users } from "lucide-react"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import SearchBar from "@/components/dashboard/shared/SearchBar"

const DoctorPatientHeader = () => {
  return (
    <PageHeader
      title="My Patients"
      description="View your assigned patients"
      icon={<Users className="size-5" />}
      components={<SearchBar placeholder="Search patients..." />}
    />
  )
}

export default DoctorPatientHeader
