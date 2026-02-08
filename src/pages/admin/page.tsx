import AdminPageLayout from "@/components/custom/admin-layout";
import ProductsManagement from "./components/products-management";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { selectedMenuItemAtom } from "@/atom-store";
import ClientsManagement from "./components/clients-management";

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState<{ title: string; id: string }[]>();

  const selectedMenuItem = useAtomValue(selectedMenuItemAtom)

  return (
    <AdminPageLayout pageName="Admin" secondarySidebarItems={menuItems}>
      {selectedMenuItem === "products-management" && (
        <ProductsManagement setNavItems={setMenuItems} />
      )}
      {selectedMenuItem === "clients-management" && (
        <ClientsManagement setNavItems={setMenuItems} />
      )}
    </AdminPageLayout>
  );
}
