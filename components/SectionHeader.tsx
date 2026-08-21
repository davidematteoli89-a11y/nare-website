import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

/**
 * Intestazione di sezione editoriale: eyebrow opzionale + titolo serif +
 * descrizione opzionale + CTA opzionale. Rifinita in Fase 2E con la scala
 * tipografica centralizzata (text-h2).
 *
 * Prop `as` (Fase 9 post-deploy QA): di default renderizza un `<h2>`, il
 * caso più comune (sotto-sezione di una pagina che ha già un H1 proprio,
 * es. /meloproduco, /ritiri). Su alcune pagine (/ricette, /incontri,
 * /cristina-in-rai) SectionHeader è però l'UNICO titolo della pagina —
 * senza `as="h1"` quella pagina non avrebbe alcun H1 semantico. La
 * dimensione visiva (text-h2) resta invariata in entrambi i casi: solo il
 * tag HTML cambia, nessun impatto visivo.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <Heading className="text-h2 text-[var(--color-foreground)]">{title}</Heading>
        {description && <p className="text-body mt-2 max-w-2xl text-[var(--color-foreground-muted)]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
