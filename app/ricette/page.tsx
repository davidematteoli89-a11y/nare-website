import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { EditorialCard } from "@/components/EditorialCard";
import { RecipeFilters } from "@/components/discovery/RecipeFilters";
import {
  listPublicRecipes,
  listAllPublicRecipes,
  extractAvailableFilters,
  resolvePublicImageUrl,
  type PublicRecipePayload,
  type RecipeDiscoveryFilters,
} from "@/lib/aidady-api";

/**
 * Archivio /ricette definitivo — Fase 3 (Step 3D/3E) + Fase 11 (Step 11T:
 * filtri discovery reali).
 *
 * Filtri (Step 11T): categoria/bisogno/ambiente/materiale/difficoltà/
 * costo/stagione sono ora tutti applicabili, passati come query param
 * all'endpoint list (whitelisted server-side dalla Public API, Step 11L).
 * Le opzioni disponibili sono derivate dinamicamente da TUTTE le ricette
 * pubblicate (extractAvailableFilters), non hardcodate — così non si
 * mostrano mai filtri per categorie senza contenuti.
 *
 * SEO (Step 11Y): il canonical resta SEMPRE `/ricette` pulito, anche con
 * filtri/pagina attivi in query string — le combinazioni filtro non devono
 * generare canonical distinti (rischio indicizzazione di combinazioni
 * infinite).
 *
 * Pagination (Step 3D): l'endpoint list non restituisce un totale
 * (`{ items, limit, offset }` soltanto), quindi non si può calcolare un
 * numero di pagine reale. Si usa "Precedenti/Successive" con un'euristica
 * onesta: "Successive" compare solo se sono arrivati esattamente `limit`
 * elementi (segno che potrebbero essercene altri).
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/ricette`;
const description = "L'archivio delle ricette e autoproduzioni MeLoProduco: casa, preparazioni, botanica, testate prima di essere condivise.";

export const metadata: Metadata = {
  title: "Ricette & Autoproduzione",
  description,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Ricette & Autoproduzione",
    description,
    url: CANONICAL_URL,
    type: "website",
  },
};

const PAGE_SIZE = 12;

type RicetteSearchParams = {
  pagina?: string;
  category?: string;
  need?: string;
  environment?: string;
  context?: string;
  material?: string;
  difficulty?: string;
  cost?: string;
  season?: string;
};

export default async function RicettePage({ searchParams }: { searchParams: Promise<RicetteSearchParams> }) {
  const params = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(params.pagina ?? "1", 10) || 1);
  const offset = (pageNumber - 1) * PAGE_SIZE;
  const activeFilters = toDiscoveryFilters(params);
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const [result, allFilters] = await Promise.all([safeListRecipes(offset, activeFilters), safeExtractFilters()]);

  return (
    <Container className="py-16 sm:py-20">
      {/* as="h1" (Fase 9 post-deploy QA): questa è l'unica intestazione
          della pagina, deve essere un H1 semantico reale. */}
      <SectionHeader
        as="h1"
        eyebrow="MeLoProduco"
        title="Ricette & Autoproduzione"
        description="L'archivio delle ricette e preparazioni MeLoProduco: pratiche quotidiane studiate con criterio e testate prima di essere condivise."
      />

      {allFilters && (
        <Suspense fallback={null}>
          <RecipeFilters filters={allFilters} />
        </Suspense>
      )}

      <div className="mt-4">
        {result === null ? (
          <EmptyState
            title="L'archivio non è disponibile in questo momento."
            description="Riprova tra qualche minuto, oppure torna a MeLoProduco."
          />
        ) : result.items.length === 0 && pageNumber === 1 && hasActiveFilters ? (
          <EmptyState
            title="Non abbiamo ancora trovato qualcosa che corrisponda esattamente."
            description="Prova a rimuovere un filtro, oppure esplora tutte le preparazioni MeLoProduco."
          />
        ) : result.items.length === 0 && pageNumber === 1 ? (
          <EmptyState
            title="Le prime ricette MeLoProduco stanno arrivando."
            description="Questo archivio si popolerà con le prossime pubblicazioni."
          />
        ) : result.items.length === 0 ? (
          <EmptyState title="Non ci sono altre ricette da mostrare." description="Torna alla pagina precedente per continuare a esplorare l'archivio." />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>

            <Pagination pageNumber={pageNumber} hasNext={result.items.length === PAGE_SIZE} searchParams={params} />
          </>
        )}
      </div>
    </Container>
  );
}

