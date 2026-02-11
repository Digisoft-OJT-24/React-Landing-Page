import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
const AppSidebar = React.lazy(() => import("./sidebar"));
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SecondarySidebar from "./secondary-sidebar";
import AdminNavbar from "@/pages/admin/components/navbar";
import { AlertDialogProvider } from "./alert-dialog-provider";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { selectedMenuItemAtom } from "@/atom-store";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  pageName?: string;
  secondarySidebarItems?: { title: string; id: string }[];
}
export default function AdminPageLayout({
  children,
  className,
  pageName,
  secondarySidebarItems,
}: AdminPageLayoutProps) {
  const navigate = useNavigate();
  const menuItems = useMemo(() => {
    return [
      { title: "Products Management", id: "products-management" },
      { title: "Clients Management", id: "clients-management" },
    ];
  }, []);
  const selectedMenuItem = useAtomValue(selectedMenuItemAtom);
  const activeMenuItem = useMemo(() => {
    return menuItems.find((item) => item.id === selectedMenuItem)?.title;
  }, [selectedMenuItem]);

  const token = Cookies.get("token");
  useEffect(() => {
    if (!token) {
      navigate("/ds-login");
    }
  }, [token]);

  return (
    <AlertDialogProvider>
      <SidebarProvider>
        {/* Primary Sidebar */}
        <AppSidebar pageName={pageName} menuItems={menuItems} />

        {/* Secondary Sidebar + Content Area */}
        <SidebarInset className="flex flex-col w-full h-screen overflow-hidden">
          <AdminNavbar pageName={activeMenuItem as string} />
          <main className="flex flex-row w-full h-screen">
            {/* Secondary Sidebar - Custom implementation without Sidebar component spacer */}
            <aside
              className="w-48 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
              style={{ width: "13rem" }}
            >
              <SecondarySidebar secondarySidebarItems={secondarySidebarItems} />
            </aside>

            {/* Main Content Area */}
            <section
              className={cn(
                className,
                "flex-1 pb-4 overflow-auto bg-background text-foreground",
              )}
            >
              {children}
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AlertDialogProvider>
  );
}
