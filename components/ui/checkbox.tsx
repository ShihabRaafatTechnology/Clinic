"use client";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, label, disabled }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 text-sm ${disabled ? "opacity-50" : "cursor-pointer"}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-green-500 bg-green-500"
            : "border-dark-500 bg-dark-400"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:border-green-500/50"}`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {label && <span className="text-light-200">{label}</span>}
    </label>
  );
}
