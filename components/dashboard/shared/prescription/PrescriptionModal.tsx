"use client"

import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import PrescriptionForm from "./PrescriptionForm"
import {
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
} from "@/redux/features/prescription.api"
import { toast } from "sonner"

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  patientId?: string
  appointmentId?: string
  prescription?: any
  onSuccess?: () => void
}

export default function PrescriptionModal({
  isOpen,
  onClose,
  patientId,
  appointmentId,
  prescription,
  onSuccess,
}: PrescriptionModalProps) {
  const [createPrescription, { isLoading: isCreating }] =
    useCreatePrescriptionMutation()
  const [updatePrescription, { isLoading: isUpdating }] =
    useUpdatePrescriptionMutation()

  const isEditMode = !!prescription

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        const res = await updatePrescription({
          id: prescription._id,
          data,
        }).unwrap()
        if (res.success) {
          toast.success("Prescription updated successfully")
          onSuccess?.()
          onClose()
        }
      } else {
        const res = await createPrescription(data).unwrap()
        if (res.success) {
          toast.success("Prescription created successfully")
          onSuccess?.()
          onClose()
        }
      }
    } catch (error: any) {
      toast.error(
        error.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} prescription`
      )
    }
  }

  const initialFormValues = isEditMode
    ? {
        patientId: prescription.patientId?._id || prescription.patientId,
        appointmentId:
          prescription.appointmentId?._id || prescription.appointmentId,
        diagnosis: prescription.diagnosis,
        medicines: prescription.medicines,
        notes: prescription.notes,
        followUpDate: prescription.followUpDate,
      }
    : { patientId, appointmentId }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200 fade-in-0"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl animate-in overflow-y-auto rounded-xl shadow-xl duration-200 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0">
          <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-background py-4">
            <CardTitle className="text-lg font-bold">
              {isEditMode ? "Edit Prescription" : "Create Prescription"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <PrescriptionForm
              initialData={initialFormValues}
              onSubmit={handleSubmit}
              isLoading={isCreating || isUpdating}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
