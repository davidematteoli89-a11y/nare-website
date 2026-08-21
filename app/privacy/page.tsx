import type { Metadata } from "next";
import { Container } from "@/components/Container";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Informativa privacy di Narè: quali dati raccogliamo e come vengono trattati.",
  alternates: { canonical: `${siteUrl}/privacy` },
};

/**
 * Pagina legale — Privacy Policy (Fase 9O, dati titolare aggiornati Fase 10F).
 *
 * ATTENZIONE: questo NON è un testo legale definitivo. Il titolare del
 * trattamento, l'indirizzo e l'email di contatto sono dati reali forniti
 * direttamente dal cliente (21 ago 2026) — non inventati, ma nemmeno
 * validati da un consulente legale. Restano [DA VALIDARE] esplicitamente
 * la base giuridica dettagliata, il periodo di conservazione, l'eventuale
 * trasferimento extra-UE verso Brevo e l'elenco completo dei diritti
 * dell'interessato: questi punti richiedono consulenza privacy reale prima
 * del go-live definitivo, non vanno compilati con testo generico.
 *
 * Nota: il titolare è oggi una persona fisica (P.IVA prevista tra qualche
 * mese, non ancora attiva) — se/quando verrà aperta la P.IVA, questa
 * sezione andrà aggiornata di conseguenza (nuova ragione sociale/P.IVA).
 */
export default function PrivacyPage() {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-foreground)]">Privacy</h1>

      <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
        Questa informativa descrive quali dati personali raccoglie il sito Narè e come vengono trattati. Il testo
        legale definitivo sarà completato con l&apos;assistenza di un consulente privacy prima del go-live: le parti
        contrassegnate [DA INSERIRE] o [DA VALIDARE] non sono ancora definitive.
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Titolare del trattamento</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Cristina Nigrelli · Via San Donato 79, 56028 San Miniato (PI) ·{" "}
        <a href="mailto:cristinanaturopata@gmail.com" className="text-[var(--color-accent-text)] underline underline-offset-4">
          cristinanaturopata@gmail.com
        </a>
      </p>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        [DA VALIDARE: titolare oggi persona fisica, non ancora titolare di Partita IVA — questa sezione andrà
        aggiornata quando la Partita IVA sarà attiva.]
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Dati raccolti tramite la newsletter</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Se ti iscrivi alla newsletter Narè, raccogliamo: indirizzo email (obbligatorio), nome (facoltativo), e il
        consenso esplicito che presti tramite l&apos;apposita casella (mai preselezionata) al momento dell&apos;iscrizione.
        L&apos;invio del modulo passa dal nostro server verso Brevo (fornitore del servizio di invio email), che
        conserva questi dati per gestire l&apos;invio delle comunicazioni. La chiave di accesso a Brevo resta privata
        e non è mai esposta nel browser. L&apos;iscrizione è a conferma semplice: dopo l&apos;iscrizione ricevi
        un&apos;unica email di conferma, senza ulteriori passaggi. Puoi cancellarti in qualsiasi momento tramite il
        link presente in ogni email che ricevi.
      </p>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        [DA VALIDARE: base giuridica del trattamento (consenso), periodo di conservazione dei dati di iscrizione,
        eventuale trasferimento extra-UE dei dati verso i server di Brevo e relative garanzie contrattuali (SCC).]
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Dati raccolti tramite il modulo &quot;Porta Narè da te&quot;</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Se compili il modulo di richiesta nella pagina{" "}
        <a href="/porta-nare-da-te" className="text-[var(--color-accent-text)] underline underline-offset-4">
          Porta Narè da te
        </a>{" "}
        (o nelle CTA presenti su Narè Incontri, Ritiri, Famiglie e In Viaggio), raccogliamo: nome (obbligatorio),
        cognome (facoltativo), email (obbligatoria), telefono (facoltativo), città e regione/provincia, il tipo di
        richiesta e i dettagli che ci fornisci (numero indicativo di persone, periodo o data desiderata, interessi,
        messaggio libero), oltre al consenso esplicito che presti tramite l&apos;apposita casella (mai preselezionata).
        Questi dati vengono trasmessi dal nostro server al gestionale interno di MeLoProduco per essere gestiti da
        Cristina in vista di un eventuale contatto — non vengono mai inviati direttamente dal tuo browser. Dopo
        l&apos;invio riceverai un&apos;email di ricevuta che conferma solo che abbiamo ricevuto la richiesta, senza
        alcuna promessa di tempi di risposta specifici.
      </p>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        [DA VALIDARE: base giuridica del trattamento (consenso/esecuzione di misure precontrattuali su richiesta
        dell&apos;interessato), periodo di conservazione dei dati della richiesta e dei contatti creati nel gestionale
        interno.]
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Analisi statistiche</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Utilizziamo Vercel Web Analytics per raccogliere statistiche aggregate e anonime sulle visite al sito, senza
        cookie né identificatori persistenti in grado di riconoscere un singolo visitatore. Maggiori dettagli nella{" "}
        <a href="/cookie" className="text-[var(--color-accent-text)] underline underline-offset-4">
          pagina Cookie
        </a>
        .
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">I tuoi diritti</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        [DA VALIDARE: elenco completo dei diritti dell&apos;interessato (accesso, rettifica, cancellazione,
        limitazione, portabilità, opposizione) e modalità concrete per esercitarli, da definire con il consulente
        privacy.]
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Cookie</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Per il dettaglio delle tecnologie di tracciamento usate dal sito, vedi la{" "}
        <a href="/cookie" className="text-[var(--color-accent-text)] underline underline-offset-4">
          Cookie Policy
        </a>
        .
      </p>
    </Container>
  );
}
