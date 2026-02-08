import { ChangeLog } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const changelogsColumns: ColumnDef<ChangeLog>[] = [
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "revision",
    header: "Revision",
  },
  {
    accessorKey: "description",
    header: () => <div className="text-start">Description</div>,
    cell: ({ row }) => <div className="text-start">{row.original.description ?? "No description"}</div>,
  },
]