"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { getCountryCallingCode } from "libphonenumber-js";
import Flags from "react-phone-number-input/flags";

interface CountryOption {
  value: string;
  label: string;
}

interface CountrySelectProps {
  value?: string;
  onChange: (value?: string) => void;
  options: CountryOption[];
}

function Flag({
  country,
  className = "",
}: {
  country?: string;
  className?: string;
}) {
  const FlagComponent = country
    ? (Flags as unknown as Record<string, ComponentType<{ title?: string }>>)[
        country
      ]
    : undefined;

  return (
    <span
      className={`inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ${className}`}
    >
      {FlagComponent ? <FlagComponent title={country} /> : null}
    </span>
  );
}

/**
 * Custom dark-themed country selector replacing the native <select>.
 */
export function CountrySelect({
  value,
  onChange,
  options,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // The package injects an "International" option whose value is
  // undefined — we don't want it since the calling code is pinned.
  const selectableOptions = options.filter((o) => o.value);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: globalThis.MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Select country"
        className="flex h-full cursor-pointer items-center gap-1.5 px-3 py-2 transition-colors hover:bg-dark-500"
      >
        <Flag country={value} />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="#76828D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-30 mt-2 max-h-64 w-72 overflow-y-auto rounded-xl border border-dark-500 bg-dark-400 p-1 shadow-lg shadow-black/40">
          {selectableOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  option.value === value
                    ? "bg-green-500/15 text-green-500"
                    : "text-light-200 hover:bg-dark-500"
                }`}
              >
                <Flag country={option.value} />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                <span className="shrink-0 text-xs text-dark-600">
                  +{getCountryCallingCode(option.value as never)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
