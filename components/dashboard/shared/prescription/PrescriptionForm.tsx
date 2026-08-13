"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Wand2, User, Calendar } from "lucide-react"
import { useSuggestPrescriptionMutation } from "@/redux/features/prescription.api"
import { useGetDoctorMyPatientsQuery } from "@/redux/features/doctor.api"
import { useGetAppointmentsByPatientQuery } from "@/redux/features/appointment.api"
import { toast } from "sonner"
import { createPrescriptionValidationSchema } from "@/app/api/prescription/prescription.validation"

type FormValues = z.infer<typeof createPrescriptionValidationSchema>

interface PrescriptionFormProps {
  initialData?: Partial<FormValues>
  onSubmit: (data: FormValues) => void
  isLoading?: boolean
}

export default function PrescriptionForm({
  initialData,
  onSubmit,
  isLoading,
}: PrescriptionFormProps) {
  const [suggestMutation, { isLoading: isSuggesting }] =
    useSuggestPrescriptionMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(createPrescriptionValidationSchema),
    defaultValues: {
      patientId: initialData?.patientId || "",
      appointmentId: initialData?.appointmentId || "",
      diagnosis: initialData?.diagnosis || "",
      notes: initialData?.notes || "",
      medicines: initialData?.medicines || [
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
          route: "",
          instructions: "",
        },
      ],
      followUpDate: initialData?.followUpDate,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicines",
  })

  const selectedPatientId = form.watch("patientId")
  const selectedAppointmentId = form.watch("appointmentId")

  const hasPrefilledPatient = !!initialData?.patientId
  const { data: patientsData, isLoading: isLoadingPatients } =
    useGetDoctorMyPatientsQuery({ limit: 100 }, { skip: hasPrefilledPatient })

  const hasPrefilledAppointment = !!initialData?.appointmentId
  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useGetAppointmentsByPatientQuery(
      { patientId: selectedPatientId || "" },
      { skip: !selectedPatientId || hasPrefilledAppointment }
    )

  useEffect(() => {
    if (initialData?.patientId) {
      form.setValue("patientId", initialData.patientId)
    }
    if (initialData?.appointmentId) {
      form.setValue("appointmentId", initialData.appointmentId)
    }
  }, [initialData, form])

  const handleSuggest = async () => {
    const diagnosis = form.watch("diagnosis")
    if (!diagnosis) {
      toast.error("Please enter a diagnosis first")
      return
    }

    try {
      const res = await suggestMutation({ diagnosis }).unwrap()
      if (res.success && res.data?.suggestedMedicines?.length) {
        form.setValue("medicines", res.data.suggestedMedicines)
        if (res.data.notes) {
          form.setValue("notes", res.data.notes)
        }
        toast.success("AI Suggestions applied! Please review.")
      } else {
        toast.info("No standard suggestions found for this diagnosis.")
      }
    } catch (error) {
      toast.error("Failed to fetch suggestions")
    }
  }

  const formatDateForInput = (dateVal?: any) => {
    if (!dateVal) return ""
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return ""
    return d.toISOString().split("T")[0]
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...form.register("patientId")} />
      <input type="hidden" {...form.register("appointmentId")} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Patient Selection / Info */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Patient</Label>
          {hasPrefilledPatient ? (
            <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 text-primary" />
              <span>Assigned Patient ID: {initialData?.patientId}</span>
            </div>
          ) : (
            <Select
              onValueChange={(val) => {
                form.setValue("patientId", val)
                form.setValue("appointmentId", "")
              }}
              value={selectedPatientId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingPatients
                      ? "Loading patients..."
                      : "Select a patient"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {patientsData?.data?.map((patient: any) => (
                  <SelectItem key={patient._id} value={patient._id}>
                    {patient.name} ({patient.condition})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {form.formState.errors.patientId && (
            <p className="text-xs text-destructive">
              {form.formState.errors.patientId.message}
            </p>
          )}
        </div>

        {/* Appointment Selection / Info */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Appointment</Label>
          {hasPrefilledAppointment ? (
            <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Assigned Appointment ID: {initialData?.appointmentId}</span>
            </div>
          ) : (
            <Select
              onValueChange={(val) => form.setValue("appointmentId", val)}
              value={selectedAppointmentId}
              disabled={!selectedPatientId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedPatientId
                      ? "Select patient first"
                      : isLoadingAppointments
                        ? "Loading appointments..."
                        : "Select an appointment"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {appointmentsData?.map((app: any) => (
                  <SelectItem key={app._id} value={app._id}>
                    {new Date(app.appointmentDate).toLocaleDateString()} at{" "}
                    {app.appointmentTime} - {app.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {form.formState.errors.appointmentId && (
            <p className="text-xs text-destructive">
              {form.formState.errors.appointmentId.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Diagnosis Field */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Diagnosis</Label>
          <div className="flex gap-2">
            <Input
              {...form.register("diagnosis")}
              placeholder="e.g. Viral Fever, Type 2 Diabetes"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSuggest}
              disabled={isSuggesting}
              className="shrink-0 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              AI Suggest
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            AI Generated Suggestion — Doctor Review Required. Always verify
            fields.
          </p>
          {form.formState.errors.diagnosis && (
            <p className="text-xs text-destructive">
              {form.formState.errors.diagnosis.message}
            </p>
          )}
        </div>

        {/* Medicines Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Medicines</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  medicineName: "",
                  dosage: "",
                  frequency: "",
                  duration: "",
                  route: "",
                  instructions: "",
                })
              }
              className="border-dashed"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Medicine
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Medicine #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Medicine Name</Label>
                    <Input
                      {...form.register(
                        `medicines.${index}.medicineName` as const
                      )}
                      placeholder="e.g. Paracetamol"
                    />
                    {form.formState.errors.medicines?.[index]?.medicineName && (
                      <p className="text-[11px] text-destructive">
                        {
                          form.formState.errors.medicines[index]?.medicineName
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dosage</Label>
                    <Input
                      {...form.register(`medicines.${index}.dosage` as const)}
                      placeholder="e.g. 500mg"
                    />
                    {form.formState.errors.medicines?.[index]?.dosage && (
                      <p className="text-[11px] text-destructive">
                        {
                          form.formState.errors.medicines[index]?.dosage
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Frequency</Label>
                    <Input
                      {...form.register(
                        `medicines.${index}.frequency` as const
                      )}
                      placeholder="e.g. 1-0-1"
                    />
                    {form.formState.errors.medicines?.[index]?.frequency && (
                      <p className="text-[11px] text-destructive">
                        {
                          form.formState.errors.medicines[index]?.frequency
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Duration</Label>
                    <Input
                      {...form.register(`medicines.${index}.duration` as const)}
                      placeholder="e.g. 5 days"
                    />
                    {form.formState.errors.medicines?.[index]?.duration && (
                      <p className="text-[11px] text-destructive">
                        {
                          form.formState.errors.medicines[index]?.duration
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Route</Label>
                    <Input
                      {...form.register(`medicines.${index}.route` as const)}
                      placeholder="e.g. Oral"
                    />
                    {form.formState.errors.medicines?.[index]?.route && (
                      <p className="text-[11px] text-destructive">
                        {form.formState.errors.medicines[index]?.route?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Instructions</Label>
                    <Input
                      {...form.register(
                        `medicines.${index}.instructions` as const
                      )}
                      placeholder="e.g. After meals"
                    />
                    {form.formState.errors.medicines?.[index]?.instructions && (
                      <p className="text-[11px] text-destructive">
                        {
                          form.formState.errors.medicines[index]?.instructions
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {form.formState.errors.medicines && (
              <p className="text-sm text-destructive">
                {form.formState.errors.medicines.message}
              </p>
            )}
          </div>
        </div>

        {/* Notes and Follow-Up Date */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Follow-Up Date</Label>
            <Input
              type="date"
              value={formatDateForInput(form.watch("followUpDate"))}
              onChange={(e) => {
                const dateVal = e.target.value
                  ? new Date(e.target.value)
                  : undefined
                form.setValue("followUpDate", dateVal)
              }}
            />
            {form.formState.errors.followUpDate && (
              <p className="text-xs text-destructive">
                {form.formState.errors.followUpDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Notes (Optional)</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Special instructions or precautions..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="submit" disabled={isLoading} className="px-6">
          {isLoading ? "Saving..." : "Save Prescription"}
        </Button>
      </div>
    </form>
  )
}
