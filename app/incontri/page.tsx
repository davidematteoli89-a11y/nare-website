import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Narè Incontri",
  description: "Workshop, laboratori e incontri dal vivo con Cristina di Narè.",
};

/**
 * Narè Incontri — Step 1B (Fase 1B rebrand). Sostituisce la vecchia route
 * /workshop (era solo skeleton, nessuna logica reale persa).
 *
 * Mapping concettuale: lato pubblico l'area si chiama "Narè Incontri", ma
 * consuma tecnicamente l'entità "workshop" esposta da aiDady
 * (GET /api/public/[orgSlug]/workshops...) — aiDady NON viene modificato,
 * continua a chiamarsi "workshop" internamente. Il rename è solo di
 * presentazione pubblica, vedi lib/aidady-api.ts per l'eventuale client
 * futuro.
 */
export default function IncontriPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Dal vivo" title="Narè Incontri" description="Workshop, laboratori e giornate tematiche." />
      <div className="mt-8">
        <EmptyState title="Nessun incontro pubblicato al momento." description="I prossimi appuntamenti saranno mostrati qui." />
      </div>
    </Container>
  );
}
