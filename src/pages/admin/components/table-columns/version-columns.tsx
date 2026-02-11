import { ProductVersion } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const versionColumns: ColumnDef<ProductVersion>[] = [
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "note",
    header: "Notes",
    cell: (row) => <div>{(row.getValue() as string) ?? "No Notes"}</div>,
  },
  {
    accessorKey: "link",
    header: () => <div className="text-end">Link</div>,
    cell: (row) => (
      <a
        className="text-end flex justify-end"
        href={row.getValue() as string}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download
      </a>
    ),
  },
];
