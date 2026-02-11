import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AdminNavbarProps = {
  pageName: string;
};
export default function AdminNavbar({ pageName }: AdminNavbarProps) {
  const navigate = useNavigate();
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b">
      <div className="text-2xl font-bold text-[#ffa500] uppercase">
        {pageName}
      </div>
      <div className="flex justify-end items-center gap-2">
        <ModeToggle />
        <Button
          variant="ghost"
          onClick={async () => {
            await Cookies.remove("token");
            navigate("/ds-login");
          }}
        >
          <LogOut />
        </Button>
      </div>
    </nav>
  );
}
