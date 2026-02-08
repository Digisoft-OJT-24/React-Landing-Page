import { cn } from "@/lib/utils";

interface TextAreaProps {
  className?: string;
  value?: string;
}
export default function TextArea({ className, value }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        className,
        "w-full h-[500px] text-xs text-start px-4 py-2 bg-slate-700 text-yellow-300 cursor-default rounded-md shadow-md whitespace-pre-wrap"
      )}
      value={value}
      readOnly
    />
  );
}
