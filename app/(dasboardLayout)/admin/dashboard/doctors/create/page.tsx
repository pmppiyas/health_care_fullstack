"use client"

import CreateDoctorHeader from "@/components/dashboard/admin/doctor/CreateDoctorHeader"
import DoctorAddEditForm from "@/components/dashboard/admin/doctor/DoctorAddEditForm"

export default function AddDoctorPage() {
  return (
    <div>
      <CreateDoctorHeader mode="add" />
      <DoctorAddEditForm mode="add" />
    </div>
  )
}
