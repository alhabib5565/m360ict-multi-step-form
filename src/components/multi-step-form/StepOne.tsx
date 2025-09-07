import React from "react";
import InputField from "./InputField";
import { TStepProps } from "@/types/common";

const StepOne = ({ errors, register }: TStepProps) => {
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
};

export default StepOne;
