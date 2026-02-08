import { selectedMenuItemAtom, selectedSecondaryItemAtom } from "@/atom-store";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSetAtom } from "jotai";
import { Link } from "react-router-dom";

interface AppSidebarProps {
  pageName?: string;
  menuItems?: { title: string; id: string }[];
}
export default function AppSidebar({ pageName, menuItems }: AppSidebarProps) {
  const setSelectedMenuItem = useSetAtom(selectedMenuItemAtom);
  const setSelectedSecondaryItem = useSetAtom(selectedSecondaryItemAtom);

  function scrollIntoElement(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-foreground bg-sidebar pt-5 bg-[url('/images/overlay/top.svg')] bg-cover bg-top bg-no-repeat border-b border-sidebar-border">
        <div className="flex justify-around items-center my-5 text-current">
          <Link to="/" className="text-md uppercase font-bold">
            DIGITAL SOFTWARE
          </Link>
          <p className="m-0 p-0">|</p>
          <h3 className="uppercase text-xs cursor-default">{pageName}</h3>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems?.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedMenuItem(item.id);
                      setSelectedSecondaryItem(null);
                      scrollIntoElement(item.id);
                    }}
                  >
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
