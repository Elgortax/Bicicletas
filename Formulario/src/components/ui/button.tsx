import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type Props = {
  variant?: ButtonVariant;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  children,
  disabled,
  variant = "primary",
  isLoading,
  ...props
}: Props) {
  const styles = {
    primary: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-600",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300",
  } as const;

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Procesando..." : children}
    </button>
  );
}
