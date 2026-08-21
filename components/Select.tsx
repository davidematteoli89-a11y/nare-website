import type { SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hideLabel?: boolean;
  children: ReactNode;
}

/** Select con label sempre presente (visibile o solo per screen reader) — stesso pattern di Input.tsx. */
export function Select({ label, hideLabel, id, className, children, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className={hideLabel ? "sr-only" : "text-sm font-medium text-[var(--color-foreground)]"}>
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
