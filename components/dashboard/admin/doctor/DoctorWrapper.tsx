"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import DataTable from "@/components/dashboard/shared/DataTable"
import Pagination from "@/components/dashboard/shared/Pagination"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"
import DoctorHeader from "@/components/dashboard/admin/doctor/DoctorHeader"
import {
  useDeleteDOCTORMutation,
  useGetDOCTORsQuery,
} from "@/redux/features/doctor.api"
import { DoctorWithId } from "@/interfaces/doctor.interface"
import { getDoctorColumns } from "@/components/dashboard/admin/doctor/DoctorColumn"
import { P_LIMIT, P_PAGE, P_SEARCH } from "@/constant/meta.constant"

export default function DoctorWrapper() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [, startTransition] = useTransition()

  const search = searchParams.get(P_SEARCH) ?? ""
  const page = Math.max(Number(searchParams.get(P_PAGE) ?? "1"), 1)
  const limit = Number(searchParams.get(P_LIMIT) ?? "10") || 10

  const { data, isFetching } = useGetDOCTORsQuery({
    page,
    limit,
    search: search.trim() || undefined,
  })

  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDOCTORMutation()

  const doctors = (data?.data ?? []) as DoctorWithId[]
  const totalPages = data?.meta?.totalPages ?? 0

  const [deleteTarget, setDeleteTarget] = useState<DoctorWithId | null>(null)

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
    updateParams({
      [P_PAGE]: value === 1 ? null : String(value),
    })
  }

  const handleView = (doctor: DoctorWithId) => {
    router.push(`/admin/dashboard/doctors/${doctor._id}`)
  }

  const handleEdit = (doctor: DoctorWithId) => {
    router.push(`/admin/dashboard/doctors/${doctor._id}/edit`)
  }

  const handleDeleteClick = (doctor: DoctorWithId) => {
    setDeleteTarget(doctor)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteDoctor(deleteTarget._id).unwrap()

      toast.success(`"${deleteTarget.name}" deleted successfully.`)

      setDeleteTarget(null)

      if (doctors.length === 1 && page > 1) {
        handlePageChange(page - 1)
      }
    } catch (error: unknown) {
      const message = (
        error as {
          data?: {
            message?: string
          }
        }
      )?.data?.message

      toast.error(message ?? "Failed to delete doctor.")
    }
  }

  const columns = getDoctorColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
  })

  return (
    <div className="space-y-4">
      <DoctorHeader />

      <DataTable<DoctorWithId>
        columns={columns}
        data={doctors}
        keyField="_id"
        isLoading={isFetching}
        skeletonRows={limit}
        emptyMessage={
          search
            ? `No doctors found matching "${search}".`
            : "No doctors found."
        }
        onRowClick={handleView}
      />

      {!isFetching && <Pagination currentPage={page} totalPages={totalPages} />}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Doctor?"
        description={`"${deleteTarget?.name}" will be permanently deleted.`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  )
}
