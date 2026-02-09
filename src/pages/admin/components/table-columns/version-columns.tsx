import { ProductVersion } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const versionColumns: ColumnDef<ProductVersion>[] = [
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "note",
    header: () => <div className="text-end">Notes</div>,
    cell: ({ row }) => <div className="text-end">{row.original.note ?? "No notes"}</div>,
  },
]