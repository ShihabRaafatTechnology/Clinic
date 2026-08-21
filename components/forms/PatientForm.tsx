"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const UserFormValidation = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(50, "Username must be at most 50 characters."),
})

type UserFormData = z.infer<typeof UserFormValidation>

export const PatientForm = () => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit({ username }: UserFormData) {
    console.log({ username })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                {...field}
                id="username"
                placeholder="Enter your username"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
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
  )
}
