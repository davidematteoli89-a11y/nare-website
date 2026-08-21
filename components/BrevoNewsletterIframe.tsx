/**
 * Iframe del modulo di iscrizione Brevo — Fase 8, decisione del 21 ago 2026.
 *
 * ⚠️ CAMBIO DI ARCHITETTURA rispetto alla spec originale (Step 8B: "flusso
 * strettamente browser → server action/API route → Brevo API → lista, MAI
 * browser → Brevo API key direttamente"): qui il browser invia i dati
 * DIRETTAMENTE a Brevo tramite il modulo nativo "Newsletter Narè DOI"
 * (Contatti > Moduli > Iscrizione). Nessuna API key è coinvolta lato
 * client — il modulo Brevo gestisce la sua stessa autenticazione
 * internamente, quindi non c'è esposizione di credenziali — ma il
 * server action custom (lib/newsletter-actions.ts, lib/brevo.ts) non è
 * più nel percorso per questo form specifico.
 *
 * Motivo: il flusso double opt-in via API dedicata
 * (POST /v3/contacts/doubleOptinConfirmation) risultava bloccato lato
 * Brevo con errore "An active DOI template does not exist", causa non
 * confermata (sospetto piano Brevo insufficiente). Il modulo nativo Brevo,
 * configurato con "Nessuna email di conferma" (single opt-in, coerente
 * con la decisione temporanea in lib/brevo.ts), funziona correttamente e
 * aggiunge il contatto a "Newsletter Narè" (lista #3) immediatamente.
 *
 * Verificato in produzione: submit con email reale → contatto compare in
 * Brevo > Contatti > Newsletter Narè con stato "Iscritto".
 *
 * Stile: il form ha l'aspetto di default di Brevo (non il design system
 * Narè) — personalizzabile in futuro dall'editor del modulo su Brevo, o
 * sostituibile di nuovo dal form custom (components/NewsletterFormShell.tsx,
 * lib/newsletter-actions.ts) quando/se il DOI verrà sbloccato lato Brevo.
 *
 * lib/newsletter-actions.ts e lib/brevo.ts restano nel codice, non
 * cancellati: sono ancora usati dal form compact di Home e MobileNav
 * (NewsletterFormShell), e pronti per un eventuale ripristino qui.
 */
export function BrevoNewsletterIframe() {
  return (
    <iframe
      width="540"
      height="305"
      src="https://4ff37b76.sibforms.com/v2/serve/MUIFAOJJWZhFLsWGRSxQsP9BV6BXnUDrZWTetT7YKcDH_QXknsu9Mi2KGYf9qB_t8UQEArCeFjTMJ-4AX10ZcknuCytMMaeSGckQIpmiXXUMc4qmT3lk6sVQmCA38I2PP3Yxyg_KZAKYiThq2XbKmvoJbJThKMZmt6fV5uyLdCBBbFhlxZWlX6ZK1AXc3u64Bg_49dEv5Pu0Xi-rxw=="
      frameBorder="0"
      scrolling="auto"
      allowFullScreen
      title="Iscrizione newsletter Narè"
      style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}
    />
  );
}
