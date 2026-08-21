"use client";

import Image from "next/image";
import type { MouseEvent } from "react";

interface SuggestionsProps {
  items: string[];
  onSelect: (value: string) => void;
  subtitle?: string;
}

/**
 * Custom autocomplete dropdown.
 * Edit the look of suggestions from this single file.
 */
export function Suggestions({
  items,
  onSelect,
  subtitle = "Saved",
}: SuggestionsProps) {
  if (items.length === 0) return null;

  return (
    <ul
      data-slot="suggestions"
      className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-xl border border-dark-500 bg-dark-400 shadow-lg shadow-black/40"
    >
      {items.map((item) => (
        <li key={item}>
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onSelect(item);
            }}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-dark-500"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-dark-500 bg-dark-500">
              <Image src="/assets/icons/card-id.svg" alt="" width={18} height={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">
                {item}
              </span>
              <span className="block text-xs text-dark-600">{subtitle}</span>
            </span>
            <span className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-xs font-bold text-green-500">
              {item.charAt(0).toUpperCase()}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
