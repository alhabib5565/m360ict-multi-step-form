import { TFormData } from "@/schema/multiStepFormSchema";

export const getCurrentStepFields = (currentStep: number) => {
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
    case 3:
      fieldsToValidate = [
        "skills",
        "experiences",
        "workingHours",
        "remotePreference",
        "notes",
      ];
      break;
    case 4:
      fieldsToValidate = ["emergencyContact"];
      break;
    case 5:
      fieldsToValidate = ["confirmInformation"];
      break;
    default:
      break;
  }

  return fieldsToValidate;
};
