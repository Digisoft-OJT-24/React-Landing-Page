import { ProductBrochure } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

export const brochureColumns: ColumnDef<ProductBrochure>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "link",
    header: () => <div className="text-end">Link</div>,
    cell: ({ row }) => <div className="text-end"><Link to={row.original.link} target="_blank">Download</Link></div>,
  },
]