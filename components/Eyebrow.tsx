import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Etichetta piccola maiuscola sopra un titolo (es. "GUIDE", "CRISTINA IN
 * RAI"). Usa --color-accent-text (non --color-accent) perché qui la
 * terracotta è colore di TESTO: serve la variante più scura per restare a
 * norma WCAG AA su small text (vedi globals.css, Fase 2B).
 */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-eyebrow text-[var(--color-accent-text)]", className)}>{children}</p>;
}
