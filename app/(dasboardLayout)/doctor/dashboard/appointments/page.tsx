import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DoctorAppointmentWrapper from "@/components/dashboard/doctor/appointment/DoctorAppointmentWrapper"

export const metadata = {
  title: "Appointments | Doctor Dashboard",
  description: "Manage your appointments — view, search, filter, and update.",
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
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<AppointmentPageSkeleton />}>
      <DoctorAppointmentWrapper />
    </Suspense>
  )
}
