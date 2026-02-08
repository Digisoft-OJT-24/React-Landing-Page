import { cn } from "@/lib/utils";

interface ContentCardProps {
  title?: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ContentCard({
  title,
  id,
  children,
  className,
}: ContentCardProps) {
  return (
    <div id={id} className={cn(className, "w-full")}>
      {title && (
        <h2 className="2xl:text-lg xs:text-md font-bold text-[#ffa500] mb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
