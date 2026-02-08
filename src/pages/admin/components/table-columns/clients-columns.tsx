import { School } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import DeleteButton from "../forms/delete_button";

export const clientsColumns: ColumnDef<School>[] = [
  {
    accessorKey: "name",
    header: "Clients",
  },
  {
    accessorKey: "id",
    header: "",
    cell: (row) => (
      <div className="text-end">
        <DeleteButton
          queryKey="admin-clients"
          queryDocument={`
            mutation {
            deleteSchool(id: ${row.getValue() as string})
          }`}
        />
      </div>
    ),
  },
];
