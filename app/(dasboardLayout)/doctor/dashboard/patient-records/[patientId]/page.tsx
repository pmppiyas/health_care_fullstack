import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DoctorPatientDetailWrapper from "@/components/dashboard/doctor/patient/DoctorPatientDetailWrapper"

interface Props {
  params: Promise<{ patientId: string }>
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default async function DoctorPatientRecordDetailPage({ params }: Props) {
  const { patientId } = await params
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DoctorPatientDetailWrapper patientId={patientId} />
    </Suspense>
  )
}
