import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DoctorDetailWrapper from "@/components/dashboard/admin/doctor/DoctorDetailWrapper"

interface DoctorDetailPageProps {
  params: Promise<{ doctorId: string }>
}

function DoctorDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
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

export default async function DoctorDetailPage({
  params,
}: DoctorDetailPageProps) {
  const { doctorId } = await params

  return (
    <Suspense fallback={<DoctorDetailSkeleton />}>
      <DoctorDetailWrapper doctorId={doctorId} />
    </Suspense>
  )
}
