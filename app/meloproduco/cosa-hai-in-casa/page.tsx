import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";
import { MaterialPicker } from "@/components/discovery/MaterialPicker";
import { listAllPublicRecipes } from "@/lib/aidady-api";

/**
 * /meloproduco/cosa-hai-in-casa — Step 11Q/11R.
 *
 * Matching deterministico (NO AI) tra i materiali che l'utente dichiara di
 * avere e i materiali richiesti da ogni ricetta (blocco discovery, Fase
 * 11L). Il fetch di TUTTE le ricette pubblicate avviene qui una sola volta
 * (Server Component, Step 11AA) e viene passato al Client Component che fa
 * selezione + matching in memoria nel browser.
 *
 * Ricette senza discovery.materials (array vuoto) sono escluse a monte:
 * non ha senso calcolare "cosa ti manca" per una ricetta senza materiali
 * associati (spec Step 11Q).
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/meloproduco/cosa-hai-in-casa`;
const description = "Seleziona i materiali che hai in casa e scopri quali preparazioni MeLoProduco puoi realizzare subito, senza dover comprare altro.";

export const metadata: Metadata = {
  title: "Cosa hai già in casa?",
  description,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Cosa hai già in casa? · MeLoProduco",
    description,
    url: CANONICAL_URL,
    type: "website",
  },
};

// BUG FIX (Fase 11, audit end-to-end unpublish — secondo layer del bug):
// vedi commento esteso in app/ricette/[slug]/page.tsx.
export const revalidate = 30;

export default async function CosaHaiInCasaPage() {
  const recipes = await safeLoadMatchableRecipes();

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>MeLoProduco</Eyebrow>
      <h1 className="text-hero-display mt-3 max-w-2xl text-[var(--color-foreground)]">Cosa hai già in casa?</h1>
      <p className="text-lead mt-5 max-w-xl text-[var(--color-foreground-muted)]">
        Seleziona quello che hai a disposizione e scopri cosa puoi realizzare.
      </p>

      <div className="mt-12">
        {recipes === null ? (
          <>
            <EmptyState
              title="Questo strumento non è disponibile in questo momento."
              description="Riprova tra qualche minuto, oppure esplora l'archivio ricette."
            />
            <div className="mt-6">
              <LinkButton href="/ricette" variant="secondary">
                Esplora le ricette
              </LinkButton>
            </div>
          </>
        ) : recipes.length === 0 ? (
          <>
            <EmptyState
              title="Non ci sono ancora ricette abbinabili ai materiali che hai in casa."
              description="I materiali di ogni ricetta vengono assegnati dal nostro team: questo spazio si popolerà presto."
            />
            <div className="mt-6">
              <LinkButton href="/ricette" variant="secondary">
                Esplora tutte le ricette
              </LinkButton>
            </div>
          </>
        ) : (
          <MaterialPicker recipes={recipes} materials={extractMaterialOptions(recipes)} />
        )}
      </div>
    </Container>
  );
}

async function safeLoadMatchableRecipes() {
  try {
    const all = await listAllPublicRecipes();
    // Solo ricette con almeno un materiale associato (Step 11Q): senza
    // materiali il concetto stesso di "cosa posso fare con quello che ho"
    // non si applica.
    return all.filter((r) => r.discovery.materials.length > 0);
  } catch {
    return null; // null = API irraggiungibile/malformata, distinto da [] = nessuna ricetta matchabile
  }
}

function extractMaterialOptions(recipes: Awaited<ReturnType<typeof safeLoadMatchableRecipes>>) {
  if (!recipes) return [];
  const map = new Map<string, string>();
  for (const recipe of recipes) {
    for (const material of recipe.discovery.materials) {
      map.set(material.slug, material.name);
    }
  }
  return Array.from(map.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "it"));
}