function toDiscoveryFilters(params: RicetteSearchParams): RecipeDiscoveryFilters {
  const filters: RecipeDiscoveryFilters = {};
  if (params.category) filters.category = params.category;
  if (params.need) filters.need = params.need;
  if (params.environment) filters.environment = params.environment;
  if (params.context) filters.context = params.context;
  if (params.material) filters.material = params.material;
  if (isValidDifficulty(params.difficulty)) filters.difficulty = params.difficulty;
  if (isValidCost(params.cost)) filters.cost = params.cost;
  if (isValidSeason(params.season)) filters.season = params.season;
  return filters;
}

function isValidDifficulty(v: string | undefined): v is "facile" | "media" | "avanzata" {
  return v === "facile" || v === "media" || v === "avanzata";
}
function isValidCost(v: string | undefined): v is "basso" | "medio" | "alto" {
  return v === "basso" || v === "medio" || v === "alto";
}
function isValidSeason(v: string | undefined): v is "tutto_l_anno" | "primavera" | "estate" | "autunno" | "inverno" | "festivita" {
  return v === "tutto_l_anno" || v === "primavera" || v === "estate" || v === "autunno" || v === "inverno" || v === "festivita";
}

async function safeListRecipes(offset: number, filters: RecipeDiscoveryFilters) {
  try {
    return await listPublicRecipes({ limit: PAGE_SIZE, offset, ...filters });
  } catch {
    return null; // null = API irraggiungibile/malformata
  }
}

/** Opzioni filtro derivate da TUTTE le ricette pubblicate (Step 11T), indipendenti dai filtri correnti — se sparissero le opzioni non selezionate sarebbe confuso. Se il fetch fallisce, i filtri semplicemente non compaiono (degradazione elegante, l'archivio resta comunque usabile). */
async function safeExtractFilters() {
  try {
    const all = await listAllPublicRecipes();
    return extractAvailableFilters(all);
  } catch {
    return null;
  }
}

function RecipeCard({ recipe }: { recipe: PublicRecipePayload }) {
  return (
    <EditorialCard
      href={`/ricette/${recipe.slug}`}
      title={recipe.title}
      excerpt={recipe.excerpt ?? undefined}
      imageSrc={resolvePublicImageUrl(recipe.og_image_path) ?? "/images/placeholders/editorial-generic.png"}
      imageAlt={recipe.title}
    />
  );
}

function Pagination({
  pageNumber,
  hasNext,
  searchParams,
}: {
  pageNumber: number;
  hasNext: boolean;
  searchParams: RicetteSearchParams;
}) {
  const hasPrev = pageNumber > 1;
  if (!hasPrev && !hasNext) return null;

  // Preserva i filtri attivi (Step 11T) quando si cambia pagina: solo
  // `pagina` cambia, il resto della query string resta intatto.
  function buildHref(targetPage: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== "pagina" && value) params.set(key, value);
    }
    if (targetPage > 1) params.set("pagina", String(targetPage));
    return `/ricette${params.size ? `?${params}` : ""}`;
  }

  return (
    <nav aria-label="Navigazione archivio ricette" className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
      {hasPrev ? (
        <Link href={buildHref(pageNumber - 1)} className="text-small font-medium text-[var(--color-accent-text)] hover:underline">
          ← Precedenti
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {hasNext ? (
        <Link href={buildHref(pageNumber + 1)} className="text-small font-medium text-[var(--color-accent-text)] hover:underline">
          Successive →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
