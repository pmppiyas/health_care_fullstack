import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DoctorAnalyticsWrapper from "@/components/dashboard/admin/analytics/DoctorAnalyticsWrapper"

function DoctorAnalyticsSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-md rounded-md" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Skeleton className="h-80 w-full rounded-2xl xl:col-span-2" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>

      {/* Table */}
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  )
}

export default function DoctorAnalyticsPage() {
  return (
    <Suspense fallback={<DoctorAnalyticsSkeleton />}>
      <DoctorAnalyticsWrapper />
    </Suspense>
  )
}
