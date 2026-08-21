"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { submitNareLeadRequest, type LeadSubmitResult } from "@/lib/lead-actions";

const initialState: LeadSubmitResult | null = null;

const REQUEST_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "incontro", label: "Incontro / workshop" },
  { value: "ritiro", label: "Ritiro" },
  { value: "famiglie", label: "Attività per famiglie" },
  { value: "scuola", label: "Attività per scuola" },
  { value: "in_viaggio", label: "Narè In Viaggio" },
  { value: "evento_privato", label: "Evento privato" },
  { value: "evento_azienda", label: "Evento per azienda" },
  { value: "struttura_ricettiva", label: "Attività per struttura ricettiva" },
  { value: "altro", label: "Altro" },
];

const PEOPLE_RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Non lo so ancora" },
  { value: "fino_10", label: "Fino a 10" },
  { value: "11_30", label: "11–30" },
  { value: "31_60", label: "31–60" },
  { value: "61_100", label: "61–100" },
  { value: "oltre_100", label: "Oltre 100" },
];

const TIMING_OPTIONS: { value: string; label: string }[] = [
  { value: "da_definire", label: "Da definire" },
  { value: "data", label: "Ho una data" },
  { value: "periodo", label: "Ho un periodo indicativo" },
];

const INTEREST_OPTIONS: { value: string; label: string }[] = [
  { value: "autoproduzione", label: "Autoproduzione" },
  { value: "cucina", label: "Cucina" },
  { value: "manualita", label: "Manualità" },
  { value: "natura", label: "Natura" },
  { value: "bambini_famiglie", label: "Bambini/famiglie" },
  { value: "esperienza_gruppo", label: "Esperienza di gruppo" },
  { value: "sostenibilita", label: "Sostenibilità" },
  { value: "stagionalita", label: "Stagionalità" },
  { value: "altro", label: "Altro" },
];

// Mappa del parametro ?tipo= (passato dalle CTA contestuali, Step 12C) al
// valore reale del select "Che cosa vorresti organizzare?" — precompila
// senza impedire la modifica (il campo resta un select normale, editabile).
const TIPO_PARAM_TO_REQUEST_TYPE: Record<string, string> = {
  incontro: "incontro",
  ritiro: "ritiro",
  famiglie: "famiglie",
  "in-viaggio": "in_viaggio",
};

