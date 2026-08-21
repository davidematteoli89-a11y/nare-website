"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Input } from "./Input";
import { Button } from "./Button";
import { subscribeToNewsletter, type NewsletterSubmitResult } from "@/lib/newsletter-actions";

const initialState: NewsletterSubmitResult | null = null;

/**
 * Form newsletter reale — Fase 8, Step 8P/8Q/8F/8L.
 *
 * Collegato a lib/newsletter-actions.ts (Server Action) → Brevo,
 * double opt-in (Step 8G, ripristinato 21 ago 2026 — vedi lib/brevo.ts).
 * Nessuna API key nel client: il form invoca solo la Server Action, che
 * gira interamente sul server.
 *
 * Campi (Step 8F): email (obbligatoria), nome (opzionale, solo in forma
 * non-compact), consenso privacy (obbligatorio, checkbox MAI
 * pre-selezionata, link a /privacy).
 *
 * Anti-abuse (Step 8O): honeypot invisibile "website" + timestamp
 * "formRenderedAt" per il controllo tempo minimo, entrambi letti
 * server-side in subscribeToNewsletter.
 */
export function NewsletterFormShell({ compact = false }: { compact?: boolean }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: NewsletterSubmitResult | null, formData: FormData) => subscribeToNewsletter(formData),
    initialState
  );
  const [renderedAt] = useState(() => Date.now());
  const [consentChecked, setConsentChecked] = useState(false);

  // Dopo un submit riuscito, se il form era pieno di dati non ha più senso
  // tenerli visibili: il messaggio di successo sostituisce il form.
  const success = state?.ok === true;

  if (success) {
    // Copy per il flusso double opt-in (Step 8G/8S, ripristinato 21 ago
    // 2026): l'iscrizione non è ancora attiva finché l'utente non clicca il
    // link nell'email di conferma Brevo — mai fingere una conferma non
    // ancora avvenuta.
    return (
      <p role="status" className="rounded-[var(--radius-md)] bg-[var(--color-success-bg)] px-4 py-3 text-sm text-[var(--color-success)]">
        {state.alreadySubscribed
          ? "Se questa email è già iscritta, non devi fare altro."
          : "Controlla la tua email: ti abbiamo inviato un link per confermare l'iscrizione."}
      </p>
    );
  }

  return (
    <form action={formAction} className={compact ? "flex flex-col gap-3" : "flex flex-col gap-4"} noValidate>
      {/* Honeypot anti-bot (Step 8O): invisibile e non raggiungibile da tab,
          mai compilato da un utente reale. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Non compilare questo campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formRenderedAt" value={renderedAt} />

      <div className={compact ? "flex flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"}>
        <div className="flex-1">
          <Input label="Email" hideLabel={compact} type="email" name="email" placeholder="La tua email" required disabled={isPending} />
        </div>
        {!compact && <Input label="Nome (opzionale)" name="name" placeholder="Nome (opzionale)" disabled={isPending} />}
        <Button type="submit" disabled={isPending} className={compact ? "shrink-0" : undefined}>
          {isPending ? "Invio…" : "Iscriviti"}
        </Button>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-[var(--color-foreground-muted)]">
        <input
          type="checkbox"
          name="consent"
          value="true"
          required
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          disabled={isPending}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--color-border-strong)]"
        />
        <span>
          Ho letto la{" "}
          <Link href="/privacy" className="text-[var(--color-accent-text)] underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          e acconsento al trattamento dei dati per ricevere la newsletter Narè.
        </span>
      </label>

      {state && !state.ok && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {errorMessage(state.error)}
        </p>
      )}
    </form>
  );
}

function errorMessage(error: "validation" | "consent_required" | "unavailable" | "config_missing"): string {
  switch (error) {
    case "consent_required":
      return "Per iscriverti devi accettare la Privacy Policy.";
    case "validation":
      return "Controlla di aver inserito un'email valida.";
    case "unavailable":
    case "config_missing":
    default:
      return "Qualcosa non ha funzionato. Riprova più tardi.";
  }
}
