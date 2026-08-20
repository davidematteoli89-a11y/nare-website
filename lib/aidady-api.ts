import "server-only";

/**
 * Client minimale per le API PUBBLICHE di aiDady (Step 1L).
 *
 * Vincoli assoluti:
 * - NESSUNA credenziale Supabase (né anon key né service key) è usata qui.
 * - NESSUN accesso a tabelle private: solo fetch HTTP verso gli endpoint
 *   pubblici già esposti da aiDady sotto /api/public/[orgSlug]/...
 * - Nessun endpoint viene inventato: gli endpoint qui sotto rispecchiano
 *   esattamente ciò che esiste in aiDady al momento della Fase 1 —
 *   GET /api/public/[orgSlug]/recipes (lista) e
 *   GET /api/public/[orgSlug]/recipes/[slug] (dettaglio), vedi
 *   app/api/public/[orgSlug]/recipes/route.ts e .../[slug]/route.ts nel
 *   repository aiDady. Anche se l'endpoint lista esiste già, l'archivio
 *   /ricette resta un placeholder statico in questa fase (Step 1B/1I):
 *   il collegamento reale dei dati è demandato alla Fase 2, per non
 *   anticipare qui contenuti/logica di presentazione dell'archivio.
 */

const DEFAULT_BASE_URL = "https://aidady-business-os.vercel.app";
const ORG_SLUG = "meloproduco";

function getBaseUrl(): string {
  return process.env.AIDADY_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

// Forma esatta del DTO pubblico, rispecchiata da
// lib/services/public-dto.ts → publicRecipePayload() nel repository aiDady.
// Qualunque campo NON elencato qui (test_notes, approval_notes, valutazioni
// Prudence interne, audit trail, costi, stato workflow interno) non è mai
// presente nella risposta pubblica: non va aggiunto a questo tipo "a scopo
// di comodo", perché significherebbe assumere un campo che l'API non dà.
export interface PublicRecipePayload {
  slug: string;
  title: string;
  excerpt: string | null;
  objective: string | null;
  yield_text: string | null;
  usage_instructions: string | null;
  ingredients: Array<{
    name: string;
    quantity: number | null;
    unit: string | null;
    preparation_note: string | null;
    order_index: number;
  }>;
  steps: Array<{
    step_number: number;
    title: string | null;
    instruction: string;
    duration_minutes: number | null;
  }>;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_path: string | null;
  published_at: string | null;
}

/**
 * Recupera lo snapshot pubblico di una Recipe pubblicata.
 * Ritorna null se non trovata/non pubblicata (404) invece di lanciare,
 * così le pagine possono usare `notFound()` in modo pulito.
 */
export async function getPublicRecipe(slug: string): Promise<PublicRecipePayload | null> {
  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/recipes/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    // Contenuto pubblico, cache Next standard con revalidazione periodica.
    next: { revalidate: 300 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`aiDady public API error (${res.status}) fetching recipe "${slug}"`);
  }

  return (await res.json()) as PublicRecipePayload;
}

export interface PublicRecipeListResponse {
  items: PublicRecipePayload[];
  limit: number;
  offset: number;
}

/**
 * Recupera la lista di Recipe pubblicate. Predisposta per la Fase 2
 * (archivio /ricette reale): non ancora chiamata da nessuna pagina in
 * questa fase, ma la funzione esiste già tipizzata per evitare di doverla
 * indovinare più avanti.
 */
export async function listPublicRecipes(params: { limit?: number; offset?: number } = {}): Promise<PublicRecipeListResponse> {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.offset) search.set("offset", String(params.offset));

  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/recipes${search.size ? `?${search}` : ""}`;
  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error(`aiDady public API error (${res.status}) listing recipes`);
  }

  return (await res.json()) as PublicRecipeListResponse;
}
