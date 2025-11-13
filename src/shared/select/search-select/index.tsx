"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

interface SearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (search: string) => void;
  data: any[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
}

export function SearchSelect({
  value,
  onValueChange,
  onSearch,
  data = [],
  placeholder = "Select...",
  label = "Items",
  className = "w-[200px]",
  disabled = false,
  emptyMessage = "No items found.",
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const selectedItem = data.find((item) => item.uuid === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          {selectedItem ? selectedItem.name || selectedItem.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}...`}
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((item, index) => {
                const itemValue = item.uuid || item.value || item.id;
                const itemKey = itemValue || `item-${index}`;

                return (
                  <CommandItem
                    key={itemKey}
                    value={itemValue}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.name || item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === itemValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
