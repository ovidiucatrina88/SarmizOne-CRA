import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  badgeClassName,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (value: string) => {
    onChange([...selected, value]);
    setInputValue("");
  };

  // Create a set for O(1) lookup
  const selectedSet = new Set(selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "relative flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
            open && "ring-2 ring-ring ring-offset-2",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => {
              const option = options.find((o) => o.value === item);
              return (
                <Badge
                  key={item}
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-1 px-2 py-1",
                    badgeClassName
                  )}
                >
                  {option?.label || item}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            {selected.length === 0 && (
              <span className="mr-2 text-sm text-muted-foreground">
                {placeholder}
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command className="w-full">
          <CommandInput 
            placeholder="Search options..." 
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandEmpty className="py-6 text-center text-sm">
            No options found.
          </CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = selectedSet.has(option.value);
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={isSelected}
                  onSelect={() => {
                    if (!isSelected) {
                      handleSelect(option.value);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2",
                    isSelected && "bg-muted text-muted-foreground"
                  )}
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}