import "server-only";
export { resolvePublicImageUrl } from "@/lib/public-image";

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
// BUG FIX #2 (Fase 11, audit end-to-end unpublish, 21-22 ago 2026): il
// tentativo precedente (revalidate: 30, vedi storia sotto) si è rivelato
// insufficiente. Causa reale isolata leggendo i build log Vercel: ogni
// deploy mostra "Restored build cache from previous deployment", e la
// Next.js Data Cache dei fetch (quella governata da `next.revalidate`) fa
// parte di quel build cache — un'entry stale creata da un deploy precedente
// può quindi sopravvivere a un nuovo deploy anche con `revalidate` esplicito
// a livello di pagina, perché il suo orologio di scadenza non si resetta
// per il solo fatto di ridistribuire il codice. Verificato end-to-end su
// Brioche al Burro: unpublished da 15+ minuti nel DB aiDady, Public API già
// 404 fresco (x-vercel-cache: MISS), eppure /ricette/brioche-al-burro sul
// sito Narè continuava a servire il contenuto pubblicato, anche con
// `export const revalidate = 30` aggiunto alla pagina e un nuovo deploy
// completato.
//
// Fix: `cache: "no-store"` su ogni fetch verso l'API pubblica aiDady per
// Recipe e Workshop — nessuna Data Cache, ogni richiesta legge lo stato
// vero al momento esatto della richiesta. Il catalogo MeLoProduco è
// piccolo (poche decine di ricette/workshop) e il traffico del sito non è
// tale da giustificare il rischio di servire contenuti ritirati pur di
// risparmiare qualche fetch verso aiDady — la correttezza (specialmente per
// contenuti annullati/privacy-sensitive) ha priorità sulla cache qui.
//
// Storia: 300s iniziali (bug #1, contenuto annullato visibile fino a 5 min)
// → abbassati a 30s (mitigazione parziale, non risolutiva) → no-store
// (fix definitivo, bug #2).

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
// Blocco Discovery (Fase 11, Step 11L-11N) — nuovo campo `discovery` sul
// DTO pubblico Recipe. Compilato manualmente da un editor umano in
// backoffice: oggi (21/08/2026) probabilmente NESSUNA ricetta pubblicata ha
// ancora questi dati (categoria/tag/materiali/percorsi sono tutti opzionali
// lato backend). Un blocco vuoto (category: null, tags: [], materials: [],
// paths: [], difficulty: null, time_minutes: null, cost_level: null,
// season: null) è quindi uno stato NORMALE, non un errore — ogni pagina che
// legge questo campo deve gestirlo con eleganza (vedi extractAvailableFilters
// e le pagine discovery sotto app/meloproduco/).
export interface PublicDiscoveryTag {
  kind: "theme" | "need" | "environment" | "context";
  slug: string;
  name: string;
}

export interface PublicDiscoveryMaterial {
  slug: string;
  name: string;
  required: boolean;
}

export interface PublicDiscoveryPath {
  slug: string;
  title: string;
}

export type RecipeDifficulty = "facile" | "media" | "avanzata";
export type RecipeCostLevel = "basso" | "medio" | "alto";
export type RecipeSeason = "tutto_l_anno" | "primavera" | "estate" | "autunno" | "inverno" | "festivita";

export interface PublicDiscoveryBlock {
  category: { slug: string; name: string } | null;
  tags: PublicDiscoveryTag[];
  materials: PublicDiscoveryMaterial[];
  paths: PublicDiscoveryPath[];
  difficulty: RecipeDifficulty | null;
  time_minutes: number | null;
  cost_level: RecipeCostLevel | null;
  season: RecipeSeason | null;
}

/** Blocco discovery "vuoto" di default — usato per retrocompatibilità quando un payload (es. da cache stale) non include ancora `discovery`. */
const EMPTY_DISCOVERY: PublicDiscoveryBlock = {
  category: null,
  tags: [],
  materials: [],
  paths: [],
  difficulty: null,
  time_minutes: null,
  cost_level: null,
  season: null,
};

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
  discovery: PublicDiscoveryBlock;
  related_guides?: PublicRelatedContent[];
  cover_image: PublicGuideMedia | null;
  gallery: PublicGuideMedia[];
  media: PublicGuideMedia | null;
}

export interface PublicRelatedContent { slug: string; title: string; excerpt: string | null; og_image_path: string | null; }

