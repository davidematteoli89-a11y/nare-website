"use server";

import { sendLeadReceiptEmail } from "./brevo";

/**
 * Server Action per il form "Porta Narè da te" (Fase 12, Step 12F/12U).
 *
 * Flusso (Step 12F, architettura obbligatoria): browser → questa Server
 * Action → POST /api/public/[orgSlug]/leads su aiDady → CRM. Nessun secret
 * nel client, nessun accesso diretto a Supabase o al CRM da qui: questo
 * file chiama solo l'endpoint pubblico HTTP di aiDady, esattamente come
 * lib/aidady-api.ts fa in lettura — separato in un file proprio (non
 * aggiunto a aidady-api.ts) perché quel file è concettualmente di sola
 * lettura (vedi il suo commento di testa) e una funzione di scrittura
 * mischiata lì sarebbe fuorviante.
 *
 * Anti-abuse: stesso pattern di lib/newsletter-actions.ts (honeypot +
 * tempo minimo di compilazione), applicato qui E anche server-side
 * nell'endpoint aiDady stesso (difesa in profondità — un client che
 * bypassasse questa Server Action e chiamasse l'endpoint direttamente
 * incontrerebbe comunque le stesse difese).
 */

const DEFAULT_BASE_URL = "https://aidady-business-os.vercel.app";
const ORG_SLUG = "meloproduco";

function getBaseUrl(): string {
  return process.env.AIDADY_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export type LeadSubmitResult =
  | { ok: true }
  | { ok: false; error: "validation" | "privacy_required" | "unavailable" | "rate_limited" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_TIME_MS = 1500;

const REQUEST_TYPES = new Set([
  "incontro",
  "ritiro",
  "famiglie",
  "scuola",
  "in_viaggio",
  "evento_privato",
  "evento_azienda",
  "struttura_ricettiva",
  "altro",
]);
const PEOPLE_RANGES = new Set(["fino_10", "11_30", "31_60", "61_100", "oltre_100", "non_lo_so"]);
const TIMING_TYPES = new Set(["data", "periodo", "da_definire"]);
const INTERESTS = new Set([
  "autoproduzione",
  "cucina",
  "manualita",
  "natura",
  "bambini_famiglie",
  "esperienza_gruppo",
  "sostenibilita",
  "stagionalita",
  "altro",
]);
const OCCASION_TYPES = new Set([
  "addio_al_nubilato",
  "compleanno",
  "baby_shower",
  "evento_privato",
  "evento_aziendale",
  "giornata_tra_amiche",
  "ricorrenza",
  "altro",
]);

function str(formData: FormData, key: string, maxLength: number): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim().slice(0, maxLength) : "";
}

export async function submitNareLeadRequest(formData: FormData): Promise<LeadSubmitResult> {
  // Honeypot (Step 12S): stesso pattern esatto della newsletter.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }
  const renderedAtRaw = formData.get("formRenderedAt");
  const renderedAt = typeof renderedAtRaw === "string" ? Number.parseInt(renderedAtRaw, 10) : NaN;
  if (!Number.isNaN(renderedAt) && Date.now() - renderedAt < MIN_SUBMIT_TIME_MS) {
    return { ok: true };
  }

  const firstName = str(formData, "firstName", 100);
  const lastName = str(formData, "lastName", 100);
  const email = str(formData, "email", 254).toLowerCase();
  const phone = str(formData, "phone", 40);
  const requestTypeRaw = str(formData, "requestType", 50);
  const occasionTypeRaw = str(formData, "occasionType", 50);
  const city = str(formData, "city", 100);
  const region = str(formData, "region", 100);
  const peopleRangeRaw = str(formData, "peopleRange", 50);
  const timingTypeRaw = str(formData, "timingType", 50);
  const requestedDate = str(formData, "requestedDate", 10);
  const requestedPeriod = str(formData, "requestedPeriod", 100);
  const interestsRaw = formData.getAll("interests").filter((v): v is string => typeof v === "string" && INTERESTS.has(v));
  const message = str(formData, "message", 2000);
  const privacyConsent = formData.get("privacyConsent");
  const sourcePage = str(formData, "sourcePage", 200);
  const utmSource = str(formData, "utmSource", 100);
  const utmMedium = str(formData, "utmMedium", 100);
  const utmCampaign = str(formData, "utmCampaign", 100);

  if (privacyConsent !== "true" && privacyConsent !== "on") {
    return { ok: false, error: "privacy_required" };
  }

  const requestType = REQUEST_TYPES.has(requestTypeRaw) ? requestTypeRaw : null;
  const occasionType = OCCASION_TYPES.has(occasionTypeRaw) ? occasionTypeRaw : undefined;
  const timingType = TIMING_TYPES.has(timingTypeRaw) ? timingTypeRaw : "da_definire";
  const peopleRange = PEOPLE_RANGES.has(peopleRangeRaw) ? peopleRangeRaw : undefined;

  if (
    !firstName ||
    !email ||
    !EMAIL_REGEX.test(email) ||
    !city ||
    !requestType ||
    (requestType === "evento_privato" && !occasionType)
  ) {
    return { ok: false, error: "validation" };
  }

  const payload = {
    firstName,
    lastName,
    email,
    phone,
    requestType,
    occasionType,
    city,
    region,
    peopleRange,
    timingType,
    requestedDate: timingType === "data" && requestedDate ? requestedDate : undefined,
    requestedPeriod: timingType === "periodo" ? requestedPeriod : "",
    interests: interestsRaw,
    message,
    privacyConsent: true,
    sourcePage,
    utmSource,
    utmMedium,
    utmCampaign,
  };

  let res: Response;
  try {
    res = await fetch(`${getBaseUrl()}/api/public/${ORG_SLUG}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "unavailable" };
  }

  if (res.status === 429) return { ok: false, error: "rate_limited" };
  if (!res.ok) {
    console.error("[porta-nare-da-te] endpoint aiDady non ok:", res.status);
    return { ok: false, error: "unavailable" };
  }

  // Email di ricevuta (Step 12U): solo un tentativo best-effort, mai fa
  // fallire la richiesta già salvata in aiDady. Stesso principio di
  // sendWelcomeEmail nella newsletter — il fallimento è solo loggato.
  const apiKey = process.env.BREVO_API_KEY;
  if (apiKey) {
    await sendLeadReceiptEmail({ apiKey, email, firstName });
  } else {
    console.error("[porta-nare-da-te] BREVO_API_KEY mancante — email di ricevuta non inviata");
  }

  return { ok: true };
}
