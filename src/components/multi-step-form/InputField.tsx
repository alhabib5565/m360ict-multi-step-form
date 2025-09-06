"use client";
import { HTMLInputTypeAttribute } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type TInputField = {
  label: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  className?: string;
  readOnly?: true;
};

const InputField = ({
  label,
  error,
  type = "text",
  placeholder,
  required,
  className,
  readOnly,
  ...props
}: TInputField) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${error ? "border-red-500 focus:border-red-500" : ""}`}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
export default InputField;
