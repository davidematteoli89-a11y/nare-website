import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";

// Canonical/OG url da NEXT_PUBLIC_SITE_URL (Fase 9B) — mai hardcodati.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/ritiri`;

export const metadata: Metadata = {
  title: "Narè Ritiri",
  description: "Narè Ritiri: esperienze più immersive con Cristina di Narè, tra tempo più lento, manualità, natura e condivisione.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Narè Ritiri",
    description: "Esperienze più immersive con Cristina di Narè, tra tempo più lento, manualità, natura e condivisione.",
    url: CANONICAL_URL,
    type: "website",
  },
};

/**
 * /ritiri — Narè Ritiri, landing definitiva (Fase 6, Step 6B-6F).
 *
 * Solo landing: NON esiste /ritiri/[slug] con contenuto reale, perché non
 * esiste alcun modello dati/API/contenuto che lo giustifichi oggi (Step
 * 6F) — la route [slug] resta uno skeleton che risponde 404 (già
 * predisposta in Fase 1B, non toccata).
 *
 * Nessun ritiro reale presentato come attivo (Step 6B/6E): il blocco di
 * stato è esplicitamente "in preparazione", non un archivio vuoto
 * mascherato da vetrina prodotto. Nessun linguaggio wellness/terapeutico
 * (detox, guarigione, reset, percorsi terapeutici) — Step 6C/6D.
 *
 * Immagine: cristina-workshop.jpg, foto reale già presente in
 * public/images/cristina/ (fornita dal cliente in Fase 4B) ma non ancora
 * usata da nessuna pagina — pertinente qui (natura, gesto manuale, campo di
 * lavanda), non uno stock (Step 6U).
 */
export default function RitiriPage() {
  return (
    <>
      {/* HERO */}
      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Narè Ritiri</Eyebrow>
            <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">Tempo per fare, imparare e stare.</h1>
            <p className="text-lead mt-5 max-w-lg text-[var(--color-foreground-muted)]">
              Narè Ritiri sarà l&apos;area dedicata a esperienze più immersive: giornate o weekend con più tempo,
              manualità, natura e condivisione, con lo stesso metodo pratico e prudente di tutto Narè.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/cristina">Conosci Cristina</LinkButton>
              <LinkButton href="/" variant="secondary">
                Scopri Narè
              </LinkButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            <Image
              src="/images/cristina/cristina-workshop.jpg"
              alt="Cristina Nigrelli, di Narè, tra la lavanda"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* COSA SIGNIFICA UN RITIRO NARÈ */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader eyebrow="La direzione" title="Cosa significa un Ritiro Narè" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Tempo più lento", description: "Giornate pensate per rallentare, senza fretta e senza un programma sovraccarico." },
              { title: "Attività pratiche", description: "Manualità ed esperienza diretta, nello stesso spirito di autoproduzione di MeLoProduco." },
              { title: "Natura e luoghi", description: "Spazi all'aperto e luoghi scelti con cura, non semplici location di passaggio." },
              { title: "Condivisione", description: "Momenti pensati per stare insieme, in piccoli gruppi, con Cristina." },
            ].map((pillar, i) => (
              <div key={pillar.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <p className="text-eyebrow text-[var(--color-accent-text)]">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-h3 mt-2 text-[var(--color-foreground)]">{pillar.title}</p>
                <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* STATO — Step 6E */}
      <Container className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="I primi Ritiri Narè stanno prendendo forma."
            description="Questa pagina si aggiornerà non appena i dettagli saranno pronti. Nel frattempo puoi conoscere Cristina o iscriverti alla newsletter per essere aggiornata/o."
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/cristina" variant="secondary">
            Conosci Cristina
          </LinkButton>
          <LinkButton href="/#newsletter" variant="ghost">
            Iscriviti alla newsletter
          </LinkButton>
        </div>
      </Container>

      {/* CTA lead gen (Fase 12, Step 12C) */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-14 text-center sm:py-16">
          <SectionHeader
            className="mx-auto max-w-lg items-center text-center [&>div]:mx-auto"
            title="Stai immaginando un ritiro o un'esperienza di più giorni?"
          />
          <div className="mt-5">
            <LinkButton href="/porta-nare-da-te?tipo=ritiro">Porta Narè da te</LinkButton>
          </div>
        </Container>
      </div>
    </>
  );
}
