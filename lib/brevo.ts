/**
 * Cookie behavior (Step 8U): questa integrazione è interamente
 * server-side — nessuno script Brevo (tracking pixel, widget, SDK client)
 * viene mai caricato nel browser. L'iscrizione newsletter di per sé non
 * richiede quindi alcun cookie banner/consenso cookie aggiuntivo. Se in
 * futuro si aggiungesse un qualunque script Brevo lato client (es. Brevo
 * Conversations, tracking automation), questa nota andrà rivista insieme
 * al cookie banner del sito.
 *
 * Client Brevo server-side — Fase 8, Step 8B/8I.
 *
 * REGOLA ASSOLUTA (Step 8C/8W): questo file usa SOLO `process.env.BREVO_*`
 * (mai `NEXT_PUBLIC_*`). Viene importato esclusivamente da Server Actions
 * ("use server", vedi lib/newsletter-actions.ts) — non deve mai finire nel
 * bundle client. Nessuna funzione qui esposta a componenti "use client".
 *
 * ⚠️ DECISIONE TEMPORANEA (21 ago 2026) — SINGLE OPT-IN invece di DOUBLE
 * OPT-IN, in deroga esplicita alla preferenza di Step 8G/8H:
 *
 * Il flusso double opt-in via `POST /v3/contacts/doubleOptinConfirmation`
 * (subscribeDoubleOptIn, sotto) è stato implementato e testato in
 * produzione con esito negativo: Brevo rifiuta sistematicamente la
 * richiesta con `400 invalid_parameter — "An active DOI template does not
 * exist"`, anche dopo aver:
 * 1. Verificato/riverificato il mittente del template (non era il problema:
 *    warning DKIM su dominio Gmail, non un blocco).
 * 2. Ricreato la configurazione DOI tramite il wizard nativo Brevo
 *    (Contatti > Moduli > Iscrizione > Email di conferma doppia),
 *    associando esplicitamente il template alla lista "Newsletter Narè".
 * 3. Confermato che il template risulta "Attiva" sia nella sezione Modelli
 *    che nel selettore del wizard DOI.
 * Ipotesi più probabile: la funzione DOI via API richiede un piano Brevo
 * superiore a quello attualmente attivo su questo account (alcune opzioni
 * correlate, es. blocco iscrizioni da provider gratuiti, sono
 * esplicitamente gated dietro il piano "Standard" nella stessa schermata).
 * Non confermato — richiede supporto Brevo per una risposta definitiva.
 *
 * Per non tenere la Fase 8 bloccata a tempo indeterminato, l'utente ha
 * scelto esplicitamente (non è un fallback automatico, vedi Step 8H) di
 * passare temporaneamente a single opt-in: `subscribeSingleOptIn` usa
 * `POST /v3/contacts` per creare/aggiornare il contatto e aggiungerlo
 * direttamente alla lista, SENZA email di conferma. Nessuna finzione di
 * "email inviata" verso l'utente: la UI deve riflettere che l'iscrizione è
 * immediata (vedi NewsletterFormShell.tsx).
 *
 * QUANDO IL DOI VERRÀ SBLOCCATO (upgrade piano o risposta supporto Brevo):
 * reintrodurre `subscribeDoubleOptIn` in newsletter-actions.ts al posto di
 * `subscribeSingleOptIn`, ripristinare il copy "Controlla la tua email per
 * confermare l'iscrizione" e la env `BREVO_DOUBLE_OPTIN_TEMPLATE_ID`
 * torna ad essere obbligatoria.
 *
 * Env richieste (documentate anche in .env.example, Step 8D):
 * - BREVO_API_KEY — obbligatoria, mai pubblica.
 * - BREVO_NEWSLETTER_LIST_ID — obbligatoria, ID numerico della lista
 *   "Newsletter Narè" in Brevo (Step 8E: una sola lista, nessuna
 *   segmentazione per area).
 * - BREVO_DOUBLE_OPTIN_TEMPLATE_ID — NON più obbligatoria con il fallback
 *   single opt-in temporaneo sopra descritto. Resta letta/validata da
 *   getBrevoDoubleOptInConfig() per quando il flusso DOI verrà
 *   ripristinato, ma getBrevoConfig() (usata ora) non la richiede.
 * - BREVO_WELCOME_TEMPLATE_ID — opzionale, non usata nel flusso single
 *   opt-in attuale.
 */

export interface BrevoConfig {
  apiKey: string;
  listId: number;
}

export type BrevoConfigResult = { ok: true; config: BrevoConfig } | { ok: false; missing: string[] };

