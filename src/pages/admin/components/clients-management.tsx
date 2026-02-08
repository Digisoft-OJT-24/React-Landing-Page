import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { selectedSecondaryItemAtom } from "@/atom-store";
import { DataTable } from "@/components/custom/data-table/table";
import { clientsColumns } from "./table-columns/clients-columns";
import { ChevronRight } from "lucide-react";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
import SchoolForm from "./forms/school_form";
import { School } from "@/types";

type ClientsManagementProps = {
  setNavItems: (items: { title: string; id: string }[]) => void;
};

type Province = {
  name: string;
  id: string;
  schools: School[];
};

type GetAllClientsData = {
  getProvinces: Province[];
};

export default function ClientsManagement({
  setNavItems,
}: ClientsManagementProps) {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null,
  );
  const selectedSecondaryItem = useAtomValue(selectedSecondaryItemAtom);

  // Fetch provinces
  const getAllClientQueryDocument = gql`
    query {
      getProvinces {
        name
        id
        schools {
          id
          name
        }
      }
    }
  `;

  const { data } = useQuery<GetAllClientsData>({
    queryKey: ["admin-clients"],
    queryFn: async () =>
      request(import.meta.env.VITE_API_URL, getAllClientQueryDocument),
  });

  // Create hashmap for O(1) province lookup by ID
  const provincesMap = useMemo(() => {
    const map = new Map<string, GetAllClientsData["getProvinces"][0]>();
    if (data?.getProvinces) {
      data.getProvinces.forEach((province) => {
        map.set(province.id, province);
      });
    }
    return map;
  }, [data?.getProvinces]);

  // Set nav items
  useEffect(() => {
    if (data?.getProvinces) {
      setNavItems([
        ...data.getProvinces.map((province) => ({
          title: province.name,
          id: province.id,
        })),
      ]);
    }
  }, [data, setNavItems]);

  // Set selected province: use selectedSecondaryItem if available, otherwise default to first province
  useEffect(() => {
    if (!data?.getProvinces || provincesMap.size === 0) {
      setSelectedProvince(null);
      return;
    }

    if (selectedSecondaryItem && provincesMap.has(selectedSecondaryItem)) {
      // Use hashmap for O(1) lookup of selected province
      setSelectedProvince(provincesMap.get(selectedSecondaryItem)!);
    } else if (data.getProvinces.length > 0) {
      // Default to first province if no selection
      setSelectedProvince(data.getProvinces[0]);
    }
  }, [selectedSecondaryItem, provincesMap, data]);

  // Open Alert Dialog
  const { openAlert } = useAlertDialog();

  return (
    <>
      <div className="space-y-3 p-2">
        {selectedProvince && (
          <>
            <span className="text-xl font-bold w-full flex flex-row items-center gap-2">
              Client <ChevronRight className="w-4 h-4" />{" "}
              {selectedProvince.name}
            </span>
            <DataTable
              columns={clientsColumns}
              data={selectedProvince.schools}
              rightActions={
                <Button
                  onClick={() =>
                    openAlert({
                      title: "Add New School",
                      content: <SchoolForm provinceId={selectedProvince.id} />,
                      cancelText: "Cancel",
                    })
                  }
                >
                  Add
                </Button>
              }
            />
          </>
        )}
      </div>
    </>
  );
}
