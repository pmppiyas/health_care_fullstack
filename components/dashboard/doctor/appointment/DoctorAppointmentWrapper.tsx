"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import DataTable from "@/components/dashboard/shared/DataTable"
import Pagination from "@/components/dashboard/shared/Pagination"
import ConfirmModal from "@/components/dashboard/shared/ConfirmModal"
import DoctorAppointmentHeader from "@/components/dashboard/doctor/appointment/DoctorAppointmentHeader"
import { getDoctorAppointmentColumns } from "@/components/dashboard/doctor/appointment/DoctorAppointmentColumn"

import {
  useGetAppointmentsQuery,
  useDeleteAppointmentMutation,
  useCancelAppointmentMutation,
} from "@/redux/features/appointment.api"

import { Appointment } from "@/interfaces/appointment.interface"
import { P_LIMIT, P_PAGE, P_SEARCH } from "@/constant/meta.constant"
import { useAppSelector } from "@/redux/hooks"

export default function DoctorAppointmentWrapper() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const user = useAppSelector((state) => state.auth.user)

  const search = searchParams.get(P_SEARCH) ?? ""
  const page = Math.max(Number(searchParams.get(P_PAGE) ?? "1"), 1)
  const limit = Number(searchParams.get(P_LIMIT) ?? "10") || 10
  const status = searchParams.get("status") ?? ""

  const { data, isFetching } = useGetAppointmentsQuery({
    page,
    limit,
    search: search.trim() || undefined,
    status: status || undefined,
    ...(user?.id ? { userId: user.id } : {}),
  })

  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation()
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation()

  const appointments = (data?.data ?? []) as Appointment[]
  const totalPages = data?.meta?.totalPages ?? 0

  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)

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

  const handleView = (a: Appointment) =>
    router.push(`/doctor/dashboard/appointments/${a._id}`)

  const handleEdit = (a: Appointment) =>
    router.push(`/doctor/dashboard/appointments/${a._id}/edit`)

  const handleDeleteClick = (a: Appointment) => setDeleteTarget(a)
  const handleCancelClick = (a: Appointment) => setCancelTarget(a)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteAppointment(deleteTarget._id).unwrap()
      toast.success("Appointment deleted successfully.")
      setDeleteTarget(null)
      if (appointments.length === 1 && page > 1) handlePageChange(page - 1)
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message
      toast.error(message ?? "Failed to delete appointment.")
    }
  }

  const handleCancel = async () => {
    if (!cancelTarget) return
    try {
      await cancelAppointment(cancelTarget._id).unwrap()
      toast.success("Appointment cancelled.")
      setCancelTarget(null)
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message
      toast.error(message ?? "Failed to cancel appointment.")
    }
  }

  const columns = getDoctorAppointmentColumns({
    onView: handleView,
    onEdit: handleEdit,
    onCancel: handleCancelClick,
    onDelete: handleDeleteClick,
  })

  return (
    <div className="space-y-4">
      <DoctorAppointmentHeader />

      <DataTable<Appointment>
        columns={columns}
        data={appointments}
        keyField="_id"
        isLoading={isFetching}
        skeletonRows={limit}
        emptyMessage={
          search
            ? `No appointments found matching "${search}".`
            : status
              ? `No ${status.toLowerCase()} appointments found.`
              : "No appointments found."
        }
        onRowClick={handleView}
      />

      {!isFetching && <Pagination currentPage={page} totalPages={totalPages} />}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Appointment?"
        description="This appointment will be permanently deleted and cannot be recovered."
        confirmLabel="Yes, Delete"
        variant="danger"
      />

      <ConfirmModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        isLoading={isCancelling}
        title="Cancel Appointment?"
        description="This appointment will be marked as Cancelled."
        confirmLabel="Yes, Cancel"
        variant="warning"
      />
    </div>
  )
}
