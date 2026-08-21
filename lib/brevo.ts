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
 * Env richieste (documentate anche in .env.example, Step 8D):
 * - BREVO_API_KEY — obbligatoria, mai pubblica.
 * - BREVO_NEWSLETTER_LIST_ID — obbligatoria, ID numerico della lista
 *   "Newsletter Narè" in Brevo (Step 8E: una sola lista, nessuna
 *   segmentazione per area).
 * - BREVO_DOUBLE_OPTIN_TEMPLATE_ID — obbligatoria per il flusso double
 *   opt-in scelto (Step 8G): ID del template email di conferma iscrizione,
 *   creato in Brevo > Campagne > Template. Senza questo ID l'endpoint
 *   dedicato Brevo per il double opt-in non può essere chiamato
 *   correttamente — vedi getBrevoConfig(), che segnala esplicitamente la
 *   config mancante invece di fare fallback silenzioso a single opt-in
 *   (Step 8H).
 * - BREVO_WELCOME_TEMPLATE_ID — opzionale. Se assente, nessuna email di
 *   benvenuto extra viene inviata oltre a quella di conferma double
 *   opt-in (che Brevo invia comunque tramite BREVO_DOUBLE_OPTIN_TEMPLATE_ID).
 */

export interface BrevoConfig {
  apiKey: string;
  listId: number;
  doubleOptinTemplateId: number;
}

export type BrevoConfigResult = { ok: true; config: BrevoConfig } | { ok: false; missing: string[] };

/**
 * Legge e valida la config Brevo da env. Ritorna esplicitamente quali
 * variabili mancano invece di lanciare/loggare l'errore con dettagli — la
 * Server Action decide poi come comunicarlo (mai al client, solo nei log
 * server, Step 8N).
 */
export function getBrevoConfig(): BrevoConfigResult {
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

export type BrevoSubscribeResult =
  | { status: "confirmation_sent" }
  | { status: "already_subscribed" }
  | { status: "error"; reason: "brevo_unavailable" | "rate_limited" | "invalid_config" | "unknown" };

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
 */
export async function subscribeDoubleOptIn(params: {
  config: BrevoConfig;
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
    return { status: "error", reason: "invalid_config" };
  }

  if (res.status === 401 || res.status === 403) return { status: "error", reason: "invalid_config" };
  if (res.status === 429) return { status: "error", reason: "rate_limited" };

  return { status: "error", reason: "unknown" };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