export function PortaNareForm() {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo") ?? "";
  const preselectedRequestType = TIPO_PARAM_TO_REQUEST_TYPE[tipoParam] ?? "";

  const [state, formAction, isPending] = useActionState(
    async (_prev: LeadSubmitResult | null, formData: FormData) => submitNareLeadRequest(formData),
    initialState
  );
  const [renderedAt] = useState(() => Date.now());
  const [requestType, setRequestType] = useState(preselectedRequestType);
  const [timingType, setTimingType] = useState("da_definire");
  const [consentChecked, setConsentChecked] = useState(false);

  const success = state?.ok === true;

  if (success) {
    return (
      <p
        role="status"
        className="rounded-[var(--radius-md)] bg-[var(--color-success-bg)] px-5 py-4 text-sm text-[var(--color-success)]"
      >
        Grazie, abbiamo ricevuto la tua richiesta. Ci hai raccontato il punto di partenza: da qui possiamo capire
        insieme se e come costruire qualcosa.
      </p>
    );
  }

  // UX progressiva (Step 12E): "Dove/Quando/Esperienza/Messaggio" compaiono
  // solo dopo che è stato scelto un tipo di richiesta — non un wizard con
  // passaggi bloccanti, solo una rivelazione naturale che tiene il form
  // breve finché non serve il resto.
  const showRest = requestType !== "";

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {/* Honeypot anti-bot (Step 12S) — stesso pattern della newsletter. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="lead-website">Non compilare questo campo</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formRenderedAt" value={renderedAt} />
      <input type="hidden" name="sourcePage" value="/porta-nare-da-te" />
      <input type="hidden" name="utmSource" value={searchParams.get("utm_source") ?? ""} />
      <input type="hidden" name="utmMedium" value={searchParams.get("utm_medium") ?? ""} />
      <input type="hidden" name="utmCampaign" value={searchParams.get("utm_campaign") ?? ""} />

      <fieldset className="flex flex-col gap-4" disabled={isPending}>
        <legend className="sr-only">I tuoi dati</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome" name="firstName" placeholder="Il tuo nome" required maxLength={100} />
          <Input label="Cognome (opzionale)" name="lastName" placeholder="Il tuo cognome" maxLength={100} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" name="email" placeholder="La tua email" required maxLength={254} />
          <Input label="Telefono (opzionale)" type="tel" name="phone" placeholder="Il tuo telefono" maxLength={40} />
        </div>
      </fieldset>

      <Select
        label="Che cosa vorresti organizzare?"
        name="requestType"
        required
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
      >
        <option value="" disabled>
          Scegli un&apos;opzione
        </option>
        {REQUEST_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      {showRest && (
        <>
          <fieldset className="flex flex-col gap-4" disabled={isPending}>
            <legend className="text-sm font-medium text-[var(--color-foreground)]">Dove?</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Città" name="city" placeholder="La tua città" required maxLength={100} />
              <Input label="Provincia/regione (opzionale)" name="region" placeholder="Provincia o regione" maxLength={100} />
            </div>
          </fieldset>

          <Select label="Per quante persone?" name="peopleRange" defaultValue="">
            {PEOPLE_RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>

          <fieldset className="flex flex-col gap-3" disabled={isPending}>
            <legend className="text-sm font-medium text-[var(--color-foreground)]">Quando?</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              {TIMING_OPTIONS.map((o) => (
                <label key={o.value} className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
                  <input
                    type="radio"
                    name="timingType"
                    value={o.value}
                    checked={timingType === o.value}
                    onChange={() => setTimingType(o.value)}
                    className="h-4 w-4 border-[var(--color-border-strong)]"
                  />
                  {o.label}
                </label>
              ))}
            </div>
            {timingType === "data" && (
              <Input label="Data" type="date" name="requestedDate" hideLabel />
            )}
            {timingType === "periodo" && (
              <Input label="Periodo indicativo" name="requestedPeriod" placeholder="es. ottobre 2026" hideLabel maxLength={100} />
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-2" disabled={isPending}>
            <legend className="text-sm font-medium text-[var(--color-foreground)]">Che tipo di esperienza immagini?</legend>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {INTEREST_OPTIONS.map((o) => (
                <label key={o.value} className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
                  <input type="checkbox" name="interests" value={o.value} className="h-4 w-4 rounded border-[var(--color-border-strong)]" />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>

          <Textarea label="Messaggio (opzionale)" name="message" placeholder="Raccontaci di più, se vuoi" rows={3} maxLength={2000} />
        </>
      )}

      <label className="flex items-start gap-2.5 text-sm text-[var(--color-foreground-muted)]">
        <input
          type="checkbox"
          name="privacyConsent"
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
          e acconsento al trattamento dei dati per essere ricontattato/a in merito a questa richiesta.
        </span>
      </label>

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Invio…" : "Invia la richiesta"}
      </Button>

      {state && !state.ok && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {errorMessage(state.error)}
        </p>
      )}
    </form>
  );
}

function errorMessage(error: "validation" | "privacy_required" | "unavailable" | "rate_limited"): string {
  switch (error) {
    case "privacy_required":
      return "Per inviare la richiesta devi accettare la Privacy Policy.";
    case "validation":
      return "Controlla di aver compilato i campi obbligatori (nome, email, città, tipo di richiesta).";
    case "rate_limited":
      return "Troppe richieste in poco tempo. Riprova tra qualche minuto.";
    case "unavailable":
    default:
      return "Non siamo riusciti a inviare la richiesta. Riprova tra poco.";
  }
}
