import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { GetAllProductsQuery } from "@/hooks/use-queries";
const HamburgerMenu = React.lazy(() => import("./hamburger-menu"));

export default function NavBar() {
  const { data, isLoading, error } = GetAllProductsQuery();
  return (
    <nav className="w-full text-white bg-[#004580] 2xl:p-4 xs:p-2 z-50">
      <div className="2xl:container xs:w-full sm:w-full mx-auto flex justify-between items-center">
        {/* HEADER */}
        <span className="flex items-center justify-between xs:justify-between xs:w-screen sm:w-screen md:w-auto lg:w-auto xl:w-auto 2xl:w-auto">
          <HamburgerMenu />
          <Link
            to="/"
            className="flex items-center gap-1 2xl:text-lg xl:text-lg lg:text-lg md:text-md sm:text-md xs:text-md font-bold text-current hover:text-[#ffa500] uppercase"
          >
            <img src="/images/logo.png" alt="logo" width={32} />
            Digital Software Corp
          </Link>
          <span className="items-center hidden xs:flex sm:flex md:hidden 2xl:hidden lx:hidden lg:hidden">
            <ModeToggle />
          </span>
        </span>

        {/* MENU ITEMS */}
        <NavigationMenu className="hidden md:block lg:block xl:block 2xl:block z-30">
          <NavigationMenuList className="w-full flex justify-between space-x-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent hover:text-[#ffa500] focus:text-[#ffa500]">
                Browser Products
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white dark:bg-[#004580]">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {data && (
                      <ul className="grid grid-cols-2 gap-3 p-4 w-[500px] z-50">
                        {data.getProducts.map((product, index: number) => (
                          <ListItem
                            className="text-primary col-span-full"
                            key={index}
                            title={product.title}
                            to={`/products/${product.code}`}
                          >
                            {product.short as React.ReactNode}
                          </ListItem>
                        ))}
                      </ul>
                    )}
                    {error && <div>Error loading products.</div>}
                  </>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/release-notes"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent hover:text-[#ffa500]",
                )}
              >
                Release Notes
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/list-of-clients"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent hover:text-[#ffa500]",
                )}
              >
                List of Clients
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* DARK MODE */}
        <NavigationMenu className="hidden md:block lg:block xl:block 2xl:block">
          <NavigationMenuList className="w-full flex justify-between">
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="col-span-1">
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-[#ffa500]">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-[#16294a] dark:text-white">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
