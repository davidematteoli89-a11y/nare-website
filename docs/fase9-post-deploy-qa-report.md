# FASE 9 — POST DEPLOY QA

Data: 21 agosto 2026
Deployment verificato: `dpl_3oGrn7hd9LrKLvYPH6xTPcQ4n5F3` (commit `4ee5a3a`, poi confermato coerente anche col fix successivo `5a245f8`)

## Deployment

**READY.** Build completato in 16s, tutte le 20 route generate correttamente (static + dynamic), nessun errore, nessun warning rilevante nei log di build Vercel.

## Build font (Fraunces / Inter / next/font/google)

**RIUSCITO.** Nessun errore relativo a `fonts.googleapis.com` nei log di build su Vercel (a differenza del sandbox, che non ha accesso di rete a Google Fonts). Verificato live via DOM in produzione:
- `getComputedStyle(h1).fontFamily` → `"Fraunces, \"Fraunces Fallback\""`
- `getComputedStyle(body).fontFamily` → `"Inter, \"Inter Fallback\", ui-sans-serif, system-ui, sans-serif"`

Entrambi i font reali sono applicati, non i fallback di sistema. Nessun rollback necessario.

## QA route

Verificate tramite fetch diretto e/o browser reale: `/`, `/meloproduco`, `/ricette`, `/ricette/brioche-al-burro`, `/guide`, `/incontri`, `/ritiri`, `/famiglie`, `/in-viaggio`, `/cristina`, `/cristina-in-rai`, `/newsletter`, `/privacy`, `/cookie`, `/robots.txt`, `/sitemap.xml`. Tutte rispondono 200, contenuto coerente con quanto atteso dalla Fase 9 (canonical/OG aggiornati, copy `/privacy` e `/cookie` aggiornato, nessuna pagina rotta).

**Nota sulla prima verifica di `/sitemap.xml` e `/robots.txt`**: al primo fetch mostravano `http://localhost:3000` invece del dominio reale. Indagato: era una copia CDN stantia (cache ISR/edge non ancora invalidata su quell'edge node), non un problema di env o di codice — un secondo fetch con cache-buster (`?cachebust=1`) ha mostrato immediatamente `https://nare-website.vercel.app` corretto su entrambe. `NEXT_PUBLIC_SITE_URL` è configurata correttamente su Vercel, confermato anche da tutti i canonical delle altre pagine (mai stati in dubbio, sempre corretti). Nessuna azione necessaria — si è risolto da solo con la naturale invalidazione della cache.

## Heading semantics (SectionHeader)

**Problema confermato e corretto.** Verificato via DOM live (`document.querySelectorAll('h1').length`) che `/ricette` e `/incontri` avevano **zero** `<h1>` in pagina (usavano `SectionHeader`, che renderizzava sempre `<h2>`, come unica intestazione). Stesso pattern strutturale su `/cristina-in-rai`.

Fix minimo applicato (commit `5a245f8`): `SectionHeader` ha ora una prop opzionale `as` (`"h1" | "h2"`, default `"h2"` — zero impatto sulle pagine che già hanno un H1 proprio e usano `SectionHeader` come sotto-sezione, es. `/meloproduco`, `/ritiri`). Le tre pagine interessate ora passano `as="h1"`. Dimensione visiva invariata (`text-h2` in entrambi i casi) — cambia solo il tag HTML semantico, nessuna regressione visiva.

## Analytics

**Caricata correttamente.** Verificato in produzione: `window.va` presente sulla pagina, nessun errore console legato al caricamento dello script Vercel Analytics.

## Security headers

**Presenti e corretti**, verificati con fetch diretto degli header di risposta in produzione:
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(), geolocation=()`

## Regressioni

- **Newsletter**: nessuna regressione. Verificato via DOM live su `/newsletter`: 1 `<form>` reale, campo email, campo nome opzionale, checkbox di consenso, pulsante "Iscriviti" — tutti presenti e corretti (`NewsletterFormShell` renderizzato normalmente). Un primo controllo aveva sollevato un falso allarme per un link raw a un dominio `sibforms.com` visto nell'estrazione testuale della pagina: verificato che si trattava solo di un artefatto dell'estrazione (non riferito al form reale, che usa la Server Action come da Fase 8), non un iframe Brevo effettivamente presente nel DOM.
- **Public API aiDady**: nessuna regressione. `/ricette/brioche-al-burro` mostra ingredienti/procedimento reali dall'API. `/` mostra correttamente la ricetta pubblicata e lo stato "Nessun incontro pubblicato al momento" per gli incontri (comportamento atteso, non un errore — la lista è vuota ma l'API risponde). `/incontri` mostra correttamente lo stato "primi Narè Incontri stanno arrivando".
- **Console errori**: nessun errore rilevato nella console del browser sulle pagine ispezionate.
- **Layout shift**: non misurato quantitativamente (nessun tool CLS disponibile in questo ambiente), ma font con `display: "swap"` configurato in `lib/fonts.ts` per entrambi i font, che è la pratica raccomandata per minimizzare lo shift.

## Problemi HIGH / MEDIUM / LOW residui

**HIGH**
- Nessuno nuovo. I due HIGH già noti dal report Fase 9 principale restano: mittente Brevo non autenticato su dominio proprio, testi legali `/privacy`/`/cookie` non definitivi.

**MEDIUM**
- Risolto in questo giro: mancanza di H1 su `/ricette`, `/incontri`, `/cristina-in-rai`.
- Residuo dal report precedente: nessun metadata `twitter:*` (Open Graph copre la maggior parte dei casi — verificato peraltro in produzione che `twitter:card`/`twitter:title`/`twitter:description` sono comunque presenti su molte pagine, generati automaticamente da Next.js Metadata a partire da `openGraph`, quindi il gap è minore di quanto stimato nel report precedente).

**LOW**
- Nessuna variazione rispetto al report Fase 9 principale.

## AZIONI MANUALI — invariate rispetto al report Fase 9 precedente

Nessuna nuova azione manuale introdotta da questo giro di QA. Restano valide quelle del report principale: completare i testi legali con consulenza reale, autenticare il dominio email Brevo prima del go-live definitivo, collegare il dominio definitivo quando disponibile.

## Verdetto

**READY FOR PHASE 10**

Il deployment è READY, il build con Fraunces/Inter è confermato riuscito in produzione (nessun rollback necessario), tutte le route rispondono correttamente, i security headers e Vercel Analytics sono attivi, non ci sono regressioni su newsletter o Public API aiDady. L'unico problema MEDIUM rilevato (heading semantics) è stato corretto con un intervento minimo e verificato via build pulito. Le condizioni sospensive per il go-live effettivo (testi legali, autenticazione dominio email Brevo, dominio definitivo) restano quelle già documentate nel report Fase 9 principale — non bloccano l'avvio della Fase 10, ma restano da completare prima del lancio pubblico reale.

NON è stata iniziata la Fase 10.
