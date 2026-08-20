import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Etichetta di categoria (es. "Cosmesi naturale", "Casa") su card editoriali.
 * Rifinita in Fase 2E: niente pillola con bordo "SaaS tag" — solo testo
 * maiuscolo discreto con tracking, come una rubrica di rivista.
 */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-meta font-semibold uppercase tracking-[0.08em] text-[var(--color-accent-text)]", className)}>
      {children}
    </span>
  );
}