export interface PublicGuideMedia {
  type: "image" | "video_upload" | "youtube" | "instagram_reel" | "external_video";
  provider: "supabase" | "youtube" | "instagram" | "external";
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
}

export interface PublicGuidePayload {
  slug: string; title: string; excerpt: string | null; body: string;
  seo_title: string | null; seo_description: string | null; canonical_url: string | null;
  og_image_path: string | null; published_at: string | null; content_type: "guide";
  area: { slug: string; name: string } | null; topic: { slug: string; name: string } | null;
  tags: string[]; related_recipes: PublicRelatedContent[]; related_guides: PublicRelatedContent[];
  cover_image: PublicGuideMedia | null; gallery: PublicGuideMedia[]; media: PublicGuideMedia | null;
}

export interface PublicGuideListResponse { items: PublicGuidePayload[]; limit: number; offset: number; }
export interface GuideFilters { area?: string; topic?: string; tag?: string; limit?: number; offset?: number; }

/** Filtri opzionali accettati da GET /api/public/[orgSlug]/recipes (Fase 11, Step 11L). Tutti gli slug sono whitelisted lato server (regex ^[a-z0-9-]+$); valori non validi tornano 400 — qui passiamo solo ciò che l'utente ha selezionato in UI, già negli enum/slug corretti. */
export interface RecipeDiscoveryFilters {
  category?: string;
  need?: string;
  environment?: string;
  context?: string;
  material?: string;
  path?: string;
  difficulty?: RecipeDifficulty;
  cost?: RecipeCostLevel;
  season?: RecipeSeason;
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

function isPublicGuide(value: unknown): value is PublicGuidePayload {
  return isPlainObject(value) && typeof value.slug === "string" && typeof value.title === "string" && typeof value.body === "string" && value.content_type === "guide" && Array.isArray(value.tags) && Array.isArray(value.related_recipes) && Array.isArray(value.related_guides)
    && (value.cover_image === undefined || value.cover_image === null || isPublicGuideMedia(value.cover_image))
    && (value.gallery === undefined || (Array.isArray(value.gallery) && value.gallery.every(isPublicGuideMedia)))
    && (value.media === undefined || value.media === null || isPublicGuideMedia(value.media));
}

function isPublicGuideMedia(value: unknown): value is PublicGuideMedia {
  if (!isPlainObject(value)) return false;
  return ["image", "video_upload", "youtube", "instagram_reel", "external_video"].includes(String(value.type))
    && ["supabase", "youtube", "instagram", "external"].includes(String(value.provider))
    && typeof value.url === "string";
}

function normalizePublicGuide(value: PublicGuidePayload): PublicGuidePayload {
  return { ...value, cover_image: value.cover_image ?? null, gallery: value.gallery ?? [], media: value.media ?? null };
}

export async function getPublicGuide(slug: string): Promise<PublicGuidePayload | null> {
  let response: Response;
  try { response = await fetch(`${getBaseUrl()}/api/public/${ORG_SLUG}/guides/${encodeURIComponent(slug)}`, { cache: "no-store" }); }
  catch (error) { throw new ApiUnavailableError(`fetch guide "${slug}"`, { cause: error }); }
  if (response.status === 404) return null;
  if (!response.ok) throw new ApiUnavailableError(`guide "${slug}" → HTTP ${response.status}`);
  const json: unknown = await response.json();
  if (!isPublicGuide(json)) throw new MalformedResponseError(`guide "${slug}" → shape inattesa`);
  return normalizePublicGuide(json);
}

export async function listPublicGuides(params: GuideFilters = {}): Promise<PublicGuideListResponse> {
  const search = new URLSearchParams();
  for (const key of ["area","topic","tag","limit","offset"] as const) if (params[key] !== undefined) search.set(key,String(params[key]));
  let response: Response;
  try { response = await fetch(`${getBaseUrl()}/api/public/${ORG_SLUG}/guides${search.size ? `?${search}` : ""}`, { cache: "no-store" }); }
  catch (error) { throw new ApiUnavailableError("list guides", { cause: error }); }
  if (!response.ok) throw new ApiUnavailableError(`list guides → HTTP ${response.status}`);
  const json: unknown = await response.json();
  if (!isPlainObject(json) || !Array.isArray(json.items) || !json.items.every(isPublicGuide)) throw new MalformedResponseError("list guides → shape inattesa");
  return { items: json.items.map(normalizePublicGuide), limit: typeof json.limit === "number" ? json.limit : 20, offset: typeof json.offset === "number" ? json.offset : 0 };
}

export async function listAllPublicGuides(): Promise<PublicGuidePayload[]> {
  const items: PublicGuidePayload[]=[]; for(let offset=0;offset<1000;offset+=50){const page=await listPublicGuides({limit:50,offset});items.push(...page.items);if(page.items.length<50)break;} return items;
}

/**
 * Validazione runtime leggera — non un validatore esaustivo, solo una
 * guardia contro risposte palesemente malformate.
 *
 * Nota retrocompatibilità (Fase 11, Step 11L): il campo `discovery` NON è
 * richiesto qui per considerare il payload valido — una risposta cache
 * stale precedente alla Fase 11 potrebbe non averlo ancora. `normalize...`
 * sotto applica poi un default vuoto, così il resto del codice può sempre
 * assumere che `discovery` esista.
 */
function isPublicRecipePayload(value: unknown): value is Omit<PublicRecipePayload, "discovery"> & { discovery?: unknown } {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    Array.isArray(value.ingredients) &&
    Array.isArray(value.steps) &&
    (value.cover_image === undefined || value.cover_image === null || isPublicGuideMedia(value.cover_image)) &&
    (value.gallery === undefined || (Array.isArray(value.gallery) && value.gallery.every(isPublicGuideMedia))) &&
    (value.media === undefined || value.media === null || isPublicGuideMedia(value.media))
  );
}

