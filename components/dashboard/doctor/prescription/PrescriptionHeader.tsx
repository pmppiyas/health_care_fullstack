"use client"

import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import SearchBar from "@/components/dashboard/shared/SearchBar"
import Link from "next/link"

const PrescriptionHeader = () => {
  return (
    <PageHeader
      title="Prescriptions"
      description="Manage your patient prescriptions and treatment records"
      icon={<FileText className="size-5" />}
      components={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <SearchBar placeholder="Search prescriptions..." />
          <Link href="/doctor/dashboard/prescriptions/create" className="shrink-0">
            <Button className="w-full">
              <Plus className="mr-2 size-4" /> Create Prescription
            </Button>
          </Link>
        </div>
      }
    />
  )
}

export default PrescriptionHeader
