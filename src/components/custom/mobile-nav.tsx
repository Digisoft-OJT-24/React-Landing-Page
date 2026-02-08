import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export default function MobileNav() {
  return (
    <>
      <nav className="xs:flex md:hidden lg:hidden xl:hidden 2xl:hidden w-full justify-between items-center bg-[#004580] text-white 2xl:p-4 xs:p-2 z-50">
        <SidebarTrigger />
        <Link
          to="/"
          className="flex items-center gap-1 2xl:text-lg xl:text-lg lg:text-lg md:text-md sm:text-md xs:text-md font-bold text-current uppercase"
        >
          <img src="/images/logo.png" alt="logo" width={32} />
          Digital Software Corp
        </Link>
        <ModeToggle />
      </nav>
    </>
  );
}
