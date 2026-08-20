import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Narè Famiglie",
  description: "Attività educative e laboratori pratici per famiglie, bambini e scuole con Cristina di Narè.",
};

/**
 * Narè Famiglie — Fase 1B: SOLO skeleton. Area educativa (famiglie,
 * bambini, scuole, laboratori didattici) — esplicitamente NON presentata
 * come terapia o servizio sanitario. Nessun servizio specifico inventato.
 * Route non in navigazione primaria finché non esistono contenuti reali.
 */
export default function FamigliePage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Educazione"
        title="Narè Famiglie"
        description="Attività pratiche e laboratori per famiglie, bambini e scuole — non un servizio sanitario o terapeutico."
      />
      <div className="mt-8">
        <EmptyState title="In preparazione." description="Le attività per famiglie e scuole saranno presentate qui non appena disponibili." />
      </div>
    </Container>
  );
}
