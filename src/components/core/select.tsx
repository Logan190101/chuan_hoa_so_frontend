import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  helperText?: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  className,
  helperText,
  id,
  label,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#191c1e]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <select
          className={cn(
            "h-12 w-full appearance-none rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] px-4 pr-10 text-sm text-[#191c1e] outline-none transition focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/20 disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          id={id}
          {...props}
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 my-auto mr-4 size-4 text-[#434654]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {helperText && <p className="text-xs leading-5 text-[#434654]">{helperText}</p>}
    </div>
  );
}
