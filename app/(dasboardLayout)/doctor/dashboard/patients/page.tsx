import { Suspense } from "react"
import DoctorPatientWrapper from "@/components/dashboard/doctor/patient/DoctorPatientWrapper"
import DoctorPatientHeader from "@/components/dashboard/doctor/patient/DoctorPatientHeader"
import TableSkeleton from "@/components/dashboard/shared/skeleton/TableSkeleton"

export const metadata = {
  title: "My Patients | Doctor Dashboard",
  description: "View your assigned patients.",
}

export default function DoctorPatientsPage() {
  return (
    <div>
      <DoctorPatientHeader />
      <Suspense fallback={<TableSkeleton />}>
        <DoctorPatientWrapper />
      </Suspense>
    </div>
  )
}
