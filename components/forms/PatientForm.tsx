"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useSavedValues } from "@/hooks/use-saved-values";

const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  email: z.string().email("Invalid email address. Please enter a valid one."),
  phone: z
    .string()
    .refine(isValidPhoneNumber, "Invalid phone number. Please enter a valid one."),
});

type UserFormData = z.infer<typeof UserFormValidation>;

export const PatientForm = () => {
  const names = useSavedValues("carepulse-names");
  const emails = useSavedValues("carepulse-emails");
  const phones = useSavedValues("carepulse-phones");

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(data: UserFormData) {
    console.log(data);
    names.add(data.name);
    emails.add(data.email);
    phones.add(data.phone);
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there!👋</h1>
        <p className="text-dark-700">Schedule your first appointment.</p>
      </section>
      <FieldGroup>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Shihab Raafat"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          suggestions={names.values}
          suggestionSubtitle="Saved name"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email address"
          placeholder="shihab@raafat.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
          type="email"
          suggestions={emails.values}
          suggestionSubtitle="Saved email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
          iconSrc="/assets/icons/phone.svg"
          iconAlt="phone"
          suggestions={phones.values}
          suggestionSubtitle="Saved phone"
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="shad-primary-btn w-full"
        >
          Get Started
        </Button>
      </FieldGroup>
    </form>
  );
};
