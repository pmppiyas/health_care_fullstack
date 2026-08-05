import { Suspense } from "react"
import DoctorWrapper from "@/components/dashboard/admin/doctor/DoctorWrapper"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Doctors | CareGuide Dashboard",
  description:
    "Manage all registered doctors — add, edit, and delete doctor records.",
}

function DoctorPageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-44" />
          </div>
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      {/* Search skeleton */}
      <Skeleton className="h-9 w-72 rounded-lg" />
      {/* Table skeleton */}
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<DoctorPageSkeleton />}>
      <DoctorWrapper />
    </Suspense>
  )
}
