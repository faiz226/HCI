"use client";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const QUICK_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours24 = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return {
    value: `${String(hours24).padStart(2, "0")}:${minutes}`,
    label: `${hours12}:${minutes} ${period}`,
  };
});

// Parse free-text like "12:10 AM", "2:05pm", "14:30" → "HH:MM" or null
function parseTimeInput(raw: string): string | null {
  const cleaned = raw.trim().toUpperCase();

  // Try 12-hour with period: "2:05 PM", "12:10AM"
  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const period = match12[3];
    if (h < 1 || h > 12 || m < 0 || m > 59) return null;
    if (period === "AM") h = h === 12 ? 0 : h;
    else h = h === 12 ? 12 : h + 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Try 24-hour: "14:30", "09:05"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  return null;
}

function to12h(value: string): string {
  const [h24, m] = value.split(":").map(Number);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

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
  const [inputVal, setInputVal] = React.useState("");
  const [inputError, setInputError] = React.useState(false);

  const displayLabel = value ? to12h(value) : null;

  // Filter quick slots by what the user is typing
  const filtered = inputVal.trim()
    ? QUICK_SLOTS.filter((s) =>
        s.label.toLowerCase().includes(inputVal.toLowerCase())
      )
    : QUICK_SLOTS;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setInputError(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const parsed = parseTimeInput(inputVal);
    if (parsed) {
      onValueChange(parsed);
      setInputVal("");
      setInputError(false);
      setOpen(false);
    } else {
      setInputError(true);
    }
  };

  const handleSlotClick = (slotValue: string) => {
    onValueChange(slotValue);
    setInputVal("");
    setInputError(false);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setInputVal("");
          setInputError(false);
        }
      }}
    >
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
          {displayLabel ?? <span>{placeholder}</span>}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0 bg-surface-white" align="start">
        <div className="p-2 border-b border-outline-variant">
          <input
            autoFocus
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder='e.g. 12:10 AM or 14:30'
            className={cn(
              "w-full rounded-md border px-3 py-1.5 text-sm bg-surface-white outline-none transition",
              inputError
                ? "border-destructive text-destructive placeholder:text-destructive/50"
                : "border-outline-variant focus:border-primary",
            )}
          />
          {inputError && (
            <p className="text-xs text-destructive mt-1 px-1">
              Try "2:10 PM" or "14:10"
            </p>
          )}
        </div>
        <ul className="max-h-52 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-on-surface-variant">No matches</li>
          ) : (
            filtered.map((slot) => (
              <li key={slot.value}>
                <button
                  type="button"
                  onClick={() => handleSlotClick(slot.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-surface-container transition",
                    value === slot.value && "bg-surface-container font-medium",
                  )}
                >
                  {slot.label}
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}