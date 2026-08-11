import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import CreateAppointmentWrapper from "@/components/dashboard/admin/appointment/CreateAppointmentWrapper"

function CreateSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>

      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  )
}

export default async function AppointmentCreatePage({
  searchParams,
}: {
  searchParams: Promise<{
    doctorId?: string
    patientId?: string
  }>
}) {
  const params = await searchParams
  return (
    <Suspense fallback={<CreateSkeleton />}>
      <CreateAppointmentWrapper
        doctorId={params?.doctorId}
        patientId={params?.patientId}
      />
    </Suspense>
  )
}
