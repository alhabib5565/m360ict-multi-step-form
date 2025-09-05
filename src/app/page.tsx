"use client";
import StepIndicator from "@/components/multi-step-form/StepIndicator";
import { Button } from "@/components/ui/button";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import InputField from "@/components/multi-step-form/InputField";
import SelectField from "@/components/multi-step-form/SelectField";
import { cn } from "@/lib/utils";
import { mockManagers } from "@/constants/mockManagerData";
import SearchableSelectField from "@/components/multi-step-form/SearchAbleSelectField";
const departmentOptions = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
];

const jobTypes = ["Full-time", "Part-time", "Contract"];
const personalSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "Full name must have at least 2 words",
    }),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(
      /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/,
      "Phone must be like +1-123-456-7890"
    ),
  dob: z
    .string({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date",
    })
    .refine(
      (date) => {
        const today = new Date();
        const dob = new Date(date);
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        return age >= 18;
      },
      { message: "You must be at least 18 years old" }
    ),
  profilePicture: z
    .any()
    .optional()
    .superRefine((file, ctx) => {
      if (!file || file.length === 0) return true; // optional
      const f = file[0]; // single file
      const allowedType = ["image/jpeg", "image/png"];

      if (!allowedType.includes(f.type)) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG/PNG files are allowed",
        });
      }
      if (file.size > 2 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be less than 2MB",
        });
      }
    }),
});

const baseJobDetailsSchema = z.object({
  department: z.string().min(1, "Department is required"),
  positionTitle: z
    .string()
    .min(3, "Position title must be at least 3 characters"),
  startDate: z.string().refine((date) => {
    const today = new Date();
    const start = new Date(date);
    const diffDays = Math.floor(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 && diffDays <= 90;
  }, "Start date must be within 0–90 days from today"),
  jobType: z.enum(["Full-time", "Part-time", "Contract"], {
    required_error: "Job type is required",
  }),
  minSalary: z.number({ invalid_type_error: "Please enter valid number" }),
  maxSalary: z.number({ invalid_type_error: "Please enter valid number" }),
  manager: z.string().min(1, "Manager is required"),
});

// Combined schema with all validation
const formSchema = z
  .object({
    ...personalSchema.shape,
    ...baseJobDetailsSchema.shape,
  })
  .superRefine((data, ctx) => {
    const { jobType, minSalary, maxSalary } = data;

    // Salary required check
    if (minSalary == null || maxSalary == null) {
      ctx.addIssue({
        code: "custom",
        message: "Salary expectation is required",
        path: ["minSalary"],
      });
      return;
    }

    // Full-time validation
    if (jobType === "Full-time") {
      if (minSalary < 30000) {
        ctx.addIssue({
          code: "custom",
          message: "Full-time minimum salary must be at least $30,000",
          path: ["minSalary"],
        });
      }
      if (maxSalary > 200000) {
        ctx.addIssue({
          code: "custom",
          message: "Full-time maximum salary cannot exceed $200,000",
          path: ["maxSalary"],
        });
      }
    }

    // Contract validation
    if (jobType === "Contract") {
      if (minSalary < 50) {
        ctx.addIssue({
          code: "custom",
          message: "Contract minimum hourly rate must be at least $50",
          path: ["minSalary"],
        });
      }
      if (maxSalary > 150) {
        ctx.addIssue({
          code: "custom",
          message: "Contract maximum hourly rate cannot exceed $150",
          path: ["maxSalary"],
        });
      }
    }

    if (minSalary > maxSalary) {
      ctx.addIssue({
        code: "custom",
        message: "Minimum salary cannot exceed maximum salary",
        path: ["minSalary"],
      });
    }
  });

type TFormData = z.infer<typeof formSchema>;

const MultiStepFrom = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    register,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dob: "",
      profilePicture: "",
      department: "",
      positionTitle: "",
      startDate: "",
      jobType: "Full-time",
      maxSalary: 0,
      minSalary: 0,
      manager: "",
    },
  });

  const [jobType, department] = watch(["jobType", "department"]);

  const managerOptions = useMemo(() => {
    return mockManagers
      .filter((manager) => manager.department == department)
      .map((m) => ({
        value: m.id,
        label: m.name,
      }));
  }, [department]);
  console.log(managerOptions, "managers");
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof TFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "fullName",
          "email",
          "phoneNumber",
          "dob",
          "profilePicture",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "department",
          "positionTitle",
          "startDate",
          "jobType",
          "maxSalary",
          "minSalary",
          "manager",
        ];
        break;
      // case 3:
      //   fieldsToValidate = [""];
      //   break;
      // case 4:
      //   fieldsToValidate = [""];
      //   break;
    }

    return await trigger(fieldsToValidate); // trigger validation to check thise field are valid
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: TFormData) => {
    console.log(data);
  };

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

      default:
        break;
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
