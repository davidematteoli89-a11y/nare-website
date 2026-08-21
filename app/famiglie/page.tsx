import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";

const CANONICAL_URL = "https://nare-website.vercel.app/famiglie";

export const metadata: Metadata = {
  title: "Narè Famiglie",
  description: "Narè Famiglie: attività pratiche per famiglie, bambini e scuole con Cristina di Narè — manualità, scoperta e vita quotidiana.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Narè Famiglie",
    description: "Attività pratiche per famiglie, bambini e scuole con Cristina di Narè — manualità, scoperta e vita quotidiana.",
    url: CANONICAL_URL,
    type: "website",
  },
};

/**
 * /famiglie — Narè Famiglie, landing definitiva (Fase 6, Step 6G-6M).
 *
 * Safety minori (Step 6L): nessuna foto di bambini è stata fornita dal
 * cliente né autorizzata — non si usa alcuna immagine stock o generata via
 * AI per riempire il vuoto. L'hero usa un pattern editoriale neutro (stessa
 * texture CSS già impiegata come fallback in components/RecipeImage.tsx),
 * mai un "immagine mancante" percepibile come errore.
 *
 * Nessun dato inventato (Step 6I): niente fasce d'età, durate, prezzi,
 * pacchetti, programmi scolastici o partnership — solo le tre aree
 * narrative (Famiglie/Scuole/Bambini) descritte in modo generico.
 *
 * Non è un servizio sanitario/terapeutico (Step 6G): dichiarato
 * esplicitamente in sottotitolo, come già nello skeleton Fase 1B.
 *
 * CTA non transazionale (Step 6M): nessun "Prenota laboratorio" — non
 * esiste un canale di richiesta reale.
 */
export default function FamigliePage() {
  return (
    <>
      {/* HERO */}
      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Narè Famiglie</Eyebrow>
            <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">Imparare facendo, fin da piccoli.</h1>
            <p className="text-lead mt-5 max-w-lg text-[var(--color-foreground-muted)]">
              Narè Famiglie sarà l&apos;area educativa dedicata a famiglie, bambini e scuole: attività concrete di
              manualità, scoperta e vita quotidiana — non un servizio sanitario, terapeutico o di consulenza clinica.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/cristina">Conosci Cristina</LinkButton>
              <LinkButton href="/" variant="secondary">
                Scopri Narè
              </LinkButton>
            </div>
          </div>
          <FallbackPanel />
        </div>
      </Container>

      {/* CONTESTI */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader eyebrow="I contesti" title="Dove può muoversi Narè Famiglie" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { title: "Famiglie", description: "Esperienze pensate per essere condivise tra adulti e bambini, dentro la vita quotidiana." },
              { title: "Scuole", description: "Laboratori e attività pratiche, nello stesso spirito di manualità e sperimentazione diretta." },
              { title: "Bambini", description: "Occasioni per sviluppare manualità, autonomia e creatività, imparando facendo." },
            ].map((context) => (
              <div key={context.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <p className="text-h3 text-[var(--color-foreground)]">{context.title}</p>
                <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{context.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* STATO */}
      <Container className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="Le prime attività Narè Famiglie stanno prendendo forma."
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
    </>
  );
}

/**
 * Fallback editoriale neutro, nessuna immagine (Step 6L/6U): niente
 * stock/AI di bambini. Stesso principio del fallback di RecipeImage, ma
 * senza wordmark specifico di un'altra area.
 */
function FallbackPanel() {
  return (
    <div
      className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent-subtle)]"
      role="img"
      aria-label="Narè Famiglie"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="relative text-eyebrow text-[var(--color-accent-text)]">Narè Famiglie</span>
    </div>
  );
}