function isPublicDiscoveryBlock(value: unknown): value is PublicDiscoveryBlock {
  if (!isPlainObject(value)) return false;
  return Array.isArray(value.tags) && Array.isArray(value.materials) && Array.isArray(value.paths);
}

/** Applica il default `discovery` vuoto se il payload grezzo non lo include o è malformato — mai crashare per questo campo opzionale/aggiuntivo. */
function normalizeRecipePayload(raw: Omit<PublicRecipePayload, "discovery"> & { discovery?: unknown }): PublicRecipePayload {
  return {
    ...raw,
    discovery: isPublicDiscoveryBlock(raw.discovery) ? raw.discovery : EMPTY_DISCOVERY,
    cover_image: raw.cover_image ?? null,
    gallery: raw.gallery ?? [],
    media: raw.media ?? null,
  };
}

function isPublicRecipeListResponse(
  value: unknown
): value is { items: (Omit<PublicRecipePayload, "discovery"> & { discovery?: unknown })[]; limit: number; offset: number } {
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
      // no-store: vedi commento esteso in testa al file (fix bug #2).
      cache: "no-store",
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

  return normalizeRecipePayload(json);
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
export async function listPublicRecipes(
  params: { limit?: number; offset?: number } & RecipeDiscoveryFilters = {}
): Promise<PublicRecipeListResponse> {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.offset) search.set("offset", String(params.offset));
  if (params.category) search.set("category", params.category);
  if (params.need) search.set("need", params.need);
  if (params.environment) search.set("environment", params.environment);
  if (params.context) search.set("context", params.context);
  if (params.material) search.set("material", params.material);
  if (params.path) search.set("path", params.path);
  if (params.difficulty) search.set("difficulty", params.difficulty);
  if (params.cost) search.set("cost", params.cost);
  if (params.season) search.set("season", params.season);

  const url = `${getBaseUrl()}/api/public/${ORG_SLUG}/recipes${search.size ? `?${search}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
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

  return { ...json, items: json.items.map(normalizeRecipePayload) };
}

/**
 * Recupera TUTTE le Recipe pubblicate, non solo una pagina (Fase 11, Step
 * 11Q/11R/11U/11AA). Serve per: matching "Cosa hai in casa", ricerca
 * client-side, ed extractAvailableFilters. Pagina in blocchi di 50 (il
 * massimo consentito da limit, vedi commento di testa al file) finché
 * l'API non restituisce meno di 50 elementi.
 *
 * Assunzione di performance (Step 11AA), documentata invece di
 * over-ingegnerizzare: oggi il catalogo MeLoProduco è piccolo (poche decine
 * di ricette), quindi caricare tutto in memoria e fare matching/ricerca
 * client-side è accettabile. Next.js dedupe automaticamente le richieste
 * identiche entro la finestra di revalidate (30s), quindi più pagine che
 * chiamano questa funzione nello stesso ciclo di revalidate non generano
 * fetch multipli reali verso aiDady. Se il catalogo crescesse molto (centinaia
 * di ricette), questo approccio andrebbe rivisto con filtri sempre
 * server-side e niente fetch-all — fuori scope oggi.
 */
