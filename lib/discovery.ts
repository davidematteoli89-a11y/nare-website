import type { PublicRecipePayload, RecipeCostLevel, RecipeDifficulty, RecipeSeason } from "./aidady-api";

// NOTA: niente "server-only" qui (a differenza di aidady-api.ts) perché
// queste funzioni sono pure utility (etichette, matching, ricerca) usate
// sia da Server Component (es. calcolo iniziale) sia da Client Component
// (filtri interattivi, ricerca live) — nessun fetch/segreto qui dentro.

/**
 * Helper condivisi per il sistema di discovery MeLoProduco (Fase 11, Step
 * 11O-11X). Etichette italiane per gli enum del blocco `discovery`, logica
 * di matching "Cosa hai in casa", e util di ordinamento/formattazione
 * usate da più pagine — centralizzate qui per non duplicare la stessa
 * traduzione enum→label in ogni file.
 */

export const DIFFICULTY_LABELS: Record<RecipeDifficulty, string> = {
  facile: "Facile",
  media: "Media",
  avanzata: "Avanzata",
};

export const COST_LABELS: Record<RecipeCostLevel, string> = {
  basso: "Costo basso",
  medio: "Costo medio",
  alto: "Costo alto",
};

export const SEASON_LABELS: Record<RecipeSeason, string> = {
  tutto_l_anno: "Tutto l'anno",
  primavera: "Primavera",
  estate: "Estate",
  autunno: "Autunno",
  inverno: "Inverno",
  festivita: "Festività",
};

/** Need editoriali fissi (Step 11O) — slug reali seedati lato backend, non inventati qui. Usati per i grandi accessi "Cosa vuoi fare oggi?" indipendentemente da cosa risulta oggi popolato nei dati (per restare editoriali anche a dataset vuoto). */
export const FEATURED_NEEDS: { slug: string; label: string }[] = [
  { slug: "pulire", label: "Pulire" },
  { slug: "creare", label: "Creare" },
  { slug: "cucinare", label: "Cucinare" },
  { slug: "profumare", label: "Profumare" },
  { slug: "recuperare", label: "Recuperare" },
  { slug: "imparare", label: "Imparare" },
  { slug: "fare-con-bambini", label: "Fare con i bambini" },
];

/** Range di tempo per lo step progressivo "Quanto tempo hai?" (Step 11S). L'API non ha un filtro "range" su time_minutes (solo l'attributo esatto nel payload), quindi questo range si applica client-side dopo il fetch. Logica scelta: ogni fascia include anche le ricette con time_minutes non specificato (null) SOLO nella fascia "meno di 15" sarebbe fuorviante — si è scelto invece di NON includere mai i null in un filtro tempo attivo, perché "non sappiamo quanto ci vuole" non equivale a "ci vuole poco". Se l'utente non seleziona alcun range, tutte le ricette (incluse quelle senza tempo) restano visibili. */
export type TimeRange = "under15" | "15to30" | "30to60" | "over60";

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  under15: "Meno di 15 minuti",
  "15to30": "15-30 minuti",
  "30to60": "30-60 minuti",
  over60: "Più di 60 minuti",
};

export function matchesTimeRange(timeMinutes: number | null, range: TimeRange | null): boolean {
  if (!range) return true;
  if (timeMinutes == null) return false;
  switch (range) {
    case "under15":
      return timeMinutes <= 15;
    case "15to30":
      return timeMinutes > 15 && timeMinutes <= 30;
    case "30to60":
      return timeMinutes > 30 && timeMinutes <= 60;
    case "over60":
      return timeMinutes > 60;
  }
}

/* ------------------------------------------------------------------ */
/* MATCHING "COSA HAI IN CASA" — Step 11Q/11R, deterministico, NO AI   */
/* ------------------------------------------------------------------ */

export interface HomeMatchResult {
  recipe: PublicRecipePayload;
  matched: string[];
  missing: string[];
  coverage: number;
  ready: boolean;
}

const DIFFICULTY_RANK: Record<RecipeDifficulty, number> = { facile: 0, media: 1, avanzata: 2 };

/**
 * Calcola il matching deterministico tra i materiali selezionati
 * dall'utente e i materiali richiesti da ogni ricetta, poi ordina i
 * risultati secondo la priorità definita nello spec Step 11R:
 * 1. missing.length === 0 (realizzabile subito)
 * 2. missing.length === 1
 * 3. per coverage decrescente
 * 4. a parità: difficulty facile < media < avanzata (null per ultimo), poi
 *    time_minutes crescente (null per ultimo)
 *
 * Ricette con discovery.materials vuoto sono escluse a monte da chi chiama
 * questa funzione (filtrare PRIMA di passare l'array qui, vedi
 * app/meloproduco/cosa-hai-in-casa/page.tsx).
 */
export function matchRecipesByMaterials(recipes: PublicRecipePayload[], selected: string[]): HomeMatchResult[] {
  const selectedSet = new Set(selected);

  const results: HomeMatchResult[] = recipes.map((recipe) => {
    const required = recipe.discovery.materials.filter((m) => m.required).map((m) => m.slug);
    const matched = required.filter((slug) => selectedSet.has(slug));
    const missing = required.filter((slug) => !selectedSet.has(slug));
    const coverage = required.length === 0 ? 0 : matched.length / required.length;
    return { recipe, matched, missing, coverage, ready: missing.length === 0 };
  });

  results.sort((a, b) => {
    const missingRankA = a.missing.length === 0 ? 0 : a.missing.length === 1 ? 1 : 2;
    const missingRankB = b.missing.length === 0 ? 0 : b.missing.length === 1 ? 1 : 2;
    if (missingRankA !== missingRankB) return missingRankA - missingRankB;

    if (missingRankA === 2 && a.coverage !== b.coverage) return b.coverage - a.coverage;

    const diffA = a.recipe.discovery.difficulty;
    const diffB = b.recipe.discovery.difficulty;
    const rankA = diffA ? DIFFICULTY_RANK[diffA] : 99;
    const rankB = diffB ? DIFFICULTY_RANK[diffB] : 99;
    if (rankA !== rankB) return rankA - rankB;

    const timeA = a.recipe.discovery.time_minutes;
    const timeB = b.recipe.discovery.time_minutes;
    if (timeA == null && timeB == null) return 0;
    if (timeA == null) return 1;
    if (timeB == null) return -1;
    return timeA - timeB;
  });

  return results;
}

/* ------------------------------------------------------------------ */
/* RICERCA — Step 11U, MVP client-side, niente LLM                     */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

/** Filtro di ricerca case-insensitive su title/excerpt/category/tags/materials — solo .includes(), nessuna ricerca elaborata o semantica (vietata in questa fase). */
export function searchRecipes(recipes: PublicRecipePayload[], query: string): PublicRecipePayload[] {
  const q = normalize(query);
  if (!q) return recipes;

  return recipes.filter((recipe) => {
    const haystacks: string[] = [
      recipe.title,
      recipe.excerpt ?? "",
      recipe.discovery.category?.name ?? "",
      ...recipe.discovery.tags.map((t) => t.name),
      ...recipe.discovery.materials.map((m) => m.name),
    ];
    return haystacks.some((h) => normalize(h).includes(q));
  });
}
