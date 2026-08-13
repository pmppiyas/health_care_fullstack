import PrescriptionHeader from "@/components/dashboard/doctor/prescription/PrescriptionHeader"
import PrescriptionWrapper from "@/components/dashboard/doctor/prescription/PrescriptionWrapper"
import TableSkeleton from "@/components/dashboard/shared/skeleton/TableSkeleton"
import { Suspense } from "react"

export default function PrescriptionsPage() {
  return (
    <div>
      <PrescriptionHeader />
      <Suspense fallback={<TableSkeleton />}>
        <PrescriptionWrapper />
      </Suspense>
    </div>
  )
}
