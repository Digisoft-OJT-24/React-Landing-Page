import { useState, useMemo, useEffect } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "../ui/input";
import { EllipsisVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { selectedMenuItemAtom, selectedSecondaryItemAtom } from "@/atom-store";
import { useAtom, useAtomValue } from "jotai";
import { useAlertDialog } from "./alert-dialog-provider";
import ProductForm from "@/pages/admin/components/forms/product_form";
import ProvinceForm from "@/pages/admin/components/forms/province_form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteButton from "@/pages/admin/components/forms/delete_button";

interface SecondarySidebarProps {
  secondarySidebarItems?: { title: string; id: string }[];
}
export default function SecondarySidebar({
  secondarySidebarItems,
}: SecondarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSecondaryItem, setSelectedSecondaryItem] = useAtom(
    selectedSecondaryItemAtom,
  );

  // Create hashmap for O(1) item lookup by ID
  const itemsMap = useMemo(() => {
    const map = new Map<string, { title: string; id: string }>();
    if (secondarySidebarItems) {
      secondarySidebarItems.forEach((item) => {
        map.set(item.id, item);
      });
    }
    return map;
  }, [secondarySidebarItems]);

  const filteredItems = useMemo(() => {
    if (!secondarySidebarItems) return [];

    if (!searchQuery.trim()) {
      return secondarySidebarItems;
    }

    const query = searchQuery.toLowerCase().trim();
    return secondarySidebarItems.filter((item) =>
      item.title.toLowerCase().includes(query),
    );
  }, [secondarySidebarItems, searchQuery]);

  useEffect(() => {
    if (secondarySidebarItems && !selectedSecondaryItem) {
      setSelectedSecondaryItem(secondarySidebarItems[0]?.id as string | null);
    }
  }, [secondarySidebarItems, selectedSecondaryItem, setSelectedSecondaryItem]);

  const handleSelectProduct = (productId: string) => {
    if (itemsMap.has(productId)) {
      setSelectedSecondaryItem(productId as string | null);
    }
  };

  // Add new item handler (placeholder)
  const selectedMenuItem = useAtomValue(selectedMenuItemAtom);
  const { openAlert } = useAlertDialog();

  const handleAddNew = () => {
    const alertContent = () => {
      switch (selectedMenuItem) {
        case "products-management":
          return {
            name: "Product",
            form: <ProductForm />,
          };
        case "clients-management":
          return {
            name: "Item",
            form: <ProvinceForm />,
          };
        default:
          return { name: "", form: <></>, formName: "" };
      }
    };
    openAlert({
      title: `Add New ${alertContent().name}`,
      content: alertContent().form,
      cancelText: "Cancel",
    });
  };

  const deleteQueryDocument = () => {
    switch (selectedMenuItem) {
      case "products-management":
        return {
          key: "admin-products",
          query: `mutation { deleteProduct(id: ${selectedSecondaryItem}) }`,
        };
      case "clients-management":
        return {
          key: "admin-provinces",
          query: `mutation { deleteProvince(id: ${selectedSecondaryItem}) }`,
        };
      default:
        return { key: "", query: "" };
    }
  };

  return (
    <div className="h-full flex flex-col">
      <SidebarHeader className="flex flex-row gap-2 justify-between items-center border-b border-sidebar-border p-2">
        <Input
          placeholder="Search"
          className="h-8 flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleAddNew}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar text-sidebar-foreground flex-1 overflow-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            {filteredItems.length > 0 ? (
              <SidebarMenu>
                {filteredItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.id === selectedSecondaryItem}
                      className="uppercase"
                      onClick={() => handleSelectProduct(item.id)}
                    >
                      {item.title}
                    </SidebarMenuButton>
                    <SidebarMenuAction>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <DeleteButton
                              btnText="Delete"
                              queryKey={deleteQueryDocument().key}
                              queryDocument={deleteQueryDocument().query}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {searchQuery.trim() ? "No results found" : "No items"}
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
    </div>
  );
}
