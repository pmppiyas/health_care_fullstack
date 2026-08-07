"use client"

import { useGetDOCTORByIdQuery } from "@/redux/features/doctor.api"
import DoctorAddEditForm from "./DoctorAddEditForm"

interface DoctorAddEditWrapperProps {
  doctorId: string
}

export default function DoctorAddEditWrapper({
  doctorId,
}: DoctorAddEditWrapperProps) {
  const { data, isLoading, isError } = useGetDOCTORByIdQuery(doctorId)

  if (isLoading) {
    return null
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load doctor information.
      </div>
    )
  }

  return <DoctorAddEditForm mode="edit" doctor={data.data} />
}
