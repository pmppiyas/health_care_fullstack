"use client"

import { useGetPATIENTByIdQuery } from "@/redux/features/patient.api"
import PatientAddEditForm from "./PatientAddEditForm"
import CreatePatientHeader from "./CreatePatientHeader"

interface PatientAddEditWrapperProps {
  patientId: string
}

export default function PatientAddEditWrapper({
  patientId,
}: PatientAddEditWrapperProps) {
  const { data, isLoading, isError } = useGetPATIENTByIdQuery(patientId)

  if (isLoading) {
    return null
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load patient information.
      </div>
    )
  }

  return (
    <div>
      <CreatePatientHeader mode="edit" />
      <PatientAddEditForm mode="edit" patient={data.data} />
    </div>
  )
}

