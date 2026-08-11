import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import OverviewWrapper from "@/components/dashboard/admin/overview/OverviewWrapper"

export const metadata = {
  title: "Overview | CareGuide Dashboard",
  description:
    "Admin overview — doctors, patients, appointments and trends at a glance.",
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <Skeleton className="h-10 w-72 rounded-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <OverviewWrapper />
    </Suspense>
  )
}
