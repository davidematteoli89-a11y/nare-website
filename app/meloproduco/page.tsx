import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { LinkButton } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "MeLoProduco",
  description:
    "MeLoProduco è il progetto di Narè dedicato all'autoproduzione domestica: ricette, guide, casa, detergenza, cosmesi naturale.",
};

/**
 * Landing /meloproduco — Fase 1B, Step 10. Predisposta come landing
 * dell'area/progetto MeLoProduco dentro il brand ombrello Narè, NON
 * costruita completamente in questa fase (niente ultime ricette reali,
 * categorie, metodo dettagliato — demandati a Fase 2+).
 *
 * Nota URL (vedi Fase 1B, punto 5): /ricette e /guide restano a livello
 * radice per SEO/semplicità, non sotto /meloproduco/ricette — il
 * collegamento concettuale a MeLoProduco è nella UI (questa landing), non
 * nell'URL.
 */
export default function MeLoProducoPage() {
  return (
    <Container className="py-16">
      <Eyebrow>Un progetto Narè</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl text-[var(--color-foreground)]">MeLoProduco</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-foreground-muted)]">
        Placeholder — l&apos;area editoriale e pratica dedicata all&apos;autoproduzione domestica: casa, detergenza, cosmesi
        naturale, botanica, cucina e preparazioni. Contenuti reali e struttura completa in una fase successiva.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href="/ricette">Ricette</LinkButton>
        <LinkButton href="/guide" variant="secondary">
          Guide
        </LinkButton>
      </div>

      <div className="mt-16">
        <SectionHeader eyebrow="Ultime pubblicazioni" title="Ricette e autoproduzioni" />
        <div className="mt-6">
          <EmptyState title="Archivio in costruzione." description="Le ultime pubblicazioni da MeLoProduco saranno mostrate qui." />
        </div>
      </div>
    </Container>
  );
}
