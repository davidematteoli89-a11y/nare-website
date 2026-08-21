import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { NewsletterFormShell } from "@/components/NewsletterFormShell";

const CANONICAL_URL = "https://nare-website.vercel.app/newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Iscriviti alla newsletter Narè: nuovi contenuti MeLoProduco, ricette, guide, incontri e novità.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Newsletter Narè",
    description: "Idee da portare nella vita di ogni giorno: nuovi contenuti MeLoProduco, ricette, guide e incontri.",
    url: CANONICAL_URL,
    type: "website",
  },
};

/**
 * /newsletter — pagina definitiva (Fase 8, Step 8Q).
 *
 * ⚠️ Aggiornamento 21 ago 2026: dopo un breve test con l'iframe nativo
 * Brevo (BrevoNewsletterIframe, non più usato qui — vedi il file per la
 * cronologia), si è tornati al form custom NewsletterFormShell per avere
 * UN SOLO flusso di iscrizione coerente con Home/MobileNav: stesso
 * componente, stesso design system Narè, stessa Server Action
 * (lib/newsletter-actions.ts → subscribeSingleOptIn in lib/brevo.ts).
 * L'iframe non aveva più un vantaggio tecnico reale una volta verificato
 * che subscribeSingleOptIn funziona indipendentemente dal problema DOI
 * che aveva bloccato inizialmente l'integrazione.
 *
 * Nessuna promessa di frequenza specifica (Step 8Q: "non decisa") — il
 * copy descrive solo cosa arriverà, non quando/quanto spesso.
 */
export default function NewsletterPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>Newsletter Narè</Eyebrow>
        <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">Idee da portare nella vita di ogni giorno.</h1>
        <p className="text-lead mt-5 text-[var(--color-foreground-muted)]">
          Riceverai i nuovi contenuti MeLoProduco, le ricette, le guide e gli incontri Narè, oltre alle novità sui
          progetti in arrivo.
        </p>

        <div className="mt-10 text-left">
          <NewsletterFormShell />
        </div>

        <p className="text-meta mt-6 text-[var(--color-foreground-muted)]">
          Nessuno spam: solo contenuti utili, e puoi cancellarti in qualsiasi momento da ogni email che riceverai.
        </p>
      </div>
    </Container>
  );
}
