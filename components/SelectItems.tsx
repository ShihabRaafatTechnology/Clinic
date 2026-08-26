"use client";

import { useId, useState, useRef, useEffect, type ReactNode, type MouseEvent } from "react";

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

interface SelectItemsProps {
  children: ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
}

/**
 * Item wrapper — used inside CustomFormField fieldType=SELECT.
 * Renders as a hidden div so the parent can collect data-value + children.
 */
function SelectItems({ value, children }: SelectItemProps) {
  return (
    <div data-slot="select-item" data-value={value} className="hidden">
      {children}
    </div>
  );
}

/**
 * Dropdown container — renders collected items as a dark-themed list.
 * Used internally by CustomFormField for fieldType=SELECT.
 */
function SelectDropdown({
  items,
  selectedValue,
  onValueChange,
  placeholder,
}: {
  items: { value: string; label: string; content: ReactNode }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.value === selectedValue);

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
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-11 w-full cursor-pointer items-center justify-between rounded-md border border-dark-500 bg-dark-400 px-3 py-2 text-left text-sm transition-colors hover:border-dark-400 focus:border-primary/60"
      >
        {selectedItem ? (
          <span className="flex items-center gap-2 text-light-200">
            {selectedItem.content}
          </span>
        ) : (
          <span className="text-dark-600">{placeholder ?? "Select..."}</span>
        )}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4 4 4-4" stroke="#76828D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-dark-500 bg-dark-400 p-1 shadow-lg shadow-black/40">
          {items.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onValueChange(item.value);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item.value === selectedValue
                    ? "bg-green-500/15 text-green-500"
                    : "text-light-200 hover:bg-dark-500"
                }`}
              >
                {item.content}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { SelectItems, SelectDropdown };
