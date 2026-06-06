"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours24 = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return {
    value: `${String(hours24).padStart(2, "0")}:${minutes}`,
    label: `${hours12}:${minutes} ${period}`,
  };
});

type TimePickerProps = {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function TimePicker({
  value,
  onValueChange,
  placeholder = "Pick a time",
  className,
  disabled,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const label = TIME_SLOTS.find((slot) => slot.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!value}
          className={cn(
            "w-full justify-between text-left font-normal bg-surface-white data-[empty=true]:text-muted-foreground",
            className,
          )}
        >
          {label ?? <span>{placeholder}</span>}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-surface-white" align="start">
        <ul className="max-h-56 w-44 overflow-y-auto py-1">
          {TIME_SLOTS.map((slot) => (
            <li key={slot.value}>
              <button
                type="button"
                onClick={() => {
                  onValueChange(slot.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-surface-container transition",
                  value === slot.value && "bg-surface-container font-medium",
                )}
              >
                {slot.label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
