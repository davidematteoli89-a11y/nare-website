import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { ExploraClient } from "@/components/discovery/ExploraClient";
import { listAllPublicRecipes, extractAvailableFilters, type PublicRecipePayload, type AvailableFilters } from "@/lib/aidady-api";

// BUG FIX (Fase 11, audit end-to-end unpublish — difesa in profondità):
// vedi commento in app/ricette/page.tsx e commento esteso in
// app/ricette/[slug]/page.tsx.
export const revalidate = 30;

/**
 * /meloproduco/esplora — Step 11S.
 *
 * SEO (Step 11Y): il canonical resta SEMPRE `/meloproduco/esplora` pulito,
 * anche con query param attivi (?need=pulire&environment=cucina&...) — le
 * combinazioni di filtro non devono generare canonical distinti, altrimenti
 * si rischia l'indicizzazione di combinazioni infinite.
 *
 * Filtri server-side (Step 11S): need/environment/difficulty sono
 * filtrabili direttamente dalla Public API (query string), quindi vengono
 * passati a listAllPublicRecipes qui. Il range di tempo NON è supportato
 * server-side (solo il valore esatto time_minutes è nel payload) e viene
 * filtrato client-side in ExploraClient.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/meloproduco/esplora`;
const description = "Racconta cosa vuoi fare, dove e quanto tempo hai: trova subito le preparazioni MeLoProduco più adatte a te.";

export const metadata: Metadata = {
  title: "Esplora MeLoProduco",
  description,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Esplora MeLoProduco",
    description,
    url: CANONICAL_URL,
    type: "website",
  },
};

export default async function EsploraPage({
  searchParams,
}: {
  searchParams: Promise<{ need?: string; environment?: string; difficulty?: string }>;
}) {
  const params = await searchParams;
  const { recipes, allFilters } = await safeLoadDiscoveryData(params);

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>MeLoProduco</Eyebrow>
      <h1 className="text-hero-display mt-3 max-w-2xl text-[var(--color-foreground)]">Cosa vuoi fare oggi?</h1>
      <p className="text-lead mt-5 max-w-xl text-[var(--color-foreground-muted)]">
        Rispondi a qualche domanda, senza fretta: ogni scelta è facoltativa e i risultati si aggiornano subito.
      </p>

      <div className="mt-12">
        {recipes === null ? (
          <EmptyState
            title="Questo strumento non è disponibile in questo momento."
            description="Riprova tra qualche minuto, oppure esplora l'archivio ricette."
          />
        ) : allFilters.needs.length === 0 && allFilters.environments.length === 0 && allFilters.difficulties.length === 0 ? (
          <EmptyState
            title="La ricerca guidata arriverà presto."
            description="Stiamo organizzando le ricette per bisogno, ambiente e difficoltà: nel frattempo puoi esplorare l'archivio completo."
          />
        ) : (
          <Suspense fallback={null}>
            <ExploraClient recipes={recipes} filters={allFilters} />
          </Suspense>
        )}
      </div>
    </Container>
  );
}

async function safeLoadDiscoveryData(
  params: { need?: string; environment?: string; difficulty?: string }
): Promise<{ recipes: PublicRecipePayload[] | null; allFilters: AvailableFilters }> {
  try {
    // Fetch 1: tutte le ricette (senza filtri) per calcolare le opzioni di
    // filtro disponibili — sempre complete, non ristrette dalla selezione
    // corrente, altrimenti dopo il primo filtro le altre opzioni
    // sparirebbero (esperienza confusa).
    const all = await listAllPublicRecipes();
    const allFilters = extractAvailableFilters(all);

    // Fetch 2: ricette filtrate server-side secondo i param validi ricevuti
    // (need/environment/difficulty). Next.js dedupe automaticamente se i
    // param coincidono con una richiesta già in cache nel periodo di
    // revalidate.
    const difficulty = isValidDifficulty(params.difficulty) ? params.difficulty : undefined;
    const filtered = params.need || params.environment || difficulty
      ? await listAllPublicRecipes({ need: params.need, environment: params.environment, difficulty })
      : all;

    return { recipes: filtered, allFilters };
  } catch {
    return { recipes: null, allFilters: { categories: [], needs: [], environments: [], contexts: [], materials: [], paths: [], difficulties: [], costLevels: [], seasons: [] } };
  }
}

function isValidDifficulty(value: string | undefined): value is "facile" | "media" | "avanzata" {
  return value === "facile" || value === "media" || value === "avanzata";
}
