import { Eye, MoreHorizontal, Pencil, Trash2, CalendarDays, Printer } from "lucide-react"
import { ColumnDef } from "@/components/dashboard/shared/DataTable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface PrescriptionColumnActions {
  onEdit: (p: any) => void
  onDelete: (p: any) => void
}

function formatDate(date: string | Date) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric",
  }).format(new Date(date))
}

export const getPrescriptionColumns = ({
  onEdit,
  onDelete,
}: PrescriptionColumnActions): ColumnDef<any>[] => [
  {
    key: "patient",
    header: "Patient",
    render: (row) => {
      const patient = row.patientId
      return (
        <div className="font-medium text-foreground">
          {patient?.name ?? "—"}
        </div>
      )
    },
  },
  {
    key: "diagnosis",
    header: "Diagnosis",
    render: (row) => (
      <span className="block max-w-40 truncate text-xs font-semibold">
        {row.diagnosis || "—"}
      </span>
    ),
  },
  {
    key: "medicines",
    header: "Medicines",
    render: (row) => (
      <span className="text-xs text-muted-foreground">
        {row.medicines?.length || 0} prescribed
      </span>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5 text-primary" />
        {formatDate(row.createdAt)}
      </div>
    ),
  },
  {
    key: "actions",
    header: "",
    width: "48px",
    align: "center",
    render: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <Link href={`/doctor/dashboard/prescriptions/${row._id}`}>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Eye className="size-3.5" /> View
            </DropdownMenuItem>
          </Link>
          <Link href={`/doctor/dashboard/prescriptions/${row._id}`}>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Printer className="size-3.5" /> Print
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={(e) => { e.stopPropagation(); onEdit(row) }}
          >
            <Pencil className="size-3.5" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(row) }}
          >
            <Trash2 className="size-3.5" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
