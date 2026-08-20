import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Guide",
  description: "Approfondimenti su economia domestica, sostenibilità, ingredienti, sicurezza e tradizioni.",
};

export default function GuidePage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Editoriale" title="Guide" description="Economia domestica, sostenibilità, ingredienti, sicurezza, tradizioni." />
      <div className="mt-8">
        <EmptyState title="Archivio in costruzione." description="Le guide pubblicate da aiDady saranno collegate in Fase 2." />
      </div>
    </Container>
  );
}
