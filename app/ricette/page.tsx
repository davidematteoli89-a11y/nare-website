import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Ricette & Autoproduzione",
  description: "Ricette e autoproduzioni testate e verificate con prudenza: casa, detergenza, cosmesi naturale, cucina.",
};

/**
 * Archivio Ricette — Step 1B/1I: solo skeleton di route. Filtri (per
 * categoria) e collegamento reale a listPublicRecipes() sono demandati alla
 * Fase 2: qui la pagina esiste e ha metadata corretti, ma non fa fetch.
 */
export default function RicettePage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Archivio" title="Ricette & Autoproduzione" description="Casa, detergenza, cosmesi naturale, cucina e preparazioni." />
      <div className="mt-8">
        <EmptyState title="Archivio in costruzione." description="Le ricette pubblicate da aiDady saranno collegate in Fase 2." />
      </div>
    </Container>
  );
}
