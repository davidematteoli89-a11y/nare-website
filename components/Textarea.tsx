import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hideLabel?: boolean;
}

/** Textarea con label sempre presente — stesso pattern di Input.tsx. */
export function Textarea({ label, hideLabel, id, className, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className={hideLabel ? "sr-only" : "text-sm font-medium text-[var(--color-foreground)]"}>
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
