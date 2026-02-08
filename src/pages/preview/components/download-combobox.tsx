import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DownloadVersionProps {
  options?: { value: string; label: string }[];
  className?: string;
  onChange?: (value: string) => void;
}

export function DownloadVersion({
  options,
  className,
  onChange,
}: DownloadVersionProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const mediaQuery =
    "xs:min-w-full sm:min-w-full md:min-w-[200px] 2xl:min-w-[500px] xl:min-w-[400px] lg:min-w-[300px]";

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(className, "justify-between text-wrap", mediaQuery)}
          >
            {value
              ? options?.find((item) => item.value === value)?.label
              : "Select version..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(className, "p-0 ", mediaQuery)}>
          <Command>
            <CommandInput placeholder="Search versions..." className="h-9" />
            <CommandList>
              <CommandEmpty>No versions found.</CommandEmpty>
              <CommandGroup>
                {options?.map((item, index: number) => (
                  <CommandItem
                    key={index}
                    value={item.value}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue);
                      if (onChange) {
                        onChange(currentValue === value ? "" : currentValue);
                      }
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <Link
          to={`${value}`}
          target="_blank"
          className="xs:w-full sm:w-full md:w-[200px] lg:w-[200px] xl:w-[200px] 2xl:w-[200px]"
        >
          <Button className="w-full text-white bg-[#16294a] hover:bg-[#034383] focus:bg-[#16294a]">
            Download
          </Button>
        </Link>
      )}
    </>
  );
}
