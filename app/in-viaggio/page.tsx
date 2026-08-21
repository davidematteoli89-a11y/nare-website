import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";

// Canonical/OG url da NEXT_PUBLIC_SITE_URL (Fase 9B) — mai hardcodati.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/in-viaggio`;

export const metadata: Metadata = {
  title: "Narè In Viaggio",
  description: "Narè In Viaggio: Narè fuori dalla propria sede, per collaborazioni, eventi e progetti in contesti diversi.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Narè In Viaggio",
    description: "Narè fuori dalla propria sede, per collaborazioni, eventi e progetti in contesti diversi.",
    url: CANONICAL_URL,
    type: "website",
  },
};

/**
 * /in-viaggio — Narè In Viaggio, landing definitiva (Fase 6, Step 6N-6Q).
 *
 * Collaborazioni (Step 6Q): nessuna collaborazione reale pubblicabile
 * esiste oggi — niente loghi, nomi o case study. I contesti elencati sono
 * presentati esplicitamente come "possibili", non come clienti/partner
 * attivi (Step 6P).
 *
 * Niente copertura nazionale o servizi non esistenti promessi (Step 6O).
 *
 * Immagine: stessa cristina-workshop.jpg di /ritiri (Cristina, contesto
 * naturale/all'aperto) — pertinente anche qui come "Narè fuori sede",
 * nessuna nuova foto necessaria/inventata (Step 6U).
 */
export default function InViaggioPage() {
  return (
    <>
      {/* HERO */}
      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Narè In Viaggio</Eyebrow>
            <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">Narè arriva dove ci sono persone da incontrare.</h1>
            <p className="text-lead mt-5 max-w-lg text-[var(--color-foreground-muted)]">
              Narè può muoversi fuori dalla propria sede: collaborare, portare esperienze e attività in contesti
              diversi, con lo stesso metodo e la stessa cura di sempre.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/incontri">Scopri Narè Incontri</LinkButton>
              <LinkButton href="/cristina" variant="secondary">
                Conosci Cristina
              </LinkButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            <Image
              src="/images/cristina/cristina-workshop.jpg"
              alt="Cristina Nigrelli, di Narè, all'aperto"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* DOVE PUÒ ARRIVARE NARÈ */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader
            eyebrow="I contesti possibili"
            title="Dove può arrivare Narè"
            description="Contesti in cui Narè potrebbe muoversi in futuro — non collaborazioni già attive."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Eventi", "Strutture", "Scuole", "Aziende", "Associazioni", "Territori"].map((context) => (
              <div key={context} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <p className="text-h3 text-[var(--color-foreground)]">{context}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* STATO / COLLABORAZIONI */}
      <Container className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="Narè In Viaggio sta prendendo forma."
            description="Al momento non ci sono collaborazioni attive da mostrare. Nel frattempo puoi scoprire Narè Incontri o conoscere Cristina."
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/incontri" variant="secondary">
            Scopri Narè Incontri
          </LinkButton>
          <LinkButton href="/cristina" variant="ghost">
            Conosci Cristina
          </LinkButton>
        </div>
      </Container>
    </>
  );
}
