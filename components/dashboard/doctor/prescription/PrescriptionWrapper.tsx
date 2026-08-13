"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useGetPrescriptionsQuery, useDeletePrescriptionMutation } from "@/redux/features/prescription.api"
import { getPrescriptionColumns } from "./PrescriptionColumn"
import DataTable from "@/components/dashboard/shared/DataTable"
import Pagination from "@/components/dashboard/shared/Pagination"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"
import { toast } from "sonner"
import PrescriptionModal from "../../shared/prescription/PrescriptionModal"
import { P_LIMIT, P_PAGE, P_SEARCH } from "@/constant/meta.constant"

export default function PrescriptionWrapper() {
  const searchParams = useSearchParams()

  const search = searchParams.get(P_SEARCH) ?? ""
  const page = Math.max(Number(searchParams.get(P_PAGE) ?? "1"), 1)
  const limit = Number(searchParams.get(P_LIMIT) ?? "10") || 10

  const { data: prescriptionsData, isFetching } = useGetPrescriptionsQuery({
    page,
    limit,
    search: search.trim() || undefined,
  })
  
  const [deletePrescription, { isLoading: isDeleting }] = useDeletePrescriptionMutation()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)

  const handleDeleteClick = (row: any) => {
    setSelectedPrescription(row)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPrescription?._id) return
    try {
      await deletePrescription(selectedPrescription._id).unwrap()
      toast.success("Prescription deleted successfully.")
      setDeleteModalOpen(false)
    } catch (error) {
      toast.error("Failed to delete prescription.")
    }
  }

  const handleEditClick = (row: any) => {
    setSelectedPrescription(row)
    setEditModalOpen(true)
  }

  const columns = getPrescriptionColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  })

  const prescriptions = prescriptionsData?.data || []
  const totalPages = prescriptionsData?.meta?.totalPages || 0

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={prescriptions}
        keyField="_id"
        isLoading={isFetching}
        skeletonRows={limit}
        emptyMessage={
          search
            ? `No prescriptions found matching "${search}".`
            : "No prescriptions created yet."
        }
      />
      
      {!isFetching && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}

      {/* Reusable Edit Modal */}
      {editModalOpen && (
        <PrescriptionModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setSelectedPrescription(null)
          }}
          prescription={selectedPrescription}
        />
      )}

      {/* Reusable Delete Confirmation */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedPrescription(null)
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Prescription?"
        description="This prescription will be permanently deleted and cannot be recovered."
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  )
}
