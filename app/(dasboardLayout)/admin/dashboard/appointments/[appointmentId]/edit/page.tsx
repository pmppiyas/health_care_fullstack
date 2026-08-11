"use client"

import { Suspense, use } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import AppointmentAddEditForm from "@/components/dashboard/admin/appointment/AppointmentAddEditForm"
import CreateAppointmentHeader from "@/components/dashboard/admin/appointment/CreateAppointmentHeader"
import { useGetAppointmentByIdQuery } from "@/redux/features/appointment.api"
import { useGetDOCTORsQuery } from "@/redux/features/doctor.api"
import { useGetPATIENTsQuery } from "@/redux/features/patient.api"

function EditSkeleton() {
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

function EditContent({ appointmentId }: { appointmentId: string }) {
  const { data: appointment, isLoading: aLoading } =
    useGetAppointmentByIdQuery(appointmentId)
  const { data: doctorsRes, isLoading: dLoading } = useGetDOCTORsQuery({})
  const { data: patientsRes, isLoading: pLoading } = useGetPATIENTsQuery({})

  if (aLoading || dLoading || pLoading) return <EditSkeleton />

  if (!appointment) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Appointment not found.
      </p>
    )
  }

  const doctors = doctorsRes?.data ?? []
  const patients = patientsRes?.data ?? []

  return (
    <div className="space-y-0">
      <CreateAppointmentHeader />
      <AppointmentAddEditForm
        mode="edit"
        appointment={appointment}
        doctors={doctors}
        patients={patients}
      />
    </div>
  )
}

export default function AppointmentEditPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>
}) {
  const { appointmentId } = use(params)
  return (
    <Suspense fallback={<EditSkeleton />}>
      <EditContent appointmentId={appointmentId} />
    </Suspense>
  )
}
