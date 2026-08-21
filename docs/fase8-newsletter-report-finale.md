# Fase 8 — Newsletter + Brevo — Report finale

Data chiusura: 21 agosto 2026

## Architettura finale (in produzione)

Un solo flusso di iscrizione, usato ovunque nel sito (Home, MobileNav, `/newsletter`):

```
browser → <NewsletterFormShell> → Server Action (lib/newsletter-actions.ts)
        → Brevo API (lib/brevo.ts, server-only)
```

- **Iscrizione**: single opt-in tramite `POST /v3/contacts` (`subscribeSingleOptIn`). Il contatto viene aggiunto immediatamente alla lista "Newsletter Narè" su Brevo, senza richiedere un click di conferma.
- **Email di conferma**: dopo ogni iscrizione **nuova** (non per contatti già iscritti), viene inviata una singola email transazionale tramite `POST /v3/smtp/email` (`sendWelcomeEmail`), usando il template Brevo "Conferma iscrizione Narè". Questo endpoint è indipendente dal meccanismo di double opt-in e non richiede alcun flag "DOI template".
- La API key Brevo (`BREVO_API_KEY`) resta esclusivamente server-side, mai esposta al client (nessuna variabile `NEXT_PUBLIC_*`).
- Duplicati gestiti in modo silenzioso e senza enumeration: un'email già iscritta riceve lo stesso messaggio di successo generico, senza rivelare che il contatto esisteva già, e senza inviare una nuova email di conferma.
- Anti-abuse: honeypot invisibile + controllo tempo minimo di compilazione.

## Perché non double opt-in (deviazione dalla preferenza originaria)

La preferenza iniziale di Fase 8 era double opt-in. Il flusso `POST /v3/contacts/doubleOptinConfirmation` è stato implementato e testato, ma ha restituito sistematicamente `400 — "An active DOI template does not exist"`, anche dopo:
- verifica/riverifica del mittente del template,
- ricreazione della configurazione DOI tramite il wizard Brevo (Moduli → Iscrizione),
- conferma che il template risultava "Attiva".

Un secondo tentativo di risalvare la configurazione del modulo Brevo con "Email di conferma doppia" ha sbloccato temporaneamente il DOI (un'email di conferma è arrivata correttamente in un test), ma il problema si è ripresentato in modo non deterministico. Per non lasciare la newsletter bloccata a tempo indeterminato, è stata presa la decisione esplicita (non un fallback automatico) di passare a **single opt-in + email di conferma semplice**, che garantisce:
- iscrizione sempre funzionante e immediata,
- un riscontro via email reale all'utente (non finto — Step 8S rispettato),
- nessuna dipendenza dal comportamento non deterministico del template DOI lato Brevo.

## Verifica end-to-end (produzione)

- Commit finale in produzione: `c3abb7b` (deployment `dpl_97AhLryY1yJtfFBiDXiw9xyicGGk`, stato READY).
- Log runtime Vercel confermano la Server Action in esecuzione su `/newsletter` senza errori dopo la configurazione di `BREVO_WELCOME_TEMPLATE_ID`.
- Test reale confermato dal cliente: iscrizione da `/newsletter` con email reale → email di conferma ricevuta.

## Configurazione richiesta (env Vercel)

| Env | Uso | Stato |
|---|---|---|
| `BREVO_API_KEY` | Autenticazione API Brevo | Configurata |
| `BREVO_NEWSLETTER_LIST_ID` | Lista "Newsletter Narè" | Configurata |
| `BREVO_WELCOME_TEMPLATE_ID` | Template email di conferma semplice | Configurata (21 ago 2026) |
| `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` | Non usata dal flusso attivo, mantenuta per un eventuale ripristino futuro del DOI | Presente, non richiesta |

## Codice mantenuto per un eventuale ripristino futuro del DOI

`subscribeDoubleOptIn` e `getBrevoDoubleOptInConfig` restano in `lib/brevo.ts`, non referenziati dal flusso attivo. Se in futuro Brevo risolverà la causa del comportamento non deterministico del flag DOI, il ripristino richiede solo di richiamare quelle funzioni da `lib/newsletter-actions.ts` al posto delle attuali.

## Verdetto

**PRONTO per la Fase 9.**

Il flusso di iscrizione newsletter è funzionante end-to-end in produzione, verificato con un test reale, coerente con i vincoli di sicurezza e privacy stabiliti a inizio Fase 8 (API key mai esposta, nessuna finzione di conferma, nessuna enumeration di duplicati). L'unica deviazione rispetto alla pianificazione originaria — single opt-in invece di double opt-in puro — è stata una decisione esplicita e motivata, non un compromesso silenzioso, ed è completamente reversibile senza refactoring.
