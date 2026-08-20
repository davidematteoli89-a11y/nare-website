import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Etichetta di categoria (es. "Cosmesi naturale", "Casa") su card editoriali. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-foreground-muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
