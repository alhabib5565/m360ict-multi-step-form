"use client";
import { TStepProps } from "@/types/common";
import React, { useMemo } from "react";
import SelectField from "./SelectField";
import { departmentOptions, jobTypes } from "@/constants/common";
import InputField from "./InputField";
import { cn } from "@/lib/utils";
import SearchableSelectField from "./SearchAbleSelectField";
import { Control } from "react-hook-form";
import { TFormData } from "@/schema/multiStepFormSchema";
import { mockManagers } from "@/constants/mockManagerData";
type TStepTowProps = TStepProps & {
  control: Control<TFormData>;
  jobType: string;
  department: string;
};
const StepTwo = ({
  errors,
  register,
  control,
  department,
  jobType,
}: TStepTowProps) => {
  const managerOptions = useMemo(() => {
    return mockManagers
      .filter((manager) => manager.department == department)
      .map((m) => ({
        value: m.id,
        label: m.name,
      }));
  }, [department]);
  return (
    <div className="space-y-4">
      <SelectField
        control={control}
        label="Select Department"
        name="department"
        options={departmentOptions}
        error={errors.department?.message?.toString()}
        placeholder="Choose a department"
      />

      <InputField
        label="Position Title"
        required
        placeholder="Enter position title"
        error={errors.positionTitle?.message?.toString()}
        {...register("positionTitle")}
      />

      <InputField
        label="Start Date"
        required
        type="date"
        placeholder="Select start date"
        error={errors.startDate?.message?.toString()}
        {...register("startDate")}
      />

      {/* Job Type radio buttons */}
      <div className="flex gap-4 items-center mb-4">
        {jobTypes.map((option) => (
          <div key={option}>
            <label
              htmlFor={option}
              className={cn(
                "px-3 capitalize border-[1px] border-[#A2A2A2] text-[16px] py-0.5 gap-1 cursor-pointer text-[#1f1f1fe8] flex w-fit items-center hover:bg-[#EFEFEF] rounded-2xl ",
                {
                  "bg-primary/10 text-primary border-primary ":
                    jobType === option,
                }
              )}
            >
              {option}
            </label>
            <input
              {...register("jobType")}
              type="radio"
              value={option}
              id={option}
              hidden
            />
          </div>
        ))}
      </div>
      {errors.jobType && (
        <p className="text-sm text-red-500">
          {errors.jobType.message?.toString()}
        </p>
      )}

      {/* Salary Expectation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Minimum Salary / Hourly Rate"
          type="number"
          required
          placeholder={jobType === "Full-time" ? "Min $30,000" : "Min $50"}
          error={errors.minSalary?.message?.toString()}
          {...register("minSalary", { valueAsNumber: true })}
        />

        <InputField
          label="Maximum Salary / Hourly Rate"
          type="number"
          required
          placeholder={jobType === "Full-time" ? "Max $200,000" : "Max $150"}
          error={errors.maxSalary?.message as string}
          {...register("maxSalary", { valueAsNumber: true })}
        />
      </div>

      {/* Manager Select */}
      <SearchableSelectField
        name="manager"
        control={control}
        label="Manager"
        options={managerOptions}
        disabled={!department}
        placeholder="Choose a manager"
        searchPlaceholder="Search managers..."
        required
        error={errors.manager?.message?.toString()}
      />
    </div>
  );
};

export default StepTwo;
