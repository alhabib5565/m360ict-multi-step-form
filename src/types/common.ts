import { TFormData } from "@/schema/multiStepFormSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export type TStepProps = {
  register: UseFormRegister<TFormData>;
  errors: FieldErrors<TFormData>;
};
