import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";

/**
 * /meloproduco/percorsi/[slug] — Step 11W.
 *
 * Stesso gap backend documentato in app/meloproduco/percorsi/page.tsx:
 * nessun endpoint pubblico per il dettaglio di un singolo percorso. Questa
 * route esiste (per non lasciare un 404 su link a percorsi eventualmente
 * condivisi in futuro) ma mostra sempre un empty state onesto, mai dati
 * inventati per lo slug richiesto.
 *
 * `noindex`: non ha senso indicizzare pagine che oggi non hanno contenuto
 * reale specifico per slug.
 */
export const metadata: Metadata = {
  title: "Percorso",
  robots: { index: false, follow: true },
};

export default async function PercorsoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await params; // slug non utilizzabile oggi: nessun endpoint pubblico per il dettaglio percorso (vedi commento sopra)

  return (
    <Container className="py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "MeLoProduco", href: "/meloproduco" }, { label: "Percorsi", href: "/meloproduco/percorsi" }, { label: "Percorso" }]} />

      <div className="mt-8 text-center">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="Questo percorso non è ancora disponibile."
            description="I Percorsi Narè stanno prendendo forma: torna a trovarci presto."
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/meloproduco/percorsi" variant="secondary">
            Tutti i Percorsi
          </LinkButton>
          <LinkButton href="/ricette" variant="ghost">
            Esplora le ricette
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
