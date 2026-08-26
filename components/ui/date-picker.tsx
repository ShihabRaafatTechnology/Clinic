"use client";

import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDisplay(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function DatePicker({ value, onChange, placeholder, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? new Date().getMonth());
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
  const rootRef = useRef<HTMLDivElement>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: globalThis.MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function selectDay(day: number) {
    onChange(new Date(viewYear, viewMonth, day));
    setIsOpen(false);
  }

  const placeholderText = placeholder ?? "Select date";

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) setIsOpen((v) => !v); }}
        className={`flex h-8 w-full items-center rounded-md border bg-dark-400 px-2.5 py-1.5 text-left text-sm transition-colors ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } border-dark-500 hover:border-dark-400`}
      >
        {value ? (
          <span className="text-light-200">{formatDisplay(value)}</span>
        ) : (
          <span className="text-dark-600">{placeholderText}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-dark-500 bg-dark-400 p-3 shadow-lg shadow-black/40">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="rounded px-2 py-1 text-dark-700 hover:text-light-200">
              &lt;
            </button>
            <span className="text-sm font-medium text-light-200">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="rounded px-2 py-1 text-dark-700 hover:text-light-200">
              &gt;
            </button>
          </div>

          {/* Day labels */}
          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-dark-700">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                value &&
                value.getDate() === day &&
                value.getMonth() === viewMonth &&
                value.getFullYear() === viewYear;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-green-500 text-white"
                      : "text-light-200 hover:bg-dark-500"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