/**
 * Legge e valida la config Brevo minima (single opt-in) da env. Ritorna
 * esplicitamente quali variabili mancano invece di lanciare/loggare
 * l'errore con dettagli — la Server Action decide poi come comunicarlo
 * (mai al client, solo nei log server, Step 8N).
 */
export function getBrevoConfig(): BrevoConfigResult {
  const missing: string[] = [];

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) missing.push("BREVO_API_KEY");

  const listIdRaw = process.env.BREVO_NEWSLETTER_LIST_ID;
  const listId = listIdRaw ? Number.parseInt(listIdRaw, 10) : NaN;
  if (!listIdRaw || Number.isNaN(listId)) missing.push("BREVO_NEWSLETTER_LIST_ID");

  if (missing.length > 0) return { ok: false, missing };

  return { ok: true, config: { apiKey: apiKey!, listId } };
}

export type BrevoSubscribeResult =
  | { status: "confirmation_sent" }
  | { status: "already_subscribed" }
  | { status: "error"; reason: "brevo_unavailable" | "rate_limited" | "invalid_config" | "unknown" };

/**
 * Config estesa per il flusso double opt-in (non usata al momento, vedi
 * nota "DECISIONE TEMPORANEA" in cima al file — mantenuta per il ripristino
 * futuro del DOI).
 */
export interface BrevoDoubleOptInConfig extends BrevoConfig {
  doubleOptinTemplateId: number;
}

export type BrevoDoubleOptInConfigResult =
  | { ok: true; config: BrevoDoubleOptInConfig }
  | { ok: false; missing: string[] };

/**
 * Legge la config completa per il double opt-in, incluso il templateId.
 * NON usata dal flusso attivo (single opt-in) — pronta per quando il DOI
 * verrà ripristinato in newsletter-actions.ts.
 */
export function getBrevoDoubleOptInConfig(): BrevoDoubleOptInConfigResult {
  const missing: string[] = [];

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) missing.push("BREVO_API_KEY");

  const listIdRaw = process.env.BREVO_NEWSLETTER_LIST_ID;
  const listId = listIdRaw ? Number.parseInt(listIdRaw, 10) : NaN;
  if (!listIdRaw || Number.isNaN(listId)) missing.push("BREVO_NEWSLETTER_LIST_ID");

  const templateIdRaw = process.env.BREVO_DOUBLE_OPTIN_TEMPLATE_ID;
  const doubleOptinTemplateId = templateIdRaw ? Number.parseInt(templateIdRaw, 10) : NaN;
  if (!templateIdRaw || Number.isNaN(doubleOptinTemplateId)) missing.push("BREVO_DOUBLE_OPTIN_TEMPLATE_ID");

  if (missing.length > 0) return { ok: false, missing };

  return { ok: true, config: { apiKey: apiKey!, listId, doubleOptinTemplateId } };
}

/**
 * Iscrive un contatto in double opt-in tramite l'endpoint Brevo dedicato
 * `POST /contacts/doubleOptinConfirmation` (Step 8G, opzione scelta:
 * endpoint esplicito con templateId, non automation workflow).
 *
 * Brevo invia automaticamente l'email di conferma con quel template;
 * l'iscrizione diventa attiva solo dopo il click dell'utente — nessuna
 * finzione di conferma lato Narè (Step 8S).
 *
 * `redirectionUrl` è la pagina Narè su cui Brevo reindirizza l'utente dopo
 * il click di conferma nell'email (Step 8G — /newsletter/conferma).
 *
 * ⚠️ Non usata dal flusso attivo — vedi nota "DECISIONE TEMPORANEA" in
 * cima al file. Mantenuta per il ripristino futuro del DOI.
 */
