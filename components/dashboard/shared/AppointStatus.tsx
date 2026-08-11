"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { AppointmentStatus } from "@/app/api/appointment/appointment.interface"

const AppointStatus = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get("status") ?? ""

  const onStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "ALL") {
      params.delete("status")
    } else {
      params.set("status", value)
    }

    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={status || "ALL"} onValueChange={onStatusChange}>
      <SelectTrigger className="h-9 w-38 text-sm">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Status</SelectItem>

        {Object.values(AppointmentStatus).map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default AppointStatus