export async function listAllPublicRecipes(filters: RecipeDiscoveryFilters = {}): Promise<PublicRecipePayload[]> {
  const PAGE_SIZE = 50;
  const all: PublicRecipePayload[] = [];
  let offset = 0;

  for (;;) {
    const res = await listPublicRecipes({ ...filters, limit: PAGE_SIZE, offset });
    all.push(...res.items);
    if (res.items.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
    // Guardia di sicurezza: non superare 1000 ricette in un solo fetch-all,
    // per non generare loop infiniti se l'API rispondesse sempre con
    // esattamente PAGE_SIZE elementi per un bug lato server.
    if (offset >= 1000) break;
  }

  return all;
}

/**
 * Deriva dinamicamente le opzioni di filtro disponibili scansionando le
 * ricette effettivamente caricate (Fase 11, Step 11L/11S/11T) — la Public
 * API di aiDady non espone oggi un endpoint dedicato "lista tassonomia",
 * quindi le opzioni mostrate in UI vengono ricavate dai dati reali già
 * presenti, non hardcodate: se una categoria non ha ancora nessuna ricetta
 * assegnata, semplicemente non compare come filtro (niente filtri "morti").
 */
export interface AvailableFilters {
  categories: { slug: string; name: string }[];
  needs: { slug: string; name: string }[];
  environments: { slug: string; name: string }[];
  contexts: { slug: string; name: string }[];
  materials: { slug: string; name: string }[];
  paths: { slug: string; title: string }[];
  difficulties: RecipeDifficulty[];
  costLevels: RecipeCostLevel[];
  seasons: RecipeSeason[];
}

export function extractAvailableFilters(recipes: PublicRecipePayload[]): AvailableFilters {
  const categories = new Map<string, string>();
  const needs = new Map<string, string>();
  const environments = new Map<string, string>();
  const contexts = new Map<string, string>();
  const materials = new Map<string, string>();
  const paths = new Map<string, string>();
  const difficulties = new Set<RecipeDifficulty>();
  const costLevels = new Set<RecipeCostLevel>();
  const seasons = new Set<RecipeSeason>();

  for (const recipe of recipes) {
    const d = recipe.discovery;
    if (d.category) categories.set(d.category.slug, d.category.name);
    for (const tag of d.tags) {
      if (tag.kind === "need") needs.set(tag.slug, tag.name);
      else if (tag.kind === "environment") environments.set(tag.slug, tag.name);
      else if (tag.kind === "context") contexts.set(tag.slug, tag.name);
      // kind "theme" non ha un filtro dedicato in questa fase (nessuno slot nello spec 11S/11T).
    }
    for (const material of d.materials) materials.set(material.slug, material.name);
    for (const path of d.paths) paths.set(path.slug, path.title);
    if (d.difficulty) difficulties.add(d.difficulty);
    if (d.cost_level) costLevels.add(d.cost_level);
    if (d.season) seasons.add(d.season);
  }

  const toSortedList = (m: Map<string, string>) =>
    Array.from(m.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "it"));

  const difficultyOrder: RecipeDifficulty[] = ["facile", "media", "avanzata"];
  const costOrder: RecipeCostLevel[] = ["basso", "medio", "alto"];
  const seasonOrder: RecipeSeason[] = ["tutto_l_anno", "primavera", "estate", "autunno", "inverno", "festivita"];

  return {
    categories: toSortedList(categories),
    needs: toSortedList(needs),
    environments: toSortedList(environments),
    contexts: toSortedList(contexts),
    materials: toSortedList(materials),
    paths: Array.from(paths.entries())
      .map(([slug, title]) => ({ slug, title }))
      .sort((a, b) => a.title.localeCompare(b.title, "it")),
    difficulties: difficultyOrder.filter((d) => difficulties.has(d)),
    costLevels: costOrder.filter((c) => costLevels.has(c)),
    seasons: seasonOrder.filter((s) => seasons.has(s)),
  };
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
    res = await fetch(url, { cache: "no-store" });
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
    res = await fetch(url, { cache: "no-store" });
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
