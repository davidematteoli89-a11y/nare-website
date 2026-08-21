"use server";

import { getBrevoDoubleOptInConfig, subscribeDoubleOptIn } from "./brevo";

/**
 * Server Action per l'iscrizione newsletter — Fase 8, Step 8I/8L/8M/8N/8O.
 *
 * Flusso (Step 8B): browser → questa Server Action (server-side) → Brevo
 * API. La API key non lascia mai il server (Step 8C/8W): questo file NON
 * ha la direttiva "use client" e non viene mai importato da un componente
 * client per il suo contenuto, solo invocato come action da un form.
 *
 * Stato ritornato alla UI: sempre uno union type sicuro, mai la risposta
 * raw Brevo (Step 8I.6/8N).
 *
 * ✅ Double opt-in ripristinato (21 ago 2026) — vedi nota completa in
 * lib/brevo.ts per la cronologia del blocco temporaneo e la sua
 * risoluzione. `alreadySubscribed: true` indica che Brevo ha riconosciuto
 * un contatto già confermato in precedenza (nessuna nuova email di
 * conferma inviata in quel caso, Step 8M).
 */

export type NewsletterSubmitResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; error: "validation" | "consent_required" | "unavailable" | "config_missing" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 80;

// Tempo minimo (ms) tra il render del form e il submit — anti-bot leggero
// (Step 8O), scarta submit istantanei tipici di script automatici. Il
// timestamp arriva dal client come campo hidden "formRenderedAt".
const MIN_SUBMIT_TIME_MS = 1500;

export async function subscribeToNewsletter(formData: FormData): Promise<NewsletterSubmitResult> {
  // Honeypot (Step 8O): campo invisibile agli utenti reali, che i bot
  // spesso compilano automaticamente. Se valorizzato, scartiamo in
  // silenzio come se fosse andato tutto bene — mai rivelare al bot che è
  // stato rilevato.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true, alreadySubscribed: false };
  }

  // Tempo minimo di compilazione (Step 8O).
  const renderedAtRaw = formData.get("formRenderedAt");
  const renderedAt = typeof renderedAtRaw === "string" ? Number.parseInt(renderedAtRaw, 10) : NaN;
  if (!Number.isNaN(renderedAt) && Date.now() - renderedAt < MIN_SUBMIT_TIME_MS) {
    return { ok: true, alreadySubscribed: false };
  }

  const emailRaw = formData.get("email");
  const nameRaw = formData.get("name");
  const consentRaw = formData.get("consent");

  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  const name = typeof nameRaw === "string" ? nameRaw.trim().slice(0, NAME_MAX_LENGTH) : "";
  const consent = consentRaw === "true" || consentRaw === "on";

  if (!consent) {
    return { ok: false, error: "consent_required" };
  }

  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { ok: false, error: "validation" };
  }

  const configResult = getBrevoDoubleOptInConfig();
  if (!configResult.ok) {
    // Config mancante lato server — mai esporre QUALI variabili mancano al
    // client (Step 8N/8W), ma logghiamo lato server per debug operativo.
    console.error("[newsletter] Brevo config incompleta:", configResult.missing.join(", "));
    return { ok: false, error: "config_missing" };
  }

  // URL di redirect post-conferma (Step 8G/8S): Brevo reindirizza qui SOLO
  // dopo che l'utente ha cliccato il link nell'email di conferma DOI.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const result = await subscribeDoubleOptIn({
    config: configResult.config,
    email,
    name: name || undefined,
    redirectionUrl: `${siteUrl}/newsletter/conferma`,
  });

  switch (result.status) {
    case "confirmation_sent":
      return { ok: true, alreadySubscribed: false };
    case "already_subscribed":
      // Step 8M: mai "contact already exists" — trattato come successo
      // silenzioso, la UI mostrerà un copy neutro e user-friendly.
      return { ok: true, alreadySubscribed: true };
    case "error":
      return { ok: false, error: "unavailable" };
  }
}
