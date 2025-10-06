"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  maxSelected?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  maxSelected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    onChange(newSelected);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const selectedOptions = options.filter((option) => selected.includes(option.value));
  const canAddMore = !maxSelected || selected.length < maxSelected;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-9 h-auto",
            !selectedOptions.length && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.value);
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "w-[var(--radix-popover-trigger-width)] p-0",
            "z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          align="start"
          sideOffset={4}
        >
          <div className="max-h-64 overflow-y-auto p-1">
            {options.length === 0 ? (
              <div className="py-6 text-center text-sm">No options available.</div>
            ) : (
              options.map((option) => {
                const isSelected = selected.includes(option.value);
                const isDisabled = !isSelected && !canAddMore;

                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      if (!isDisabled) {
                        handleToggle(option.value);
                      }
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      isDisabled && "cursor-not-allowed opacity-50",
                      isSelected && "bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.label}</span>
                  </div>
                );
              })
            )}
          </div>
          {maxSelected && (
            <div className="border-t p-2 text-xs text-muted-foreground">
              {selected.length} / {maxSelected} selected
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
