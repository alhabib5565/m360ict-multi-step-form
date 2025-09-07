import { TFormData } from "@/schema/multiStepFormSchema";
import { TStepProps } from "@/types/common";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
type TStepFiveProps = Pick<TStepProps, "errors"> & {
  control: Control<TFormData>;
  formState: TFormData | null;
  age: number;
};
const StepFive = ({ control, errors, formState, age }: TStepFiveProps) => {
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
                <strong>Date of Birth:</strong> {formState.dob} (Age: {age})
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Job Details</h3>
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
                <strong>Working Hours:</strong> {formState.workingHours?.start}{" "}
                - {formState.workingHours?.end}
              </div>
              <div>
                <strong>Remote Preference:</strong> {formState.remotePreference}
                %
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
                <strong>Name:</strong> {formState.emergencyContact?.contactName}
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
};

export default StepFive;
