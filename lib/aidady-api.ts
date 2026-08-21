import "server-only";

/**
 * Client minimale per le API PUBBLICHE di aiDady (Step 1L, rafforzato in
 * Fase 3 — Step 3A/3B).
 *
 * Vincoli assoluti:
 * - NESSUNA credenziale Supabase (né anon key né service key) è usata qui.
 * - NESSUN accesso a tabelle private: solo fetch HTTP verso gli endpoint
 *   pubblici già esposti da aiDady sotto /api/public/[orgSlug]/...
 * - Nessun endpoint viene inventato: gli endpoint qui sotto rispecchiano
 *   esattamente ciò che esiste in aiDady — GET /api/public/[orgSlug]/recipes
 *   (lista) e GET /api/public/[orgSlug]/recipes/[slug] (dettaglio).
 *
 * Verifica Fase 3 (Step 3A), fatta leggendo il codice sorgente reale di
 * aiDady (non assunta):
 * - app/api/public/[orgSlug]/recipes/route.ts → GET, query params
 *   `limit` (1-50, default 20) e `offset` (>=0, default 0). Risposta:
 *   `{ items: PublicRecipePayload[], limit: number, offset: number }`.
 *   NESSUN campo `total`/`count`: non è possibile calcolare un numero di
 *   pagine reale, solo "ci sono altri risultati?" in base a items.length.
 * - app/api/public/[orgSlug]/recipes/[slug]/route.ts → GET singola Recipe,
 *   ritorna il payload direttamente (non wrappato). 404 uniforme sia se lo
 *   slug non esiste sia se esiste ma non è pubblicata — il pubblico non
 *   deve mai poter distinguere i due casi (vedi commento nel route stesso).
 * - lib/services/public-dto.ts → `PublicRecipePayload` è ESATTAMENTE la
 *   forma qui sotto: nessun campo category/tag/taxonomy, nessun campo
 *   difficulty/tempo/rating/autore. Non vanno quindi mostrati in UI.
 * - `og_image_path`: verificato in app/org/[slug]/publishing/actions.ts —
 *   il form di creazione publication lo imposta SEMPRE a `null` (non esiste
 *   oggi una UI per valorizzarlo). Nella pratica è quindi sempre `null` per
 *   ogni Recipe pubblicata oggi. Il codice qui sotto non assume comunque che
 *   resti sempre null in futuro: se un giorno valesse qualcosa, va comunque
 *   validato come URL assoluto prima di essere passato a next/image (Step
 *   3H/3I) — path storage o valori non-URL vanno trattati come "non
 *   utilizzabile" e si ricade sul placeholder locale.
 */

const DEFAULT_BASE_URL = "https://aidady-business-os.vercel.app";
const ORG_SLUG = "meloproduco";
const RECIPES_REVALIDATE_SECONDS = 300; // stesso valore già usato in Home (Fase 2)
const WORKSHOPS_REVALIDATE_SECONDS = 300; // stesso valore delle Recipe, nessuna ragione per differenziare

function getBaseUrl(): string {
  return process.env.AIDADY_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export interface PublicRecipeIngredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  preparation_note: string | null;
  order_index: number;
}

export interface PublicRecipeStep {
  step_number: number;
  title: string | null;
  instruction: string;
  duration_minutes: number | null;
}

// Forma esatta del DTO pubblico, rispecchiata da
// lib/services/public-dto.ts → publicDtoService.toPublicRecipePayload() nel
// repository aiDady (riverificato in Fase 3, Step 3A). Qualunque campo NON
// elencato qui (test_notes, approval_notes, valutazioni Prudence interne,
// audit trail, costi, stato workflow interno, category/tag) non è mai
// presente nella risposta pubblica: non va aggiunto a questo tipo "a scopo
// di comodo", perché significherebbe assumere un campo che l'API non dà.
export interface PublicRecipePayload {
  slug: string;
  title: string;
  excerpt: string | null;
  objective: string | null;
  yield_text: string | null;
  usage_instructions: string | null;
  ingredients: PublicRecipeIngredient[];
  steps: PublicRecipeStep[];
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_path: string | null;
  published_at: string | null;
}

export interface PublicRecipeListResponse {
  items: PublicRecipePayload[];
  limit: number;
  offset: number;
}

/** Errore esplicito per "API raggiunta ma risposta non nella forma attesa". */
export class MalformedResponseError extends Error {
  constructor(context: string) {
    super(`aiDady public API: risposta malformata (${context})`);
    this.name = "MalformedResponseError";
  }
}

