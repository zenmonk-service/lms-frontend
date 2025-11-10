"use client";

import * as React from "react";
import { CalendarIcon, CircleXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DateRangePickerProps {
  setDateRange?: React.Dispatch<React.SetStateAction<string[]>>;
  setDate?: React.Dispatch<React.SetStateAction<string>>;
  minDate?: Date;
}

export function DateRangePicker({
  setDateRange,
  setDate,
  minDate,
  ...props
}: DateRangePickerProps) {
  const [openStart, setOpenStart] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [startMonth, setStartMonth] = React.useState<Date | undefined>();
  const [startValue, setStartValue] = React.useState(formatDate(startDate));

  const [openEnd, setOpenEnd] = React.useState(false);
  const [endDate, setEndDate] = React.useState<Date | undefined>(startDate);
  const [endMonth, setEndMonth] = React.useState<Date | undefined>(endDate);
  const [endValue, setEndValue] = React.useState(formatDate(endDate));

  React.useEffect(() => {
    if (startValue && endValue) {
      if (setDate) {
        setDate("");
      }
      if (setDateRange) {
        setDateRange([startValue, endValue]);
      }
    } else if (startValue || endValue) {
      const date = startValue || endValue;
      if (setDate) {
        setDate(date || "");
      }
    }
  }, [startValue, endValue]);

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-3">
        <div className="relative flex gap-2">
          <Input
            id="start-date"
            value={startValue}
            placeholder="Start date"
            className="bg-background pr-10"
            readOnly
            onChange={(e) => {
              const parsed = new Date(e.target.value);
              setStartValue(e.target.value);
              if (isValidDate(parsed)) {
                setStartDate(parsed);
                setStartMonth(parsed);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpenStart(true);
              }
            }}
          />
          {startValue ? (
            <button
              type="button"
              aria-label="Clear start date"
              onClick={() => {
                setStartValue("");
                setStartDate(undefined);
                setStartMonth(undefined);
                if (setDateRange) setDateRange([]);
                if (setDate) setDate("");
              }}
              className="absolute top-1/2 right-8 -translate-y-1/2 flex items-center justify-center p-1 text-muted-foreground cursor-pointer"
            >
              <CircleXIcon className="h-[14px] w-[14px]" />
            </button>
          ) : null}
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button
                id="start-date-picker"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select start date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                month={startMonth}
                onMonthChange={setStartMonth}
                disabled={(date: Date) => (minDate ? date < minDate : false)}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartValue(formatDate(date));
                  setOpenStart(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex gap-2">
          <Input
            id="end-date"
            value={endValue}
            placeholder="End date"
            className="bg-background pr-10"
            readOnly
            onChange={(e) => {
              const parsed = new Date(e.target.value);
              setEndValue(e.target.value);
              if (isValidDate(parsed)) {
                setEndDate(parsed);
                setEndMonth(parsed);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpenEnd(true);
              }
            }}
          />
          {endValue ? (
            <button
              type="button"
              aria-label="Clear end date"
              onClick={() => {
                setEndValue("");
                setEndDate(undefined);
                setEndMonth(undefined);
                if (setDateRange) setDateRange([]);
                if (setDate) setDate("");
              }}
              className="absolute top-1/2 right-8 -translate-y-1/2 flex items-center justify-center p-1 text-muted-foreground cursor-pointer"
            >
              <CircleXIcon className="h-[14px] w-[14px]" />
            </button>
          ) : null}
          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button
                id="end-date-picker"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select end date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={endDate}
                captionLayout="dropdown"
                month={endMonth}
                onMonthChange={setEndMonth}
                disabled={(date: Date) =>
                  startDate ? date < startDate : false
                }
                onSelect={(date) => {
                  setEndDate(date);
                  setEndValue(formatDate(date));
                  setOpenEnd(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
