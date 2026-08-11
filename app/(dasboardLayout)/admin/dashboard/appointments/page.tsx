import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import AppointmentWrapper from "@/components/dashboard/admin/appointment/AppointmentWrapper"

export const metadata = {
  title: "Appointments | CareGuide Dashboard",
  description: "Manage all appointments — view, search, filter, and update.",
}

function AppointmentPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<AppointmentPageSkeleton />}>
      <AppointmentWrapper />
    </Suspense>
  )
}
