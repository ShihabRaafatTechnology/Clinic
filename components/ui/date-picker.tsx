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
  const [mode, setMode] = useState<"days" | "months" | "years">("days");
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? new Date().getMonth());
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
  const rootRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear;
  const yearRange = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

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
    setMode("days");
  }

  function selectMonth(month: number) {
    setViewMonth(month);
    setMode("days");
  }

  function selectYear(year: number) {
    setViewYear(year);
    setMode("months");
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
          {/* Header — click to switch between days / months / years */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (mode === "days") prevMonth();
                else if (mode === "months") setViewYear((y) => Math.max(minYear, y - 1));
              }}
              className="rounded px-2 py-1 text-dark-700 hover:text-light-200"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "days" ? "months" : m === "months" ? "years" : "days"));
              }}
              className="group flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-light-200 hover:bg-dark-500"
            >
              {mode === "years" ? (
                <span>
                  {minYear} – {maxYear}
                </span>
              ) : (
                <span>
                  {mode === "months" ? viewYear : `${MONTHS[viewMonth]} ${viewYear}`}
                </span>
              )}
              <span className="text-xs text-dark-700 group-hover:text-dark-600">▼</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (mode === "days") nextMonth();
                else if (mode === "months") setViewYear((y) => Math.min(maxYear, y + 1));
              }}
              className="rounded px-2 py-1 text-dark-700 hover:text-light-200"
            >
              &gt;
            </button>
          </div>

          {mode === "days" && (
            <>
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
            </>
          )}

          {mode === "months" && (
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((monthName, i) => {
                const isSelected = viewYear === value?.getFullYear() && i === value?.getMonth();
                return (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => selectMonth(i)}
                    className={`rounded-lg px-2 py-2 text-xs transition-colors ${
                      isSelected
                        ? "bg-green-500 text-white"
                        : "text-light-200 hover:bg-dark-500"
                    }`}
                  >
                    {monthName.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}

          {mode === "years" && (
            <div className="grid max-h-48 grid-cols-3 gap-1 overflow-y-auto">
              {yearRange.map((year) => {
                const isSelected = year === value?.getFullYear();
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => selectYear(year)}
                    className={`rounded-lg px-2 py-2 text-xs transition-colors ${
                      isSelected
                        ? "bg-green-500 text-white"
                        : "text-light-200 hover:bg-dark-500"
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