export async function subscribeDoubleOptIn(params: {
  config: BrevoDoubleOptInConfig;
  email: string;
  name?: string;
  redirectionUrl: string;
}): Promise<BrevoSubscribeResult> {
  const { config, email, name, redirectionUrl } = params;

  let res: Response;
  try {
    res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        email,
        includeListIds: [config.listId],
        templateId: config.doubleOptinTemplateId,
        redirectionUrl,
        attributes: name ? { FIRSTNAME: name } : undefined,
      }),
    });
  } catch {
    // Rete/timeout — mai propagare il dettaglio al client (Step 8N).
    return { status: "error", reason: "brevo_unavailable" };
  }

  // Brevo: 204 No Content = contatto creato/aggiornato, email di conferma inviata.
  if (res.status === 204) return { status: "confirmation_sent" };

  // 400 con duplicate_parameter/contact già opt-in: trattato come esito
  // "silenzioso" lato UI (Step 8M — mai enumeration, mai "contact already
  // exists"). Brevo non re-invia una nuova email di conferma a un contatto
  // già confermato in questo caso — comportamento corretto per non spammare.
  if (res.status === 400) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const code = isPlainObject(body) && typeof body.code === "string" ? body.code : null;
    if (code === "duplicate_parameter" || code === "contact_already_exist") {
      return { status: "already_subscribed" };
    }
    // Debug log (Step 8N): status + body Brevo, MAI la api-key (non è mai
    // stata nel body/header loggato qui). Utile per diagnosticare
    // config errata (list/template ID sbagliati) senza esporre nulla al
    // client, che riceve solo il risultato mappato "error".
    console.error("[newsletter] Brevo 400:", JSON.stringify(body));
    return { status: "error", reason: "invalid_config" };
  }

  if (res.status === 401 || res.status === 403) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    console.error(`[newsletter] Brevo ${res.status}:`, JSON.stringify(body));
    return { status: "error", reason: "invalid_config" };
  }
  if (res.status === 429) return { status: "error", reason: "rate_limited" };

  let unknownBody: unknown;
  try {
    unknownBody = await res.json();
  } catch {
    unknownBody = null;
  }
  console.error(`[newsletter] Brevo ${res.status} (unmapped):`, JSON.stringify(unknownBody));
  return { status: "error", reason: "unknown" };
}

/**
 * Iscrive un contatto in single opt-in tramite `POST /v3/contacts`: crea o
 * aggiorna il contatto e lo aggiunge direttamente a `listIds`, SENZA email
 * di conferma. L'iscrizione è immediata — nessun click di conferma
 * richiesto all'utente.
 *
 * ⚠️ DECISIONE TEMPORANEA (21 ago 2026) — vedi nota completa in cima al
 * file. Attualmente il flusso attivo, in sostituzione di
 * subscribeDoubleOptIn, per una scelta esplicita dell'utente dopo che il
 * flusso double opt-in è risultato bloccato lato Brevo (errore "An active
 * DOI template does not exist", causa non confermata — sospetto piano
 * Brevo insufficiente, da verificare col supporto Brevo).
 *
 * Brevo: `updateEnabled: true` fa sì che un contatto già esistente venga
 * aggiornato (incluse le liste) invece di fallire con un errore di
 * duplicato — questo è il comportamento corretto per Step 8M (mai
 * "contact already exists" verso l'utente, mai enumeration): un secondo
 * submit della stessa email risulta in un 204/200 "successo" silenzioso
 * uguale al primo, senza distinguere se il contatto esisteva già.
 */
export async function subscribeSingleOptIn(params: {
  config: BrevoConfig;
  email: string;
  name?: string;
}): Promise<BrevoSubscribeResult> {
  const { config, email, name } = params;

  let res: Response;
  try {
    res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [config.listId],
        updateEnabled: true,
        attributes: name ? { FIRSTNAME: name } : undefined,
      }),
    });
  } catch {
    // Rete/timeout — mai propagare il dettaglio al client (Step 8N).
    return { status: "error", reason: "brevo_unavailable" };
  }

  // Brevo: 201 Created = nuovo contatto creato e aggiunto alla lista.
  // Con updateEnabled:true, un contatto già esistente viene aggiornato e
  // Brevo risponde comunque con successo (204 No Content), mai un errore
  // di duplicato — trattiamo entrambi come "already_subscribed" solo se lo
  // status/response lo segnala esplicitamente, altrimenti come iscrizione
  // riuscita silenziosa (Step 8M).
  if (res.status === 201) return { status: "confirmation_sent" };
  if (res.status === 204) return { status: "already_subscribed" };

  if (res.status === 400) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const code = isPlainObject(body) && typeof body.code === "string" ? body.code : null;
    if (code === "duplicate_parameter" || code === "contact_already_exist") {
      return { status: "already_subscribed" };
    }
    console.error("[newsletter] Brevo 400 (single opt-in):", JSON.stringify(body));
    return { status: "error", reason: "invalid_config" };
  }

  if (res.status === 401 || res.status === 403) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    console.error(`[newsletter] Brevo ${res.status} (single opt-in):`, JSON.stringify(body));
    return { status: "error", reason: "invalid_config" };
  }
  if (res.status === 429) return { status: "error", reason: "rate_limited" };

  let unknownBody: unknown;
  try {
    unknownBody = await res.json();
  } catch {
    unknownBody = null;
  }
  console.error(`[newsletter] Brevo ${res.status} (single opt-in, unmapped):`, JSON.stringify(unknownBody));
  return { status: "error", reason: "unknown" };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
