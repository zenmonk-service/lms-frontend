import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { cn } from "@/lib/utils";

interface EnumData {
  [key: string]: string;
}

interface ArrayDataItem {
  uuid: string;
  name: string;
}

type DataType = EnumData | Array<ArrayDataItem>;

interface CustomSelectProps {
  ref?: React.Ref<any>;
  value: string;
  onValueChange: (value: string) => void;
  data: DataType;
  isEnum?: boolean;
  label: string;
  placeholder?: string;
  className?: string;
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
}) => {
  return (
    <div>
      <Select value={value} onValueChange={(v) => onValueChange(v)}>
        <SelectTrigger
          ref={ref}
          value={value}
          onReset={() => onValueChange("")}
          className={cn(className)}
        >
          <SelectValue placeholder={placeholder || "Select a value"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs">{label}</SelectLabel>
            {isEnum
              ? Object.entries(data as EnumData).map(([key, val]) => {
                  return (
                    <SelectItem key={key} value={val}>
                      {val
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  );
                })
              : (data as Array<ArrayDataItem>).map((type) => (
                  <SelectItem key={type.uuid} value={type.uuid}>
                    {type.name}
                  </SelectItem>
                ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
