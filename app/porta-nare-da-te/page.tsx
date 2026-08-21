import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Eyebrow } from "@/components/Eyebrow";
import { PortaNareForm } from "@/components/PortaNareForm";

/**
 * /porta-nare-da-te — Fase 12 (Step 12B): lead generation per Narè
 * Incontri/Ritiri/Famiglie/In Viaggio. Pagina editoriale, non un form B2B
 * freddo: il form (PortaNareForm, client component) è incapsulato in
 * Suspense perché legge `useSearchParams()` per precompilare il contesto
 * dal parametro `?tipo=` passato dalle CTA delle 4 sezioni (Step 12C) —
 * richiesto da Next.js per qualunque uso di useSearchParams in una pagina
 * altrimenti statica.
 *
 * SEO (Step 12Y): canonical SEMPRE pulito su /porta-nare-da-te, anche con
 * `?tipo=...` in query string — stesso principio già applicato a /ricette
 * con i filtri discovery (Fase 11): le combinazioni di parametro non
 * devono generare canonical distinti.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/porta-nare-da-te`;
const title = "Porta Narè da te";
const description =
  "Una scuola, uno spazio, una struttura, una community o semplicemente un'idea da costruire insieme. Raccontaci dove sei e cosa immagini.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title,
    description,
    url: CANONICAL_URL,
    type: "website",
  },
};

const CONTEXT_EXAMPLES = [
  "Scuole",
  "Associazioni",
  "Agriturismi",
  "Strutture ricettive",
  "Aziende",
  "Community",
  "Eventi privati",
  "Spazi culturali",
  "Gruppi e famiglie",
];

export default function PortaNareDaTePage() {
  return (
    <Container className="py-16 sm:py-20">
      <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "Porta Narè da te" }]} />

      <div className="mt-6 max-w-2xl">
        <Eyebrow>Costruiamolo insieme</Eyebrow>
        {/* as="h1" (coerente col resto del sito, Fase 9 post-deploy QA):
            unica intestazione di pagina. */}
        <h1 className="text-h1 mt-3 text-[var(--color-foreground)]">Porta Narè da te</h1>
        <p className="text-lead mt-4 text-[var(--color-foreground-muted)]">{description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CONTEXT_EXAMPLES.map((c) => (
            <span
              key={c}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-1 text-small text-[var(--color-foreground-muted)]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 max-w-2xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <Suspense fallback={null}>
          <PortaNareForm />
        </Suspense>
      </div>
    </Container>
  );
}
