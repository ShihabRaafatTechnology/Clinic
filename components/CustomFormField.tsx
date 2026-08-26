"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";
import React, { useId, useState } from "react";
import type { ReactNode } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { E164Number } from "libphonenumber-js";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./ui/date-picker";
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

interface CustomProps {
  control: any;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  renderSkeleton?: (field: any) => ReactNode;
  suggestions?: string[];
  suggestionSubtitle?: string;
  type?: string;
  autoComplete?: string;
  selectOptions?: { value: string; label: string }[];
}

function CustomFormField({
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
  selectOptions = [],
}: CustomProps) {
  const [isFocused, setIsFocused] = useState(false);
  const domId = useId();

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

          {fieldType === FormFieldType.CHECKBOX ? (
            <div className="flex items-center gap-3">
              <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
              {label && <FieldLabel htmlFor={domId}>{label}</FieldLabel>}
            </div>
          ) : (
            <div className="relative w-full">
              <div
                className={`${
                  fieldType === FormFieldType.PHONE_INPUT || fieldType === FormFieldType.SKELETON
                    ? ""
                    : "flex items-center rounded-md border bg-dark-400 transition-colors"
                } ${
                  fieldState.invalid
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-dark-500 focus-within:border-primary/60"
                }`}
              >
                {iconSrc && fieldType !== FormFieldType.PHONE_INPUT && (
                  <Image
                    src={iconSrc}
                    height={24}
                    width={24}
                    alt={iconAlt ?? "icon"}
                    className="ml-3 shrink-0"
                  />
                )}

                {fieldType === FormFieldType.PHONE_INPUT ? (
                  <PhoneInput
                    international
                    withCountryCallingCode
                    countryCallingCodeEditable={false}
                    defaultCountry="EG"
                    countrySelectComponent={CountrySelect as React.ComponentType<{
                      value?: string;
                      onChange: (value?: string) => void;
                      options: { value: string; label: string }[];
                    }>}
                    {...field}
                    id={domId}
                    name={domId}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={(field.value as E164Number) || undefined}
                    onChange={field.onChange}
                    onBlur={() => setIsFocused(false)}
                    onFocus={() => setIsFocused(true)}
                    className="input-phone flex-1 border-0"
                  />
                ) : fieldType === FormFieldType.DATE_PICKER ? (
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                ) : fieldType === FormFieldType.SELECT ? (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={selectOptions}
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                ) : fieldType === FormFieldType.TEXTAREA ? (
                  <Textarea
                    {...field}
                    id={domId}
                    placeholder={placeholder}
                    className="shad-textarea border-0 focus-visible:shadow-none"
                  />
                ) : fieldType === FormFieldType.SKELETON ? (
                  renderSkeleton?.(field)
                ) : (
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
                    (s: string) =>
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
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default CustomFormField;
