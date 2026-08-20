import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Etichetta piccola maiuscola sopra un titolo (es. "GUIDE", "CRISTINA IN RAI"). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]", className)}>
      {children}
    </p>
  );
}
