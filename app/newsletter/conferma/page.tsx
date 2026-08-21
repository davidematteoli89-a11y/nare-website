import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "Iscrizione confermata",
  description: "Iscrizione alla newsletter Narè confermata.",
};

/**
 * /newsletter/conferma — Fase 8, Step 8G/8S.
 *
 * Pagina di destinazione del `redirectionUrl` passato a Brevo in
 * lib/brevo.ts (subscribeDoubleOptIn). Brevo reindirizza qui SOLO dopo che
 * l'utente ha effettivamente cliccato il link nell'email di conferma
 * double opt-in — questa pagina non verifica nulla lato server (Brevo non
 * espone un modo semplice per Narè di ri-verificare lo stato del contatto
 * da qui), quindi il copy è volutamente descrittivo del flusso reale
 * ("hai confermato, sei iscritta/o") e non una finta conferma lato
 * client (Step 8S: "NON fingere conferma se Brevo non l'ha realmente
 * eseguita" — qui la conferma è già avvenuta in Brevo prima del redirect,
 * la pagina si limita a comunicarlo).
 */
export default function NewsletterConfermaPage() {
  return (
    <Container className="py-16 text-center sm:py-20">
      <div className="mx-auto max-w-md">
        <Eyebrow>Newsletter Narè</Eyebrow>
        <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">Iscrizione confermata.</h1>
        <p className="text-lead mt-5 text-[var(--color-foreground-muted)]">
          Da ora riceverai le novità di Narè: nuovi contenuti MeLoProduco, ricette, guide e incontri.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/">Torna a Narè</LinkButton>
          <LinkButton href="/meloproduco" variant="secondary">
            Esplora MeLoProduco
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
