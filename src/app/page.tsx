"use client";
import StepIndicator from "@/components/multi-step-form/StepIndicator";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { skillsData } from "@/constants/skillData";
import { getAge } from "@/utils/getAge";
import {
  formDefaultValue,
  formSchema,
  TFormData,
} from "@/schema/multiStepFormSchema";
import { getCurrentStepFields } from "@/utils/getCurrentStepFields";
import Swal from "sweetalert2";
import StepOne from "@/components/multi-step-form/StepOne";
import StepTwo from "@/components/multi-step-form/StepTwo";
import StepThree from "@/components/multi-step-form/StepThree";
import StepFour from "@/components/multi-step-form/StepFour";
import StepFive from "@/components/multi-step-form/StepFive";

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

  const [jobType, department, remotePreference, dob] = watch([
    "jobType",
    "department",
    "remotePreference",
    "dob",
  ]);

  const skills = skillsData[department as keyof typeof skillsData];

  const handleValidateCurrentStep = async () => {
    const fieldsToValidate: (keyof TFormData)[] =
      getCurrentStepFields(currentStep);

    return await trigger(fieldsToValidate);
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
        return <StepOne register={register} errors={errors} />;
      case 2:
        return (
          <StepTwo
            register={register}
            errors={errors}
            control={control}
            jobType={jobType}
            department={department}
          />
        );
      case 3:
        return (
          <StepThree
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            skills={skills}
            remotePreference={remotePreference}
          />
        );
      case 4:
        return (
          <StepFour
            register={register}
            errors={errors}
            control={control}
            age={age}
          />
        );
      case 5:
        return (
          <StepFive
            formState={formState}
            errors={errors}
            control={control}
            age={age}
          />
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
