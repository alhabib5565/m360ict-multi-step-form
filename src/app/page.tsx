"use client";
import StepIndicator from "@/components/multi-step-form/StepIndicator";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import InputField from "@/components/multi-step-form/InputField";
import SelectField from "@/components/multi-step-form/SelectField";
import { cn } from "@/lib/utils";
import { mockManagers } from "@/constants/mockManagerData";
import SearchableSelectField from "@/components/multi-step-form/SearchAbleSelectField";
import { skillsData } from "@/constants/skillData";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { getAge } from "@/utils/getAge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  formDefaultValue,
  formSchema,
  TFormData,
} from "@/schema/multiStepFormSchema";
import { departmentOptions, jobTypes, relations } from "@/constants/common";
import { getCurrentStepFields } from "@/utils/getCurrentStepFields";
import Swal from "sweetalert2";

const MultiStepFrom = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<TFormData | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: formDefaultValue,
  });
  const { fields, remove, append } = useFieldArray({
    control,
    name: "experiences",
  });
  const [jobType, department, remotePreference, dob] = watch([
    "jobType",
    "department",
    "remotePreference",
    "dob",
  ]);

  const managerOptions = useMemo(() => {
    return mockManagers
      .filter((manager) => manager.department == department)
      .map((m) => ({
        value: m.id,
        label: m.name,
      }));
  }, [department]);
  const skills = skillsData[department as keyof typeof skillsData];

  const handleValidateCurrentStep = async () => {
    const fieldsToValidate: (keyof TFormData)[] =
      getCurrentStepFields(currentStep);

    return await trigger(fieldsToValidate); // trigger validation to check thise field are valid
  };

  const handleNextStep = async () => {
    const isValid = await handleValidateCurrentStep();
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  console.log(formState);
  const onSubmit = (data: TFormData) => {
    console.log(data);
    Swal.fire({
      title: "form submited successfully!",
      icon: "success",
      draggable: true,
    });
    reset(formDefaultValue);
    setFormState(null);
    setCurrentStep(1);
  };

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

  useEffect(() => {
    setValue("manager", "");
    setValue("experiences", []);
    setValue("skills", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  useEffect(() => {
    const subscription = watch((value) => {
      setFormState(value as TFormData); // save to local state
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const age = getAge(dob);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <InputField
              label="Full Name"
              required
              placeholder="Enter your full name"
              error={errors.fullName?.message?.toString()}
              {...register("fullName")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Email"
                type="email"
                required
                placeholder="Enter your email"
                error={errors.email?.message?.toString()}
                {...register("email")}
              />

              <InputField
                label="Phone Number"
                required
                placeholder="Enter your phone number (e.g. +1-123-456-7890)"
                error={errors.phoneNumber?.message?.toString()}
                {...register("phoneNumber")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Date of Birth "
                required
                type="date"
                placeholder="Select your DOB"
                error={errors.dob?.message?.toString()}
                {...register("dob")}
              />
              <InputField
                label="Profile Picture (optional)"
                required={false}
                placeholder="Select Profile"
                type="file"
                error={errors.profilePicture?.message as string}
                {...register("profilePicture")}
              />
            </div>
          </div>
        );
      case 2:
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
                placeholder={
                  jobType === "Full-time" ? "Min $30,000" : "Min $50"
                }
                error={errors.minSalary?.message?.toString()}
                {...register("minSalary", { valueAsNumber: true })}
              />

              <InputField
                label="Maximum Salary / Hourly Rate"
                type="number"
                required
                placeholder={
                  jobType === "Full-time" ? "Max $200,000" : "Max $150"
                }
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
      case 3:
        return (
          <div className="space-y-4">
            <Controller
              name="skills"
              control={control}
              render={({ field: { value } }) => (
                <>
                  <div className="flex gap-4 flex-wrap">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 h-fit"
                      >
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
                    <p className="text-sm text-red-500">
                      {errors.skills.message}
                    </p>
                  )}
                </>
              )}
            />
            <div className="space-y-2">
              <Label className="font-medium text-gray-700 pb-2">
                Experience for Each Skill
              </Label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 gap-4 items-center"
                >
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
              <span className="whitespace-nowrap">
                {remotePreference || 0} %
              </span>
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
      case 4:
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
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

            {formState && (
              <>
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Full Name:</strong> {formState.fullName}
                    </div>
                    <div>
                      <strong>Email:</strong> {formState.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {formState.phoneNumber}
                    </div>
                    <div>
                      <strong>Date of Birth:</strong> {formState.dob} (Age:{" "}
                      {age})
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Job Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Department:</strong> {formState.department}
                    </div>
                    <div>
                      <strong>Position:</strong> {formState.positionTitle}
                    </div>
                    <div>
                      <strong>Start Date:</strong> {formState.startDate}
                    </div>
                    <div>
                      <strong>Job Type:</strong> {formState.jobType}
                    </div>
                    <div>
                      <strong>Salary Range:</strong> $
                      {formState.minSalary?.toLocaleString()} - $
                      {formState.maxSalary?.toLocaleString()}
                    </div>
                    <div>
                      <strong>Manager:</strong> {formState.manager}
                    </div>
                  </div>
                </div>

                {/* Skills & Preferences */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Skills & Preferences
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Skills:</strong> {formState.skills?.join(", ")}
                    </div>
                    <div>
                      <strong>Working Hours:</strong>{" "}
                      {formState.workingHours?.start} -{" "}
                      {formState.workingHours?.end}
                    </div>
                    <div>
                      <strong>Remote Preference:</strong>{" "}
                      {formState.remotePreference}%
                    </div>
                    {formState.notes && (
                      <div>
                        <strong>Notes:</strong> {formState.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Name:</strong>{" "}
                      {formState.emergencyContact?.contactName}
                    </div>
                    <div>
                      <strong>Relationship:</strong>{" "}
                      {formState.emergencyContact?.relation}
                    </div>
                    <div>
                      <strong>Phone:</strong>{" "}
                      {formState.emergencyContact?.phoneNumber}
                    </div>
                    {age < 21 && (
                      <>
                        <div>
                          <strong>Guardian Name:</strong>{" "}
                          {formState.emergencyContact?.guardianContactName}
                        </div>
                        <div>
                          <strong>Guardian Phone:</strong>{" "}
                          {formState.emergencyContact?.guardianContactPhone}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Confirmation */}
            <div className="border-t pt-4">
              <Controller
                name="confirmInformation"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirm"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="confirm" className="text-sm">
                      I confirm all information is correct and ready to submit *
                    </Label>
                  </div>
                )}
              />
              {errors.confirmInformation && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmInformation.message}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="max-w-5xl mx-auto w-full bg-white rounded-lg shadow-sm border p-4 md:p-8 lg:p-12">
        <StepIndicator currentStep={currentStep} />
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-6"
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button type="button" onClick={handleNextStep} className="px-6">
                Next Step
              </Button>
            ) : (
              <Button type="submit" className="px-6">
                Complete
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepFrom;
