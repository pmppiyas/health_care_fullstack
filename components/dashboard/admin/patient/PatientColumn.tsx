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

import { PatientWithId } from "@/interfaces/patient.interface"
import { PatientStatus, Gender } from "@/app/api/patient/patient.interface"

interface PatientColumnActions {
  onView: (patient: PatientWithId) => void
  onEdit: (patient: PatientWithId) => void
  onDelete: (patient: PatientWithId) => void
}

const statusConfig: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  [PatientStatus.ACTIVE]: {
    label: "Active",
    className: "border-green-500/20 bg-green-500/10 text-green-600",
    dot: "bg-green-500",
  },
  [PatientStatus.INACTIVE]: {
    label: "Inactive",
    className: "border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  [PatientStatus.DISCHARGED]: {
    label: "Discharged",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    dot: "bg-blue-500",
  },
}

const genderLabel: Record<string, string> = {
  [Gender.MALE]: "Male",
  [Gender.FEMALE]: "Female",
  [Gender.OTHER]: "Other",
}

export const getPatientColumns = ({
  onView,
  onEdit,
  onDelete,
}: PatientColumnActions): ColumnDef<PatientWithId>[] => [
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
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.email ?? row.phone ?? "—"}
        </p>
      </div>
    ),
  },

  {
    key: "age",
    header: "Age / Gender",
    width: "110px",
    render: (row) => (
      <div>
        <p className="text-sm font-medium">{row.age} yrs</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {genderLabel[row.gender] ?? row.gender}
        </p>
      </div>
    ),
  },

  {
    key: "condition",
    header: "Condition",
    render: (row) => (
      <Badge
        variant="outline"
        className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary"
      >
        {row.condition}
      </Badge>
    ),
  },

  {
    key: "bloodGroup",
    header: "Blood",
    width: "70px",
    align: "center",
    render: (row) => (
      <span className="text-xs font-semibold text-foreground">
        {row.bloodGroup ?? "—"}
      </span>
    ),
  },

  {
    key: "status",
    header: "Status",
    width: "110px",
    align: "center",
    render: (row) => {
      const cfg = statusConfig[row.status] ?? statusConfig[PatientStatus.INACTIVE]
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.className}`}
        >
          <span className={`size-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      )
    },
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
