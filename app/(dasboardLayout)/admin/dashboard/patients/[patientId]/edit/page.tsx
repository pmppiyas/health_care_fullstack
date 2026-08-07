import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import PatientAddEditWrapper from "@/components/dashboard/admin/patient/PatientAddEditWrapper"

interface EditPatientPageProps {
  params: Promise<{
    patientId: string
  }>
}

function PatientFormSkeleton() {
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

export default async function EditPatientPage({
  params,
}: EditPatientPageProps) {
  const { patientId } = await params

  return (
    <Suspense fallback={<PatientFormSkeleton />}>
      <PatientAddEditWrapper patientId={patientId} />
    </Suspense>
  )
}
