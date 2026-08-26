"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { FieldGroup } from "@/components/ui/field";
import { useSavedValues } from "@/hooks/use-saved-values";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

// Define the type for the form data based on the Zod validation schema
type UserFormData = z.infer<typeof UserFormValidation>;

export const PatientForm = () => {
  // State to manage loading state of the submit button
  const [isLoading, setIsLoading] = useState(false);
  // Initialize the router for navigation after form submission
  const router = useRouter();

  // Use the custom hook to manage saved values for names, emails, and phones
  const names = useSavedValues("carepulse-names");
  const emails = useSavedValues("carepulse-emails");
  const phones = useSavedValues("carepulse-phones");

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(data: UserFormData) {
    setIsLoading(true);
    names.add(data.name);
    emails.add(data.email);
    phones.add(data.phone);
    form.reset();
    try {
      const userData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      // Send the user data to the backend API
      const user = await createUser(userData);
      // Handle successful user creation (e.g. redirect)
      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }



  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      autoComplete="off"
      className="space-y-6 flex-1"
    >
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
          iconSrc="/assets/icons/card-id.svg"
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

        <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
      </FieldGroup>
    </form>
  );
};
