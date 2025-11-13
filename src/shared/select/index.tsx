import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EnumData {
  [key: string]: string;
}

interface CustomSelectProps {
  ref?: React.Ref<any>;
  value: string;
  onValueChange: (value: string) => void;
  data: any;
  isEnum?: boolean;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;

  // NEW optional props for search
  search?: boolean; // default false
  onSearch?: (search: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  ref,
  value,
  onValueChange,
  data,
  isEnum = false,
  label,
  placeholder,
  className,
  disabled = false,
  search = false,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (typeof onSearch === "function") {
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (isEnum) {
      const entries = Object.entries(data as EnumData);
      if (!term) return entries;
      return entries.filter(([key, val]) => {
        return (
          String(val).toLowerCase().includes(term) ||
          String(key).toLowerCase().includes(term)
        );
      });
    } else {
      const arr = (data as any[]) ?? [];
      if (!term) return arr;
      return arr.filter((item) => {
        const labelText =
          (item && (item.name || item.label)) ?? String(item ?? "");
        return String(labelText).toLowerCase().includes(term);
      });
    }
  }, [data, isEnum, searchTerm]);

  return (
    <div>
      <Select value={value} onValueChange={(v) => onValueChange(v)}>
        <SelectTrigger
          ref={ref}
          value={value}
          onReset={() => onValueChange("")}
          className={cn(className)}
          disabled={disabled}
        >
          <SelectValue placeholder={placeholder || "Select a value"} />
        </SelectTrigger>

        <SelectContent>
          {/* optional search input */}
          {search && (
            <div className="px-3 py-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${label}`}
                className="w-full rounded border px-2 py-1 text-sm outline-none"
              />
            </div>
          )}

          <SelectGroup>
            <SelectLabel className="text-xs">{label}</SelectLabel>

            {isEnum
              ? (filtered as Array<[string, string]>).map(([key, val]) => (
                  <SelectItem key={key} value={val}>
                    {String(val)
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </SelectItem>
                ))
              : (filtered as any[]).map((type: any, index: number) => (
                  <SelectItem
                    key={type?.uuid || index}
                    value={type?.uuid ?? type}
                  >
                    {type?.name ||
                      String(type)
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </SelectItem>
                ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
