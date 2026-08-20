import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Narè Ritiri",
  description: "Esperienze immersive con Cristina di Narè: natura, manualità, tempo per sé.",
};

/**
 * Narè Ritiri — Fase 1B: SOLO skeleton, brand architecture predisposta.
 * Nessun retreat reale inventato, nessun booking/checkout. Route non in
 * navigazione primaria finché non esistono servizi reali (vedi lib/nav.ts).
 */
export default function RitiriPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Esperienze" title="Narè Ritiri" description="Giornate e momenti immersivi, tra natura, manualità e tempo per sé." />
      <div className="mt-8">
        <EmptyState title="In preparazione." description="I prossimi ritiri saranno presentati qui non appena disponibili." />
      </div>
    </Container>
  );
}
