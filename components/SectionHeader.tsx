import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

/**
 * Intestazione di sezione editoriale: eyebrow opzionale + titolo serif +
 * descrizione opzionale + CTA opzionale. Rifinita in Fase 2E con la scala
 * tipografica centralizzata (text-h2).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h2 className="text-h2 text-[var(--color-foreground)]">{title}</h2>
        {description && <p className="text-body mt-2 max-w-2xl text-[var(--color-foreground-muted)]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
