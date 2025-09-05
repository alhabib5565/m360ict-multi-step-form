"use client";
import { Controller, Control } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

type TOption = { value: string; label: string };
type TSearchableSelectFieldProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  error?: string;
  options: TOption[] | string[];
  required?: boolean;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
};

const SearchableSelectField = ({
  name,
  control,
  label,
  error,
  options,
  required,
  className,
  placeholder,
  searchPlaceholder,
  disabled = false,
}: TSearchableSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const generatedId = name.toLowerCase().replace(/\s+/g, "-");

  const formattedOptions = useMemo(() => {
    return options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
    );
  }, [options]);

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label
        htmlFor={generatedId}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={generatedId}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between font-normal",
                  error && "border-red-500",
                  disabled && "opacity-50 cursor-not-allowed",
                  !field.value && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                {field.value
                  ? formattedOptions.find(
                      (option) => option.value === field.value
                    )?.label
                  : placeholder ?? `Select ${label}`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={
                    searchPlaceholder ?? `Search ${label.toLowerCase()}...`
                  }
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {`No ${label.toLowerCase()} found.`}
                  </CommandEmpty>
                  <CommandGroup>
                    {formattedOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          const selectedValue =
                            currentValue === field.value ? "" : currentValue;
                          field.onChange(selectedValue);
                          setOpen(false);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default SearchableSelectField;
