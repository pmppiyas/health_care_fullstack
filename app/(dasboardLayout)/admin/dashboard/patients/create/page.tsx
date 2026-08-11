"use client"

import CreatePatientHeader from "@/components/dashboard/admin/patient/CreatePatientHeader"
import PatientAddEditForm from "@/components/dashboard/admin/patient/PatientAddEditForm"

export default function AddPatientPage() {
  return (
    <div>
      <CreatePatientHeader mode="add" />
      <PatientAddEditForm mode="add" />
    </div>
  )
}
