import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Narè In Viaggio",
  description: "Narè fuori dalla propria sede: collaborazioni, eventi itineranti e progetti speciali.",
};

/**
 * Narè In Viaggio — Fase 1B: SOLO skeleton. Nessun calendario o luogo
 * inventato. Route non in navigazione primaria finché non esistono
 * collaborazioni/eventi reali.
 */
export default function InViaggioPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Fuori sede" title="Narè In Viaggio" description="Collaborazioni, eventi itineranti e progetti speciali." />
      <div className="mt-8">
        <EmptyState title="In preparazione." description="Le collaborazioni e gli eventi itineranti saranno presentati qui non appena disponibili." />
      </div>
    </Container>
  );
}
