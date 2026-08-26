"use client";

import { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function Select({ value, onChange, options, placeholder, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: globalThis.MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) setIsOpen((v) => !v); }}
        className={`flex h-8 w-full items-center justify-between rounded-md border bg-dark-400 px-2.5 py-1.5 text-left text-sm transition-colors ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } border-dark-500 hover:border-dark-400`}
      >
        {selectedLabel ? (
          <span className="text-light-200">{selectedLabel}</span>
        ) : (
          <span className="text-dark-600">{placeholder ?? "Select..."}</span>
        )}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="#76828D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-dark-500 bg-dark-400 p-1 shadow-lg shadow-black/40">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  option.value === value
                    ? "bg-green-500/15 text-green-500"
                    : "text-light-200 hover:bg-dark-500"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
