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
 * /newsletter — pagina definitiva (Fase 8, Step 8Q). Form reale collegato
 * a Brevo in double opt-in (vedi components/NewsletterFormShell.tsx e
 * lib/newsletter-actions.ts).
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
