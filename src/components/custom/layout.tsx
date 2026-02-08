import React from "react";
import { cn } from "@/lib/utils";
const NavBar = React.lazy(() => import("./navbar"));
const Footer = React.lazy(() => import("./footer"));
const AppSidebar = React.lazy(() => import("./sidebar"));
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hasNavbar?: boolean;
  hasSidebar?: boolean;
  pageName?: string;
  menuItems?: { title: string; id: string }[];
}
export default function PageLayout({
  children,
  className,
  hasNavbar,
  hasSidebar,
  pageName,
  menuItems,
}: PageLayoutProps) {
  return (
    <>
      {hasSidebar && (
        <SidebarProvider>
          <AppSidebar pageName={pageName} menuItems={menuItems} />
          <main
            className={cn(
              "w-screen mx-auto bg-background text-foreground",
              className,
            )}
          >
            {children}
            <Separator />
            <Footer />
          </main>
        </SidebarProvider>
      )}
      {hasNavbar && (
        <>
          <main
            className={cn(
              "w-screen mx-auto bg-background text-foreground",
              className,
            )}
          >
            <NavBar />
            {children}
          </main>
          <Separator />
          <Footer className="2xl:container" />
        </>
      )}
    </>
  );
}
