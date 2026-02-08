import { ProductBrochure } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const faqColumns: ColumnDef<{ faq: string }>[] = [
  {
    accessorKey: "faq",
    header: "FAQ",
  },
];
