import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
}

/** Input con label sempre presente (visibile o solo per screen reader) — Step 1S accessibility. */
export function Input({ label, hideLabel, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : "text-sm font-medium text-[var(--color-foreground)]"}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
