"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetPrescriptionByIdQuery } from "@/redux/features/prescription.api"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft } from "lucide-react"

export default function PrescriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoading } = useGetPrescriptionByIdQuery(
    params.prescriptionId as string
  )

  if (isLoading)
    return <div className="p-8 text-center">Loading prescription...</div>

  const prescription = data?.data
  if (!prescription)
    return <div className="p-8 text-center">Prescription not found</div>

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-50 p-4 lg:p-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print Prescription
        </Button>
      </div>

      {/* A4 Paper container */}
      <div className="print-card mx-auto min-h-225 w-full max-w-200 bg-white p-12 shadow-lg md:min-h-262.5">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b-2 border-primary pb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {prescription.doctorId?.name}
            </h1>
            <p className="text-sm font-medium text-gray-600">
              {prescription.doctorId?.specialization}
            </p>
            <p className="text-sm text-gray-600">
              {prescription.doctorId?.qualifications?.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              {prescription.doctorId?.hospital}
            </p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>
              <strong>Phone:</strong> {prescription.doctorId?.phone}
            </p>
            <p>
              <strong>Email:</strong> {prescription.doctorId?.email}
            </p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-8 grid grid-cols-2 gap-4 rounded-md bg-gray-50 p-4">
          <div>
            <p className="text-sm text-gray-500">Patient Name</p>
            <p className="font-semibold">{prescription.patientId?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">
              {new Date(prescription.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender / Age</p>
            <p className="font-semibold">
              {prescription.patientId?.gender} /{" "}
              {prescription.patientId?.age || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Diagnosis</p>
            <p className="font-semibold">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="mb-6">
          <span className="font-serif text-4xl font-bold text-primary">Rx</span>
        </div>

        {/* Medicines */}
        <div className="mb-12 space-y-6">
          {prescription.medicines?.map((med: any, idx: number) => (
            <div key={idx} className="border-b border-gray-100 pb-4">
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  {idx + 1}. {med.medicineName}
                </h3>
                <span className="text-sm font-medium text-gray-600">
                  {med.dosage}
                </span>
              </div>
              <div className="ml-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                  <strong>Frequency:</strong> {med.frequency}
                </p>
                <p>
                  <strong>Duration:</strong> {med.duration}
                </p>
                <p>
                  <strong>Route:</strong> {med.route}
                </p>
                <p>
                  <strong>Instructions:</strong> {med.instructions}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Notes & Footer */}
        {prescription.notes && (
          <div className="mb-12">
            <h4 className="mb-2 font-bold text-gray-800">Notes/Advice:</h4>
            <p className="text-sm text-gray-600">{prescription.notes}</p>
          </div>
        )}

        <div className="mt-20 flex items-end justify-between border-t border-gray-200 pt-8">
          <div className="text-sm text-gray-500">
            {prescription.followUpDate && (
              <p>
                <strong>Next Follow-up:</strong>{" "}
                {new Date(prescription.followUpDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-center">
            <div className="mb-2 w-40 border-b border-gray-400"></div>
            <p className="text-sm text-gray-500">Doctor's Signature</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          /* Hide sidebar, header, top-level layout components, buttons, and navigation */
          aside, nav, header, button, .print\\:hidden, [data-sidebar="sidebar"], [data-sidebar="header"], .sidebar-wrapper {
            display: none !important;
          }
          /* Reset outer layout spacing for print preview */
          body, html, main, .flex-1, .flex, #root {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
          }
          /* Reset nested layout spacing */
          div {
            box-shadow: none !important;
          }
          /* Target our specific container */
          .print-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: none !important;
            min-height: 0 !important;
            height: auto !important;
            background: white !important;
          }
        }
      `,
        }}
      />
    </div>
  )
}
