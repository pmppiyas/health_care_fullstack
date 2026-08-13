import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"

export const POST = withAuth(Role.DOCTOR)(async (req: NextRequest) => {
  const { diagnosis } = await req.json()

  let suggestedMedicines = []
  let notes = ""

  const lowerDiag = diagnosis?.toLowerCase() || ""

  if (lowerDiag.includes("fever")) {
    suggestedMedicines.push({
      medicineName: "Paracetamol",
      dosage: "500mg",
      frequency: "1-1-1",
      duration: "3 days",
      route: "Oral",
      instructions: "Take after meals",
    })
    notes = "Rest and drink plenty of fluids."
  } else if (lowerDiag.includes("diabetes")) {
    suggestedMedicines.push({
      medicineName: "Metformin",
      dosage: "500mg",
      frequency: "1-0-1",
      duration: "30 days",
      route: "Oral",
      instructions: "Take before meals",
    })
    notes = "Monitor blood sugar levels regularly."
  } else if (lowerDiag.includes("infection")) {
    suggestedMedicines.push({
      medicineName: "Amoxicillin",
      dosage: "500mg",
      frequency: "1-1-1",
      duration: "5 days",
      route: "Oral",
      instructions: "Complete the full course",
    })
    notes = "Take with or without food."
  } else {
    notes = "No standard suggestion available for this diagnosis."
  }

  return NextResponse.json({
    success: true,
    data: { suggestedMedicines, notes },
  })
})
