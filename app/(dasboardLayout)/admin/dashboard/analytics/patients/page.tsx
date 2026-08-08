import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import PatientAnalyticsWrapper from "@/components/dashboard/admin/analytics/PatientAnalyticsWrapper"

function PatientAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      {/* Patient Growth + Conditions */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>

      {/* Patients per Doctor + Patient Status */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <Skeleton className="h-80 w-full rounded-2xl xl:col-span-2" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>

      {/* Doctor Workload Table */}
      <Skeleton className="h-80 w-full rounded-2xl" />

      {/* Recent Patients Table */}
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  )
}

export default function PatientAnalyticsPage() {
  return (
    <Suspense fallback={<PatientAnalyticsSkeleton />}>
      <PatientAnalyticsWrapper />
    </Suspense>
  )
}
