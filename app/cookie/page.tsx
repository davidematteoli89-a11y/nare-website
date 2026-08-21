import type { Metadata } from "next";
import { Container } from "@/components/Container";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Cookie",
  description: "Informativa cookie di Narè: quali tecnologie di tracciamento sono realmente usate sul sito.",
  alternates: { canonical: `${siteUrl}/cookie` },
};

/**
 * Pagina legale — Cookie Policy (Fase 9M/9N).
 *
 * Aggiornata sulla base di un audit tecnico reale del codice sorgente (non
 * di un template generico): elenca ESATTAMENTE cosa il sito carica oggi,
 * nessuna voce ipotetica o "per sicurezza". Le sezioni [DA VALIDARE] vanno
 * confermate da un consulente legale/privacy prima del go-live definitivo,
 * ma la parte tecnica sottostante è accurata al momento della stesura.
 *
 * Perché NON esiste un banner di consenso cookie: il sito, ad oggi, non
 * imposta alcun cookie non tecnico e non usa localStorage/sessionStorage.
 * Se in futuro verranno introdotti strumenti che impostano cookie non
 * essenziali (es. un tool di analytics diverso da Vercel Web Analytics, un
 * pixel di marketing, un embed che traccia), questa pagina e l'eventuale
 * necessità di un banner di consenso preventivo andranno rivalutate PRIMA
 * di attivare quello strumento.
 *
 * Dati titolare aggiornati Fase 10F (dati reali forniti dal cliente, non
 * inventati — vedi nota completa in app/privacy/page.tsx).
 */
export default function CookiePage() {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-foreground)]">Cookie</h1>

      <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
        Questa pagina descrive le tecnologie di tracciamento e i cookie effettivamente utilizzati dal sito Narè, sulla
        base di una verifica tecnica del sito stesso.
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Cookie tecnici</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Il sito non installa cookie tecnici propri per il funzionamento delle pagine (nessun cookie di sessione,
        nessuna preferenza salvata lato browser). Non utilizziamo <code>localStorage</code> né{" "}
        <code>sessionStorage</code>.
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Analisi statistiche (analytics)</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Utilizziamo Vercel Web Analytics per raccogliere statistiche aggregate e anonime sulle visite al sito (pagine
        visitate, provenienza, dispositivo). Questo strumento non utilizza cookie e non genera identificatori
        persistenti in grado di riconoscere un singolo visitatore nel tempo — per questo motivo non richiede consenso
        cookie preventivo secondo le linee guida correnti. [DA VALIDARE: conferma legale della qualificazione di
        Vercel Web Analytics come strumento non profilante ai fini del Regolamento UE 2016/679 e delle linee guida del
        Garante Privacy applicabili al momento del go-live.]
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Newsletter (Brevo)</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Il modulo di iscrizione alla newsletter invia i dati (email, nome facoltativo) al nostro server, che li
        trasmette a Brevo (fornitore del servizio di invio email) esclusivamente lato server. Nessuno script Brevo
        viene caricato nel browser: l&apos;iscrizione non installa cookie né pixel di tracciamento Brevo sul tuo
        dispositivo. Per maggiori dettagli sul trattamento dei dati di iscrizione, vedi la{" "}
        <a href="/privacy" className="text-[var(--color-accent-text)] underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Video incorporati (YouTube)</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Alcuni contenuti video (interventi RAI di Cristina) possono essere incorporati tramite il player YouTube in
        modalità privacy-enhanced (<code>youtube-nocookie.com</code>), che riduce l&apos;uso di cookie rispetto
        all&apos;embed YouTube standard. Il player viene caricato solo se scegli attivamente di avviare la
        riproduzione di un video, mai automaticamente al caricamento della pagina. Una volta avviato il video, Google
        può comunque installare i propri cookie secondo la sua informativa. [DA VALIDARE: verificare se, al momento
        del go-live, l&apos;embed YouTube in modalità privacy-enhanced richieda comunque un consenso preventivo
        secondo le linee guida applicabili.]
      </p>

      <h2 className="mt-8 text-lg font-medium text-[var(--color-foreground)]">Nessun banner di consenso cookie</h2>
      <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
        Il sito non mostra un banner di consenso cookie perché, allo stato attuale, non installa cookie non tecnici
        né di profilazione al caricamento della pagina. Se in futuro verranno introdotti strumenti che richiedono
        consenso preventivo, questa pagina sarà aggiornata insieme all&apos;implementazione di un meccanismo di
        consenso adeguato.
      </p>

      <p className="mt-8 text-xs text-[var(--color-foreground-muted)]">
        Titolare: Cristina Nigrelli · Via San Donato 79, 56028 San Miniato (PI) ·{" "}
        <a href="mailto:cristinanaturopata@gmail.com" className="text-[var(--color-accent-text)] underline underline-offset-4">
          cristinanaturopata@gmail.com
        </a>
      </p>
    </Container>
  );
}