/**
 * Errore esplicito per "fetch fallito o API non raggiungibile" (rete giù,
 * timeout, 5xx). Distinto sia da un vero 404 (risorsa non trovata) sia da
 * MalformedResponseError, così le pagine possono mostrare un messaggio
 * editoriale coerente ("contenuto non disponibile ora") invece di far
 * passare un errore infrastrutturale per un 404 (Step 3P).
 */
export class ApiUnavailableError extends Error {
  constructor(context: string, options?: { cause?: unknown }) {
    super(`aiDady public API non raggiungibile (${context})`);
    this.name = "ApiUnavailableError";
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validazione runtime leggera — non un validatore esaustivo, solo una guardia contro risposte palesemente malformate. */
function isPublicRecipePayload(value: unknown): value is PublicRecipePayload {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    Array.isArray(value.ingredients) &&
    Array.isArray(value.steps)
  );
}

function isPublicRecipeListResponse(value: unknown): value is PublicRecipeListResponse {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.items)) return false;
  return value.items.every(isPublicRecipePayload);
}

/**
 * Recupera lo snapshot pubblico di una Recipe pubblicata.
 *
 * - Ritorna `null` se non trovata/non pubblicata (404 reale dall'API) —
 *   così le pagine possono usare `notFound()` in modo pulito (Step 3O).
 * - Lancia `ApiUnavailableError` se il fetch fallisce o l'API risponde con
 *   uno stato di errore non-404 — le pagine devono distinguerlo da un vero
 *   404 e mostrare un messaggio "non disponibile ora" invece (Step 3P).
 * - Lancia `MalformedResponseError` se l'API risponde 200 ma con una forma
 *   inattesa (contratto rotto lato aiDady).
 */
export async function getPublicRecipe(slug: string): Promise<PublicRecipePayload | null> {
  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/recipes/${encodeURIComponent(slug)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      // Contenuto pubblico, cache Next standard con revalidazione periodica.
      next: { revalidate: RECIPES_REVALIDATE_SECONDS },
    });
  } catch (err) {
    throw new ApiUnavailableError(`fetch recipe "${slug}"`, { cause: err });
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiUnavailableError(`recipe "${slug}" → HTTP ${res.status}`);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new MalformedResponseError(`recipe "${slug}" → risposta non-JSON`);
  }

  if (!isPublicRecipePayload(json)) {
    throw new MalformedResponseError(`recipe "${slug}" → shape inattesa`);
  }

  return json;
}

/**
 * Recupera la lista di Recipe pubblicate.
 *
 * Lancia `ApiUnavailableError` se il fetch fallisce o l'API risponde con
 * uno stato di errore (nessun caso 404 previsto per la lista). Lancia
 * `MalformedResponseError` se la forma della risposta non è quella attesa.
 * Le pagine chiamanti sono responsabili di catturare questi errori e
 * mostrare un fallback editoriale (mai propagare un errore tecnico in UI).
 */
