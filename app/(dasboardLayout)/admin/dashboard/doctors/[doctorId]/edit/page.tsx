import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DoctorAddEditWrapper from "@/components/dashboard/admin/doctor/DoctorAddEditWrapper"

interface EditDoctorPageProps {
  params: Promise<{
    doctorId: string
  }>
}

function DoctorFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />

        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <Skeleton className="h-175 w-full rounded-2xl" />
    </div>
  )
}

export default async function EditDoctorPage({ params }: EditDoctorPageProps) {
  const { doctorId } = await params

  return (
    <Suspense fallback={<DoctorFormSkeleton />}>
      <DoctorAddEditWrapper doctorId={doctorId} />
    </Suspense>
  )
}
