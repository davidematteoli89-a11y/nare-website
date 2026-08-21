import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { SearchClient } from "@/components/discovery/SearchClient";
import { listAllPublicRecipes } from "@/lib/aidady-api";

export const metadata: Metadata = {
  title: "Cerca",
  robots: { index: false, follow: true },
};

// BUG FIX #2 (Fase 11, audit end-to-end unpublish): la freschezza dei dati
// è garantita da `cache: "no-store"` sui fetch in lib/aidady-api.ts (vedi
// commento esteso lì), non da una direttiva di pagina — `revalidate` qui
// era insufficiente perché la Next.js Data Cache può sopravvivere al
// build cache tra un deploy e l'altro.

/**
 * /cerca — Step 11U: ricerca reale attivata (in precedenza solo UI
 * placeholder, Step 1B). Client-side, niente LLM/ricerca semantica —
 * fetch una tantum di tutte le ricette pubblicate (Server Component),
 * filtro .includes() nel browser (Client Component).
 */
export default async function SearchPage() {
  const recipes = await safeLoadAllRecipes();

  return (
    <Container className="py-16" as="main">
      <SectionHeader as="h1" title="Cerca" description="Cerca in MeLoProduco: ricette, ingredienti, materiali, categorie e bisogni." />
      <div className="mt-8">
        {recipes === null ? (
          <EmptyState
            title="La ricerca non è disponibile in questo momento."
            description="Riprova tra qualche minuto, oppure esplora l'archivio ricette."
          />
        ) : (
          <SearchClient recipes={recipes} />
        )}
      </div>
    </Container>
  );
}

async function safeLoadAllRecipes() {
  try {
    return await listAllPublicRecipes();
  } catch {
    return null;
  }
}
