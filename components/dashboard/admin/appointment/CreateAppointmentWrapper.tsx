"use client"

import AppointmentAddEditForm from "@/components/dashboard/admin/appointment/AppointmentAddEditForm"
import CreateAppointmentHeader from "@/components/dashboard/admin/appointment/CreateAppointmentHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetDOCTORsQuery } from "@/redux/features/doctor.api"
import { useGetPATIENTsQuery } from "@/redux/features/patient.api"

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

const CreateAppointmentWrapper = ({
  doctorId,
  patientId,
}: {
  doctorId?: string
  patientId?: string
}) => {
  const { data: doctorsResponse, isLoading: doctorsLoading } =
    useGetDOCTORsQuery({})

  const { data: patientsResponse, isLoading: patientsLoading } =
    useGetPATIENTsQuery({})

  if (doctorsLoading || patientsLoading) {
    return <CreateSkeleton />
  }

  const doctors = doctorsResponse?.data ?? []
  const patients = patientsResponse?.data ?? []

  return (
    <div>
      <CreateAppointmentHeader />
      <AppointmentAddEditForm
        mode="add"
        defaultDoctorId={doctorId}
        defaultPatientId={patientId}
        doctors={doctors}
        patients={patients}
      />
    </div>
  )
}

export default CreateAppointmentWrapper
