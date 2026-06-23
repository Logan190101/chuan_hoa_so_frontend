import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label": string;
};

const variantClasses = {
  primary:
    "bg-[#003d9b] text-white shadow-sm hover:bg-[#00307a] focus-visible:ring-[#003d9b]/30",
  secondary:
    "border border-[#c3c6d6] bg-white text-[#003d9b] hover:bg-[#f3f6ff] focus-visible:ring-[#003d9b]/20",
  ghost:
    "bg-transparent text-[#003d9b] hover:bg-[#eaf0ff] focus-visible:ring-[#003d9b]/20",
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-bold transition duration-150 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}

export function IconButton({ children, className, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-[#434654] transition hover:bg-[#eaf0ff] hover:text-[#003d9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003d9b]/30 active:scale-95",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
