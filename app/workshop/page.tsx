import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Workshop",
  description: "Workshop e laboratori dal vivo di MeLoProduco.",
};

/**
 * Workshop — Step 1B: route predisposta ma NON in navigazione primaria
 * (vedi lib/nav.ts), coerente con Fase 0: oggi aiDady non ha ancora
 * Workshop pubblici pubblicati.
 */
export default function WorkshopPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Dal vivo" title="Workshop" />
      <div className="mt-8">
        <EmptyState title="Nessun workshop pubblicato al momento." description="I prossimi appuntamenti saranno mostrati qui." />
      </div>
    </Container>
  );
}
