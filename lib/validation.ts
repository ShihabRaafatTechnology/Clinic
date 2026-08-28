import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

// Validation schema for the user form using Zod
export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  email: z.string().email("Invalid email address. Please enter a valid one."),
  phone: z
    .string()
    .refine(isValidPhoneNumber, "Invalid phone number. Please enter a valid one."),
});

// Validation schema for the full patient registration form
export const RegisterFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
  phone: z
    .string()
    .refine(isValidPhoneNumber, "Invalid phone number."),
  birthDate: z.coerce.date().refine((d) => d < new Date(), "Date of birth must be in the past."),
  gender: z.enum(["Male", "Female"]),
  address: z.string().min(5, "Address must be at least 5 characters."),
  occupation: z.string().min(2, "Occupation must be at least 2 characters."),
  emergencyContactName: z.string().min(2, "Name is required."),
  emergencyContactNumber: z
    .string()
    .refine(isValidPhoneNumber, "Invalid phone number."),
  primaryPhysician: z.string().min(1, "Please select a physician."),
  insuranceProvider: z.string().min(1, "Insurance provider is required."),
  insurancePolicyNumber: z.string().min(1, "Policy number is required."),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File>().optional(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to the privacy policy." }),
  }),
});