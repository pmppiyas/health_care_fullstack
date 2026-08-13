"use client"

import { useRouter } from "next/navigation"
import PrescriptionForm from "@/components/dashboard/shared/prescription/PrescriptionForm"
import { useCreatePrescriptionMutation } from "@/redux/features/prescription.api"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CreatePrescriptionPage() {
  const router = useRouter()
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation()

  const handleSubmit = async (data: any) => {
    try {
      const res = await createPrescription(data).unwrap()
      if (res.success) {
        toast.success("Prescription created successfully")
        router.push("/doctor/dashboard/prescriptions")
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create prescription")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          Create Prescription
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PrescriptionForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
