import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Input } from "@/components/Input";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Cerca",
  robots: { index: false, follow: true },
};

/** Ricerca — Step 1B: solo UI del campo, nessuna logica di ricerca reale in questa fase. */
export default function SearchPage() {
  return (
    <Container className="py-16">
      <SectionHeader title="Cerca" />
      <form className="mt-8 max-w-lg" role="search">
        <Input label="Cerca ricette, guide e approfondimenti" name="q" placeholder="Cerca…" />
      </form>
      <div className="mt-8">
        <EmptyState title="Ricerca non ancora attiva." description="La funzionalità di ricerca sarà collegata in una fase successiva." />
      </div>
    </Container>
  );
}