export async function listPublicRecipes(params: { limit?: number; offset?: number } = {}): Promise<PublicRecipeListResponse> {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.offset) search.set("offset", String(params.offset));

  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/recipes${search.size ? `?${search}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: RECIPES_REVALIDATE_SECONDS } });
  } catch (err) {
    throw new ApiUnavailableError("list recipes", { cause: err });
  }

  if (!res.ok) {
    throw new ApiUnavailableError(`list recipes → HTTP ${res.status}`);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new MalformedResponseError("list recipes → risposta non-JSON");
  }

  if (!isPublicRecipeListResponse(json)) {
    throw new MalformedResponseError("list recipes → shape inattesa");
  }

  return json;
}

/**
 * Valida che `og_image_path` sia effettivamente un URL assoluto http/https
 * utilizzabile da next/image. Oggi è sempre `null` (vedi commento in testa
 * al file), ma questa funzione è la guardia esplicita da usare ovunque il
 * campo venga letto, per non assumere mai che sia già un URL valido
 * (Step 3H/3I — nessun proxy, nessuno storage privato, nessuna assunzione).
 */
export function resolvePublicImageUrl(ogImagePath: string | null): string | null {
  if (!ogImagePath) return null;
  try {
    const parsed = new URL(ogImagePath);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Client per le API pubbliche Workshop di aiDady (Fase 5 — Step 5A/5B).
 * Sul sito pubblico Narè, l'entità "Workshop" viene presentata come
 * "Narè Incontri" — SOLO un rename di presentazione: backend/API/route
 * restano "workshop" ovunque, come da vincolo esplicito della Fase 5.
 *
 * Verifica Step 5A, fatta leggendo il codice sorgente reale (non assunta):
 * - aidady-public-api: app/api/public/[orgSlug]/workshops/route.ts → GET,
 *   stessi query param limit/offset delle recipes, stessa forma di risposta
 *   `{ items: PublicWorkshopPayload[], limit, offset }`, nessun `total`.
 * - .../workshops/[slug]/route.ts → GET singolo, 404 uniforme se non
 *   trovato o non pubblicato (mai distinguibile dal pubblico).
 * - aidady-business-os: lib/services/public-dto.ts →
 *   `publicDtoService.toPublicWorkshopPayload()` è ESATTAMENTE la forma
 *   sotto. Verificato IMPORTANTE: nessun campo `location`/`luogo`, nessun
 *   campo immagine dedicato al workshop (solo `og_image_path`, usato solo
 *   per SEO/social — stesso status di sempre-`null` oggi delle Recipe),
 *   nessun `registration_url`/`external_url`/`contact_url`. `upcoming_sessions`
 *   contiene solo sessioni future non cancellate/non completate (il filtro
 *   "upcoming" è già applicato server-side da aiDady, non va rifatto qui).
 * - Testato in produzione (21/08/2026): endpoint raggiungibile, 200 OK,
 *   `{"items":[],"limit":20,"offset":0}` — oggi 0 Workshop pubblicati,
 *   stato confermato, non un errore.
 */
export interface PublicWorkshopSession {
  start_at: string | null;
  end_at: string | null;
  capacity: number | null;
  price_per_person: number | null;
}

// Forma esatta del DTO pubblico Workshop (lib/services/public-dto.ts →
// PublicWorkshopPayload in aiDady, riverificata Step 5A). Nessun campo NON
// elencato qui va assunto o mostrato in UI.
export interface PublicWorkshopPayload {
  slug: string;
  title: string;
  excerpt: string | null;
  description: string;
  upcoming_sessions: PublicWorkshopSession[];
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_path: string | null;
  published_at: string | null;
}

export interface PublicWorkshopListResponse {
  items: PublicWorkshopPayload[];
  limit: number;
  offset: number;
}

function isPublicWorkshopSession(value: unknown): value is PublicWorkshopSession {
  if (!isPlainObject(value)) return false;
  return "start_at" in value && "end_at" in value && "capacity" in value && "price_per_person" in value;
}

function isPublicWorkshopPayload(value: unknown): value is PublicWorkshopPayload {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    Array.isArray(value.upcoming_sessions) &&
    value.upcoming_sessions.every(isPublicWorkshopSession)
  );
}

function isPublicWorkshopListResponse(value: unknown): value is PublicWorkshopListResponse {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.items)) return false;
  return value.items.every(isPublicWorkshopPayload);
}

/**
 * Recupera lo snapshot pubblico di un Workshop ("Narè Incontri") pubblicato.
 * Stessa semantica di getPublicRecipe: null se non trovato/non pubblicato
 * (404 reale), ApiUnavailableError per fetch falliti/errori HTTP non-404,
 * MalformedResponseError per risposte 200 con forma inattesa.
 */
export async function getPublicWorkshop(slug: string): Promise<PublicWorkshopPayload | null> {
  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/workshops/${encodeURIComponent(slug)}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: WORKSHOPS_REVALIDATE_SECONDS } });
  } catch (err) {
    throw new ApiUnavailableError(`fetch workshop "${slug}"`, { cause: err });
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiUnavailableError(`workshop "${slug}" → HTTP ${res.status}`);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new MalformedResponseError(`workshop "${slug}" → risposta non-JSON`);
  }

  if (!isPublicWorkshopPayload(json)) {
    throw new MalformedResponseError(`workshop "${slug}" → shape inattesa`);
  }

  return json;
}

/**
 * Recupera la lista di Workshop pubblicati ("Narè Incontri"). Stessa
 * semantica di listPublicRecipes: ApiUnavailableError per fetch
 * falliti/errori HTTP, MalformedResponseError per shape inattesa. Le
 * pagine chiamanti gestiscono il fallback editoriale, mai un errore
 * tecnico in UI.
 */
export async function listPublicWorkshops(params: { limit?: number; offset?: number } = {}): Promise<PublicWorkshopListResponse> {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.offset) search.set("offset", String(params.offset));

  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/workshops${search.size ? `?${search}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: WORKSHOPS_REVALIDATE_SECONDS } });
  } catch (err) {
    throw new ApiUnavailableError("list workshops", { cause: err });
  }

  if (!res.ok) {
    throw new ApiUnavailableError(`list workshops → HTTP ${res.status}`);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new MalformedResponseError("list workshops → risposta non-JSON");
  }

  if (!isPublicWorkshopListResponse(json)) {
    throw new MalformedResponseError("list workshops → shape inattesa");
  }

  return json;
}
