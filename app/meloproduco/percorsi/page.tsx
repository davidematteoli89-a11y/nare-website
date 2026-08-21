import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";

/**
 * /meloproduco/percorsi — Step 11W.
 *
 * GAP BACKEND DOCUMENTATO (verificato leggendo il codice sorgente reale di
 * aiDady, non assunto — vedi
 * "aiDady Business OS/aidady-business-os/app/api/public/[orgSlug]/"):
 * esistono route pubbliche per recipes, workshops, learning-products, ma
 * NESSUNA route pubblica dedicata ai "discovery paths" (percorsi). Il
 * blocco `discovery.paths` è presente nel DTO pubblico di ogni Recipe
 * (Fase 11L, { slug, title }), ma non c'è un endpoint che elenchi i
 * percorsi come entità autonome con una propria pagina (titolo esteso,
 * descrizione, elenco ordinato di ricette che lo compongono).
 *
 * Decisione (stesso pattern già usato per /guide, Step 7B): NON inventare
 * un endpoint che non esiste, NON inventare dati falsi. Questa route
 * esiste ed è pronta, ma resta un empty state onesto finché aiDady non
 * espone i percorsi pubblicamente.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/meloproduco/percorsi`;
const description = "I Percorsi MeLoProduco: sequenze di ricette pensate per accompagnarti passo dopo passo verso un obiettivo.";

export const metadata: Metadata = {
  title: "Percorsi",
  description,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Percorsi · MeLoProduco",
    description,
    url: CANONICAL_URL,
    type: "website",
  },
};

export default function PercorsiPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>MeLoProduco</Eyebrow>
      <h1 className="text-hero-display mt-3 max-w-2xl text-[var(--color-foreground)]">Percorsi</h1>
      <p className="text-lead mt-5 max-w-xl text-[var(--color-foreground-muted)]">
        Sequenze di ricette pensate per accompagnarti passo dopo passo verso un obiettivo.
      </p>

      <div className="mt-12 text-center">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="I Percorsi Narè stanno prendendo forma."
            description="Qui troveranno spazio itinerari guidati tra le ricette MeLoProduco, pensati per un obiettivo preciso."
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/meloproduco" variant="secondary">
            Scopri MeLoProduco
          </LinkButton>
          <LinkButton href="/ricette" variant="ghost">
            Esplora le ricette
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
