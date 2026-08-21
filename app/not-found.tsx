import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkButton } from "@/components/Button";

/**
 * 404 globale brandizzata Narè — Fase 3, Step 3N.
 *
 * Sostituisce la 404 di default Next.js (sfondo nero, tono tecnico)
 * rilevata nel QA visivo di Fase 2B. Vale per tutto il sito: qualunque
 * route inesistente, e anche `notFound()` chiamato da /ricette/[slug]
 * quando una Recipe non esiste o non è pubblicata (Step 3O).
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Eyebrow>Narè</Eyebrow>
      <h1 className="text-h1 mt-3 text-[var(--color-foreground)]">Questa pagina non c&apos;è.</h1>
      <p className="text-body mt-4 max-w-md text-[var(--color-foreground-muted)]">
        Potrebbe essere stata spostata, non essere ancora stata pubblicata, oppure l&apos;indirizzo non è corretto.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/">Torna alla Home</LinkButton>
        <LinkButton href="/meloproduco" variant="secondary">
          Vai a MeLoProduco
        </LinkButton>
      </div>
    </Container>
  );
}
