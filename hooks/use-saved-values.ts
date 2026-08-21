"use client";

import { useCallback, useState } from "react";

/**
 * Persists a list of strings in localStorage and exposes them as state.
 */
export function useSavedValues(storageKey: string) {
  const [values, setValues] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      return [];
    }
  });

  const add = useCallback(
    (value: string) => {
      if (!value.trim()) return;
      setValues((prev) => {
        const next = prev.includes(value) ? prev : [...prev, value];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [storageKey]
  );

  const remove = useCallback(
    (value: string) => {
      setValues((prev) => {
        const next = prev.filter((v) => v !== value);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [storageKey]
  );

  return { values, add, remove };
}
