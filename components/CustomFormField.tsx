"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import type { ReactNode } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Suggestions } from "./Suggestions";
import { CountrySelect } from "./CountrySelect";
import Image from "next/image";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  fieldType: FormFieldType;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSkeleton?: (field: any) => ReactNode;
  suggestions?: string[];
  suggestionSubtitle?: string;
  type?: string;
  autoComplete?: string;
}

function CustomFormField<T extends FieldValues>({
  control,
  fieldType,
  name,
  label,
  placeholder,
  iconSrc,
  iconAlt,
  disabled,
  renderSkeleton,
  suggestions = [],
  suggestionSubtitle,
  type = "text",
  autoComplete = "nope",
}: CustomProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  // Random DOM id/name so browser autofill can't recognize the field.
  // Safe because react-hook-form tracks values via Controller, not the DOM.
  const [domId] = useState(
    () => `${String(name)}-${Math.random().toString(36).slice(2, 8)}`
  );

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FieldLabel htmlFor={domId}>{label}</FieldLabel>
          )}

          <div className="relative w-full">
            <div
              className={`${
                fieldType === FormFieldType.PHONE_INPUT
                  ? ""
                  : "flex items-center rounded-md border bg-dark-400 transition-colors"
              } ${
                fieldState.invalid
                  ? "border-red-500 focus-within:border-red-500"
                  : "border-dark-500 focus-within:border-primary/60"
              }`}
            >
              {/* Show icon in all fields but phone input doesn't show */}
              {iconSrc && fieldType !== FormFieldType.PHONE_INPUT && (
                <Image
                  src={iconSrc}
                  height={24}
                  width={24}
                  alt={iconAlt ?? "icon"}
                  className="ml-3 shrink-0"
                />
              )}

              {/* Phone Input Form */}
              {fieldType === FormFieldType.PHONE_INPUT ? (
                <PhoneInput
                  international
                  withCountryCallingCode
                  countryCallingCodeEditable={false}
                  defaultCountry="EG"
                  countrySelectComponent={CountrySelect as never}
                  id={domId}
                  name={domId}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  value={(field.value as string) || undefined}
                  onChange={field.onChange}
                  onBlur={() => setIsFocused(false)}
                  onFocus={() => setIsFocused(true)}
                  className="input-phone flex-1 border-0"
                />
              ) : fieldType === FormFieldType.SKELETON ? (
                renderSkeleton?.(field)
              ) : (
                /* Default Input Form (User Form) */
                <Input
                  {...field}
                  id={domId}
                  name={domId}
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className="shad-input border-0 focus-visible:shadow-none"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              )}
            </div>

            {isFocused && fieldType !== FormFieldType.SKELETON && (
              <Suggestions
                items={suggestions.filter(
                  (s) =>
                    s
                      .toLowerCase()
                      .includes(String(field.value ?? "").toLowerCase()) &&
                    s !== field.value
                )}
                subtitle={suggestionSubtitle}
                onSelect={(value) => field.onChange(value)}
                iconSrc={iconSrc}
              />
            )}
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default CustomFormField;
