"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RegisterFormValidation } from "@/lib/validation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { FieldGroup } from "@/components/ui/field";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "../SubmitButton";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GENDER_OPTIONS,
  ID_TYPE_OPTIONS,
  INSURANCE_OPTIONS,
  PHYSICIAN_OPTIONS,
} from "@/constants";
import { Label } from "../ui/label";
type RegisterFormData = z.infer<typeof RegisterFormValidation>;

export const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormValidation),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: undefined,
      gender: undefined,
      address: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhysician: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      identificationType: "",
      identificationNumber: "",
      privacyConsent: false as any,
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      const patientData: RegisterUserParams = {
        userId: user.$id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        address: data.address,
        occupation: data.occupation,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
        primaryPhysician: data.primaryPhysician,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        allergies: data.allergies,
        currentMedication: data.currentMedication,
        familyMedicalHistory: data.familyMedicalHistory,
        pastMedicalHistory: data.pastMedicalHistory,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
        identificationDocument: undefined,
        privacyConsent: data.privacyConsent,
      };

      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
        <h1 className="header">Welcome! 👋</h1>
        <p className="text-dark-700">Let us know more about yourself.</p>
      </section>

      {/* Section 1: Personal Information */}
      <FieldGroup>
        <h2 className="sub-header">Personal Information</h2>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Shihab Raafat"
          iconSrc="/assets/icons/card-id.svg"
          iconAlt="user"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="shihab@raafat.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            type="email"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
            placeholder="Select date"
            dateFormat="MM/dd/yyyy"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <RadioGroup
                className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {GENDER_OPTIONS.map((option) => (
                  <FieldLabel htmlFor={`gender-${option.value}`} key={option.value}>
                    <Field orientation="horizontal" className="radio-group">
                      <FieldContent>
                        <FieldTitle>{option.label}</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New metro, Alexandria"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
      </FieldGroup>

      {/* Section 2: Emergency Contact */}
      <FieldGroup>
        <h2 className="sub-header">Emergency Contact Information</h2>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="emergencyContactName"
          label="Guardian name"
          placeholder="Guardian name"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="emergencyContactNumber"
          label="Guardian phone number"
          placeholder="(555) 123-4567"
        />
      </FieldGroup>

      {/* Section 3: Insurance */}
      <FieldGroup>
        <h2 className="sub-header">Insurance Information</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="Select insurance provider"
            selectOptions={INSURANCE_OPTIONS}
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>
      </FieldGroup>

      {/* Section 4: Medical History */}
      <FieldGroup>
        <h2 className="sub-header">Medical History</h2>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary physician"
          placeholder="Select a physician"
          selectOptions={PHYSICIAN_OPTIONS}
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="allergies"
          label="Allergies (if any)"
          placeholder="Peanuts, Penicillin, Pollen"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="currentMedication"
          label="Current medication"
          placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family medical history (if relevant)"
            placeholder="Mother had breast cancer"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy in 2015"
          />
        </div>
      </FieldGroup>

      {/* Section 5: Identification & Consent */}
      <FieldGroup>
        <h2 className="sub-header">Identification and Verification</h2>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification type"
          placeholder="Select identification type"
          selectOptions={ID_TYPE_OPTIONS}
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification number"
          placeholder="123456789"
        />
      </FieldGroup>

      <FieldGroup>
        <h2 className="sub-header">Consent and Privacy</h2>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to the use and disclosure of my health information for treatment purposes."
        />
      </FieldGroup>

      <SubmitButton isLoading={isLoading}>Submit and continue</SubmitButton>
    </form>
  );
};
