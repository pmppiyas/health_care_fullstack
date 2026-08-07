"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import DataTable from "@/components/dashboard/shared/DataTable"
import Pagination from "@/components/dashboard/shared/Pagination"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"
import PatientHeader from "@/components/dashboard/admin/patient/PatientHeader"
import {
  useDeletePATIENTMutation,
  useGetPATIENTsQuery,
} from "@/redux/features/patient.api"
import { PatientWithId } from "@/interfaces/patient.interface"
import { getPatientColumns } from "@/components/dashboard/admin/patient/PatientColumn"
import { P_LIMIT, P_PAGE, P_SEARCH } from "@/constant/meta.constant"

export default function PatientWrapper() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [, startTransition] = useTransition()

  const search = searchParams.get(P_SEARCH) ?? ""
  const page = Math.max(Number(searchParams.get(P_PAGE) ?? "1"), 1)
  const limit = Number(searchParams.get(P_LIMIT) ?? "10") || 10

  const { data, isFetching } = useGetPATIENTsQuery({
    page,
    limit,
    search: search.trim() || undefined,
  })

  const [deletePatient, { isLoading: isDeleting }] = useDeletePATIENTMutation()

  const patients = (data?.data ?? []) as PatientWithId[]
  const totalPages = data?.meta?.totalPages ?? 0

  const [deleteTarget, setDeleteTarget] = useState<PatientWithId | null>(null)

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    const queryString = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      })
    })
  }

  const handlePageChange = (value: number) => {
    updateParams({ [P_PAGE]: value === 1 ? null : String(value) })
  }

  const handleView = (patient: PatientWithId) => {
    router.push(`/admin/dashboard/patients/${patient._id}`)
  }

  const handleEdit = (patient: PatientWithId) => {
    router.push(`/admin/dashboard/patients/${patient._id}/edit`)
  }

  const handleDeleteClick = (patient: PatientWithId) => {
    setDeleteTarget(patient)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePatient(deleteTarget._id).unwrap()
      toast.success(`${deleteTarget.name} deleted successfully.`)
      setDeleteTarget(null)
      if (patients.length === 1 && page > 1) {
        handlePageChange(page - 1)
      }
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message
      toast.error(message ?? "Failed to delete patient.")
    }
  }

  const columns = getPatientColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
  })

  return (
    <div className="space-y-4">
      <PatientHeader />

      <DataTable<PatientWithId>
        columns={columns}
        data={patients}
        keyField="_id"
        isLoading={isFetching}
        skeletonRows={limit}
        emptyMessage={
          search
            ? `No patients found matching "${search}".`
            : "No patients found."
        }
        onRowClick={handleView}
      />

      {!isFetching && <Pagination currentPage={page} totalPages={totalPages} />}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Patient?"
        description={`"${deleteTarget?.name}" will be permanently deleted.`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  )
}
