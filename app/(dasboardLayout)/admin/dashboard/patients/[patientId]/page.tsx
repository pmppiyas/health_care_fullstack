import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import PatientDetailWrapper from "@/components/dashboard/admin/patient/PatientDetailWrapper"

interface PatientDetailPageProps {
  params: Promise<{ patientId: string }>
}

function PatientDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
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

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { patientId } = await params

  return (
    <Suspense fallback={<PatientDetailSkeleton />}>
      <PatientDetailWrapper patientId={patientId} />
    </Suspense>
  )
}
