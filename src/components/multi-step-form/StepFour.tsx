import { TFormData } from "@/schema/multiStepFormSchema";
import { TStepProps } from "@/types/common";
import React from "react";
import { Control } from "react-hook-form";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { relations } from "@/constants/common";
type TStepFourProps = TStepProps & {
  control: Control<TFormData>;
  age: number;
};
const StepFour = ({ control, register, errors, age }: TStepFourProps) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Emergency Contact Name"
        required
        placeholder="Enter emergency contact name"
        error={errors.emergencyContact?.contactName?.message}
        {...register("emergencyContact.contactName")}
      />

      <SelectField
        control={control}
        label="Relationship"
        name="emergencyContact.relation"
        options={relations}
        error={errors.emergencyContact?.relation?.message}
        placeholder="Select relationship"
        required
      />

      <InputField
        label="Emergency Contact Phone"
        required
        placeholder="Enter phone number (e.g. +1-123-456-7890)"
        error={errors.emergencyContact?.phoneNumber?.message}
        {...register("emergencyContact.phoneNumber")}
      />

      {/* Guardian Contact - Show only if under 21 */}
      {age < 21 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Guardian Name"
            required
            placeholder="Enter guardian name"
            error={errors.emergencyContact?.guardianContactName?.message}
            {...register("emergencyContact.guardianContactName")}
          />

          <InputField
            label="Guardian Phone"
            required
            placeholder="Enter guardian phone (e.g. +1-123-456-7890)"
            error={errors.emergencyContact?.guardianContactPhone?.message}
            {...register("emergencyContact.guardianContactPhone")}
          />
        </div>
      )}
    </div>
  );
};

export default StepFour;
