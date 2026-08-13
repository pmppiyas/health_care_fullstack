"use client"

import {  useRouter, useSearchParams } from "next/navigation"
import DataTable from "@/components/dashboard/shared/DataTable"
import Pagination from "@/components/dashboard/shared/Pagination"
import DoctorPatientHeader from "@/components/dashboard/doctor/patient/DoctorPatientHeader"
import { getDoctorPatientColumns } from "@/components/dashboard/doctor/patient/DoctorPatientColumn"
import { useGetDoctorMyPatientsQuery } from "@/redux/features/doctor.api"
import { PatientWithId } from "@/interfaces/patient.interface"
import { P_LIMIT, P_PAGE, P_SEARCH } from "@/constant/meta.constant"

export default function DoctorPatientWrapper() {
  const router = useRouter()
  const searchParams = useSearchParams()


  const search = searchParams.get(P_SEARCH) ?? ""
  const page = Math.max(Number(searchParams.get(P_PAGE) ?? "1"), 1)
  const limit = Number(searchParams.get(P_LIMIT) ?? "10") || 10

  const { data, isFetching } = useGetDoctorMyPatientsQuery({
    page,
    limit,
    search: search.trim() || undefined,
  })

  const patients = (data?.data ?? []) as PatientWithId[]
  const totalPages = data?.meta?.totalPages ?? 0

  const handleView = (patient: PatientWithId) => {
    router.push(`/doctor/dashboard/patients/${patient._id}`)
  }

  const columns = getDoctorPatientColumns({ onView: handleView })

  return (
    <div className="space-y-4">
      <DoctorPatientHeader />
      <DataTable<PatientWithId>
        columns={columns}
        data={patients}
        keyField="_id"
        isLoading={isFetching}
        skeletonRows={limit}
        emptyMessage={
          search
            ? `No patients found matching "${search}".`
            : "No patients assigned to you yet."
        }
        onRowClick={handleView}
      />
      {!isFetching && <Pagination currentPage={page} totalPages={totalPages} />}
    </div>
  )
}
