import { Eye, MoreHorizontal, Pencil, Trash2, UserCircle2 } from "lucide-react"

import { ColumnDef } from "@/components/dashboard/shared/DataTable"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DoctorWithId } from "@/interfaces/doctor.interface"

interface DoctorColumnActions {
  onView: (doctor: DoctorWithId) => void
  onEdit: (doctor: DoctorWithId) => void
  onDelete: (doctor: DoctorWithId) => void
}

export const getDoctorColumns = ({
  onView,
  onEdit,
  onDelete,
}: DoctorColumnActions): ColumnDef<DoctorWithId>[] => [
  {
    key: "photo",
    header: "#",
    width: "56px",
    align: "center",

    render: (row) =>
      row.photoUrl ? (
        <img
          src={row.photoUrl}
          alt={row.name}
          className="mx-auto size-8 rounded-full object-cover ring-2 ring-border"
        />
      ) : (
        <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-primary/10">
          <UserCircle2 className="size-5 text-primary" />
        </div>
      ),
  },

  {
    key: "name",
    header: "Name",

    render: (row) => (
      <div>
        <p className="font-medium text-foreground">{row.name}</p>

        <p className="mt-0.5 text-xs text-muted-foreground">{row.email}</p>
      </div>
    ),
  },

  {
    key: "specialization",
    header: "Specialization",

    render: (row) => (
      <Badge
        variant="outline"
        className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary"
      >
        {row.specialization}
      </Badge>
    ),
  },

  {
    key: "hospital",
    header: "Hospital",

    render: (row) => <span className="text-sm">{row.hospital}</span>,
  },

  {
    key: "phone",
    header: "Phone",
    width: "130px",

    render: (row) => (
      <span className="text-xs text-muted-foreground">{row.phone ?? "—"}</span>
    ),
  },

  {
    key: "yearsOfExperience",
    header: "Exp.",
    width: "70px",
    align: "center",

    render: (row) => (
      <span className="text-xs text-muted-foreground">
        {row.yearsOfExperience} yrs
      </span>
    ),
  },

  {
    key: "isAvailable",
    header: "Status",
    width: "100px",
    align: "center",

    render: (row) => (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
          row.isAvailable
            ? "border-green-500/20 bg-green-500/10 text-green-600"
            : "border-border bg-muted text-muted-foreground"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            row.isAvailable ? "bg-green-500" : "bg-muted-foreground"
          }`}
        />

        {row.isAvailable ? "Available" : "Unavailable"}
      </span>
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
            onClick={(e) => e.stopPropagation()}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          {/* View */}
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onView(row)
            }}
          >
            <Eye className="size-3.5" />
            View
          </DropdownMenuItem>

          {/* Edit */}
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(row)
            }}
          >
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(row)
            }}
          >
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
