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

interface EnumData {
  [key: string]: string;
}

interface ArrayDataItem {
  uuid: string;
  name: string;
}

type DataType = EnumData | Array<ArrayDataItem>;

interface TableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  data: DataType;
  isEnum?: boolean;
  label: string;
  placeholder?: string;
}

const TableSelect: React.FC<TableSelectProps> = ({
  value,
  onValueChange,
  data,
  isEnum = false,
  label,
  placeholder,
}) => {
  return (
    <div>
      <Select value={value} onValueChange={(v) => onValueChange(v)}>
        <SelectTrigger
          value={value}
          onReset={() => onValueChange("")}
          className="w-[180px]"
        >
          <SelectValue placeholder={placeholder || "Select a value"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs">{label}</SelectLabel>
            {isEnum
              ? Object.entries(data as EnumData).map(([key, val]) => (
                  <SelectItem key={key} value={val}>
                    {val}
                  </SelectItem>
                ))
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

export default TableSelect;
