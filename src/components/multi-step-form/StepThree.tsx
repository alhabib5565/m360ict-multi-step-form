"use client";
import { TFormData } from "@/schema/multiStepFormSchema";
import { TStepProps } from "@/types/common";
import React, { ChangeEvent } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormSetValue,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import InputField from "./InputField";
type TStepThreeProps = TStepProps & {
  control: Control<TFormData>;
  setValue: UseFormSetValue<TFormData>;
  skills: string[];
  remotePreference: number;
};
const StepThree = ({
  control,
  register,
  errors,
  skills,
  setValue,
  remotePreference,
}: TStepThreeProps) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: "experiences",
  });
  const handleSelectSkill = (
    e: ChangeEvent<HTMLInputElement>,
    value: string[],
    skill: string
  ) => {
    if (e.target.checked) {
      setValue("skills", [...value, skill]);
      append({ skill, years: 0 });
    } else {
      setValue(
        "skills",
        value.filter((s: string) => s !== skill)
      );
      const index = value.indexOf(skill);
      remove(index);
    }
  };
  return (
    <div className="space-y-4">
      <Controller
        name="skills"
        control={control}
        render={({ field: { value } }) => (
          <>
            <div className="flex gap-4 flex-wrap">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 h-fit">
                  <Input
                    onChange={(e) => handleSelectSkill(e, value, skill)}
                    type="checkbox"
                    id={skill}
                    className="h-4"
                  />
                  <Label
                    htmlFor={skill}
                    className="text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
            )}
          </>
        )}
      />
      <div className="space-y-2">
        <Label className="font-medium text-gray-700 pb-2">
          Experience for Each Skill
        </Label>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 gap-4 items-center">
            <InputField
              label={`Skill: ${field.skill}`}
              readOnly
              disabled
              {...register(`experiences.${index}.skill` as const)}
            />
            <InputField
              label="Years"
              placeholder="e.g. 2"
              error={errors.experiences?.[index]?.years?.message}
              {...register(`experiences.${index}.years` as const)}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Start Time"
          type="time"
          required
          error={errors.workingHours?.start?.message}
          {...register("workingHours.start")}
        />
        <InputField
          label="End Time"
          type="time"
          required
          error={errors.workingHours?.end?.message}
          {...register("workingHours.end")}
        />
      </div>

      <div className="flex gap-2 items-center">
        <InputField
          label="Remote Work Preference"
          type="range"
          className="w-full"
          required
          error={errors.remotePreference?.message}
          {...register("remotePreference")}
        />
        <span className="whitespace-nowrap">{remotePreference || 0} %</span>
      </div>

      <InputField
        label="Extra Notes (optional)"
        type="text"
        placeholder="Any additional information..."
        error={errors.notes?.message}
        {...register("notes")}
      />
    </div>
  );
};

export default StepThree;
