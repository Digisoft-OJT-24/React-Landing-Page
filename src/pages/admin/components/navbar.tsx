import { ModeToggle } from "@/components/mode-toggle";

type AdminNavbarProps = {
  pageName: string;
};
export default function AdminNavbar({ pageName }: AdminNavbarProps) {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b">
      <div className="text-2xl font-bold">{pageName}</div>
      <ModeToggle />
    </nav>
  );
}
