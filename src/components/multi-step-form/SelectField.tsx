"use client";
import { Controller, Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type TOption = { value: string; label: string };
type TSelectFieldProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  error?: string;
  options: TOption[] | string[];
  required?: boolean;
  className?: string;
  placeholder?: string;
};

const SelectField = ({
  name,
  control,
  label,
  error,
  options,
  required,
  className,
  placeholder,
}: TSelectFieldProps) => {
  const generatedId = name.toLowerCase().replace(/\s+/g, "-");
  const formatedOptions = useMemo(() => {
    return options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
    );
  }, [options]);
  return (
    <div className={`space-y-2 ${className} w-full`}>
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
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger
              id={generatedId}
              className={cn("!w-full !h-[52px] rounded-[100px]", {
                "border-red-500": error,
              })}
            >
              <SelectValue placeholder={placeholder ?? `Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {formatedOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
