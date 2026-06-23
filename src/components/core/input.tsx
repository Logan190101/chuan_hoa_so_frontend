import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  endAdornment?: ReactNode;
  error?: string;
  label?: string;
  startAdornment?: ReactNode;
};

export function Input({
  className,
  endAdornment,
  error,
  id,
  label,
  startAdornment,
  ...props
}: InputProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#191c1e]"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {startAdornment && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#737685]">
            {startAdornment}
          </span>
        )}
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-11 w-full rounded-lg border bg-[#f8f9fb] py-2.5 pr-4 text-sm text-[#191c1e] outline-none transition placeholder:text-[#737685] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/20",
            startAdornment ? "pl-10" : "pl-4",
            endAdornment ? "pr-11" : "pr-4",
            error ? "border-[#ba1a1a]" : "border-[#c3c6d6]",
            className,
          )}
          id={id}
          {...props}
        />
        {endAdornment && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            {endAdornment}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-[#ba1a1a]" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
