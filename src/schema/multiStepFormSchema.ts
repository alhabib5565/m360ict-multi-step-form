import { getAge } from "@/utils/getAge";
import { z } from "zod";

const phoneNumberSchema = z
  .string()
  .regex(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/, "Phone must be like +1-123-456-7890");
const personalSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "Full name must have at least 2 words",
    }),
  email: z.string().email("Invalid email address"),
  phoneNumber: phoneNumberSchema,
  dob: z
    .string({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date",
    })
    .refine(
      (date) => {
        const age = getAge(date);
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
  minSalary: z.coerce.number().min(1, "Minimum salary must be at least 1"),
  maxSalary: z.coerce.number().min(1, "Maximum salary must be at least 1"),
  manager: z.string().min(1, "Manager is required"),
});

const skillsPreferencesSchema = z.object({
  skills: z.array(z.string()).min(3, "Select at least 3 skills"),
  experiences: z.array(
    z.object({
      skill: z.string(),
      years: z.coerce
        .number({ invalid_type_error: "Please enter valid number" })
        .min(1, "Experience required"),
    })
  ),
  workingHours: z
    .object({
      start: z.string().min(1, "Start time required"),
      end: z.string().min(1, "End time required"),
    })
    .refine(
      (data) => {
        return (
          new Date(`1970-01-01T${data.end}:00`) >
          new Date(`1970-01-01T${data.start}:00`)
        );
      },
      { message: "End time must be after start time", path: ["end"] }
    ),
  remotePreference: z.coerce.number().min(0).max(100),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});
const emergencyContactSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  relation: z.string().min(1, "Relationship is required"),
  phoneNumber: phoneNumberSchema,
  guardianContactName: z.string().optional(),
  guardianContactPhone: z.string().optional(),
});

// Combined schema with all validation
export const formSchema = z
  .object({
    ...personalSchema.shape,
    ...baseJobDetailsSchema.shape,
    ...skillsPreferencesSchema.shape,
    emergencyContact: emergencyContactSchema,
    confirmInformation: z.boolean().refine((val) => val === true, {
      message: "You must confirm the information is correct",
    }),
  })
  .superRefine((data, ctx) => {
    const { jobType, minSalary, maxSalary, dob: date, emergencyContact } = data;

    // Salary required check
    if (minSalary == null || maxSalary == null) {
      ctx.addIssue({
        code: "custom",
        message: "Salary expectation is required",
        path: ["minSalary"],
      });
    }

    // Full-time validation
    if (jobType === "Full-time") {
      console.log({ maxSalary, minSalary });
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

    const age = getAge(date);
    if (age < 21) {
      if (
        !emergencyContact.guardianContactName ||
        emergencyContact.guardianContactName.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Guardian name is required for applicants under 21",
          path: ["emergencyContact", "guardianContactName"],
        });
      }
      if (
        !emergencyContact.guardianContactPhone ||
        emergencyContact.guardianContactPhone.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Guardian phone is required for applicants under 21",
          path: ["emergencyContact", "guardianContactPhone"],
        });
      }
    }
  });

export type TFormData = z.infer<typeof formSchema>;

export const formDefaultValue: TFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dob: "",
  profilePicture: "",
  // step:2
  department: "",
  positionTitle: "",
  startDate: "",
  jobType: "Full-time",
  maxSalary: 0,
  minSalary: 0,
  manager: "",
  //step:3
  skills: [],
  experiences: [],
  workingHours: {
    end: "",
    start: "",
  },
  remotePreference: 0,
  notes: "",
  // step: 4
  emergencyContact: {
    contactName: "",
    relation: "",
    phoneNumber: "",
    guardianContactName: "",
    guardianContactPhone: "",
  },
  confirmInformation: false,
};
