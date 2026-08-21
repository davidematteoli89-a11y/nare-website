# NARÈ WEBSITE — FASE 10
## Final QA + Dominio Definitivo + Go-Live

Data: 21 agosto 2026
Commit di riferimento: `c4ceb27` (push confermato dall'utente, deploy Vercel `dpl_3eo8raBBZrZUPVbjopA63wTqYVau`, READY, production)

---

## 1. Funzionamento congelato

Nessuna nuova feature introdotta in questa fase. Il lavoro svolto è stato: audit pre-go-live, un fix trovato e già corretto in Fase 9 post-deploy (H1), aggiornamento dei dati legali reali forniti dal cliente, verifica del deploy, cookie audit reale, mobile QA parziale. Nessuna modifica a aiDady, nessuna integrazione Apify, nessuna feature Learning, nessun ecommerce/booking.

## 2. Audit pre-go-live su tutte le route

Eseguito (Fase 10B, poi ri-verificato dopo il push mancante scoperto in questa fase — vedi punto 3). Route verificate in produzione sul deploy corrente (`c4ceb27`): `/`, `/meloproduco`, `/ricette`, `/ricette/brioche-al-burro`, `/cristina`, `/cristina-in-rai`, `/incontri`, `/newsletter`, `/privacy`, `/cookie`. Tutte rispondono 200, contenuto coerente, H1 presente su tutte.

## 3. Problema scoperto e risolto: push mancante

Durante questa fase è emerso che 3 commit erano fermi in locale e mai pushati su GitHub (`5a245f8` fix H1, `872f0da` report, `c4ceb27` dati legali Fase 10F) — per questo `/cristina-in-rai` e `/incontri` mostravano ancora `h1: 0` in produzione durante i primi controlli di questa fase. Non era quindi un bug di codice residuo, ma un deploy non aggiornato. Ho segnalato il problema e chiesto conferma prima di eseguire qualunque push (azione con effetto pubblico); l'utente ha eseguito il push manualmente. Verificato dopo il push: `origin/main` allineato a `c4ceb27`, deploy Vercel READY (build 11s, nessun errore), H1 presente su tutte le route controllate, dati legali reali presenti su `/privacy` e `/cookie`.

## 4. Dominio definitivo

**NON eseguito.** Come confermato dall'utente nel round di chiarimento a inizio Fase 10 ("Non ancora acquistato/deciso"), non è stato acquistato né collegato alcun dominio. Il sito resta su `nare-website.vercel.app`. Non ho acquistato autonomamente alcun dominio, come da vincolo esplicito dello spec.

## 5. QA dominio

**N/A** — nessun dominio da verificare (vedi punto 4).

## 6. Brevo — dominio email

**NON eseguito.** L'utente ha indicato di voler decidere il mittente Brevo dopo aver collegato il dominio. Il mittente attivo resta un indirizzo Gmail personale (`davide.matteoli89@gmail.com`), non autenticato su dominio proprio (DKIM/SPF assenti). Nessuna azione DNS eseguita, nessun secret mostrato.

## 7. Contenuti legali — Privacy/Cookie

**Aggiornati con dati reali forniti dal cliente** (Fase 10F, confermato in produzione al punto 3): titolare Cristina Nigrelli, Via San Donato 79, 56028 San Miniato (PI), email `cristinanaturopata@gmail.com`. Questi NON sono dati inventati — sono stati forniti esplicitamente dall'utente in chat il 21 agosto 2026.

Restano **esplicitamente `[DA VALIDARE]`**, non compilati con testo generico:
- base giuridica dettagliata del trattamento;
- periodo di conservazione dei dati;
- trasferimento extra-UE verso Brevo e relative garanzie contrattuali (SCC);
- elenco completo e modalità di esercizio dei diritti dell'interessato.

Inoltre è documentato che il titolare è oggi persona fisica (non ancora titolare di Partita IVA) — punto che andrà aggiornato quando la P.IVA sarà attiva.

**Questo resta un GO-LIVE BLOCKER per lo spec di questa fase**: il testo legale non è stato validato da un consulente privacy/legale, solo compilato con dati reali ma non professionalmente revisionato.

## 8. Cookie — audit finale reale (DevTools)

Eseguito su `/`, `/newsletter`, `/cristina-in-rai` in produzione: `document.cookie` vuoto, `localStorage`/`sessionStorage` vuoti su tutte e tre. Verificato via network requests reali (non solo lettura statica del codice) che l'HTML servito non contiene alcun `<link>` a `fonts.googleapis.com`/`fonts.gstatic.com` (i font Fraunces/Inter sono serviti dal dominio proprio via self-hosting `next/font/google`, confermato: richieste `.woff2` tutte su `nare-website.vercel.app/_next/static/...`). Nessuno script di terze parti non dichiarato. Coerente con quanto scritto in `/cookie`.

## 9. Mobile QA reale — LIMITAZIONE DA DICHIARARE ESPLICITAMENTE

**Non è stato possibile ottenere i 5 breakpoint esatti richiesti (375/430/768/1024/1440px).** Lo strumento di controllo browser disponibile in questo ambiente (`resize_window`) non produce un viewport reale controllabile con precisione: richieste a 230px, 320px e 375px hanno prodotto sistematicamente un `window.innerWidth` di 606px — un limite tecnico dell'ambiente sandbox (verosimilmente una finestra minima imposta dal sistema), non qualcosa risolvibile cambiando i parametri della chiamata. Ho tentato più strategie (tab nuovi, resize prima/dopo la navigazione, valori più piccoli del target) senza ottenere un valore diverso da 606px o 1920px (default).

**Cosa è stato realmente verificato** (a 606px, un viewport mobile-range plausibile ma non uno dei 5 richiesti): nessun overflow orizzontale su `/`, `/newsletter`, `/meloproduco`, `/ricette/brioche-al-burro`, `/cristina`; H1 presente su tutte; form newsletter con campo email e submit larghi (576×44px, ampiamente sopra soglia touch target), checkbox di consenso 16×16px (sotto la soglia WCAG di 44px raccomandata per un tap target isolato, ma affiancata da un'etichetta testuale cliccabile ampia — pattern comune, non un blocco ma un miglioramento futuro consigliato).

**Cosa NON è stato verificato**: comportamento preciso a 375px (iPhone SE/mini), 430px (iPhone Pro Max), 768px (tablet portrait), 1024px (tablet landscape/laptop piccolo), 1440px (desktop). Questo punto **non viene dichiarato PASS** — la sezione 10H dello spec richiede esplicitamente questi 5 breakpoint e non li ho ottenuti con affidabilità. Questa è la stessa filosofia già applicata nella Fase 9 post-deploy per il build font: non fingere una verifica che non è stata davvero eseguita.

## 10. Real device test

**Non eseguito** — nessun dispositivo fisico reale è stato usato in questa sessione, solo browser automation in ambiente sandbox. Dichiarato esplicitamente: quanto sopra (punto 9) è simulato via resize di finestra browser, non un vero emulatore mobile né un device reale.

## 11. Newsletter — test finale

**Non ripetuto in questa fase** su dominio definitivo (non esiste, vedi punto 4). Il flusso è stato validato end-to-end nella coda della Fase 8 (single opt-in + email di conferma reale, confermato dall'utente "funziona tutto"), sul dominio Vercel attuale. Nessun nuovo test con indirizzo email di terzi eseguito, coerente con l'istruzione di non usare email non controllate.

## 12. Public API — audit finale

Verificato in produzione: `/ricette/brioche-al-burro` mostra dati reali dall'API aiDady. `/incontri` mostra correttamente lo stato "in preparazione" quando non ci sono incontri pubblicati (comportamento atteso, non errore). Nessuna regressione.

## 13. RAI — audit finale

Nessun video con diritti non confermati pubblicato — tutti gli interventi RAI restano `videoType: "none"` (dormiente), coerente con lo stato dei diritti non ancora confermato dal cliente. Nessun link Mega. Nessuna modifica in questa fase.

## 14. Immagini — audit

Nessuna immagine stock, nessuna immagine AI, nessuna foto di minori. Le immagini reali fornite dal cliente restano quelle già verificate in Fase 4B.

## 15. Performance / Accessibility / Link check / SEO — pass finali

Nessun nuovo audit quantitativo (Lighthouse) eseguibile in questo ambiente sandbox — stesso limite già dichiarato in Fase 9. Verificato qualitativamente: font con `display: swap`, nessun link rotto rilevato nelle route controllate, canonical/OG/JSON-LD coerenti (invariati rispetto a Fase 9, nessuna regressione introdotta in questa fase).

## 16. Search Console

**Non eseguito** — nessuna azione DNS/account reale eseguita, coerente col vincolo esplicito ("NON fingere configurazione se non eseguita realmente"). Non applicabile finché non esiste un dominio definitivo.

## 17. Vercel Analytics — verifica

Già verificato attivo in Fase 9 post-deploy (`window.va` presente, nessun errore console). Non ri-testato quantitativamente in questa fase (richiederebbe traffico reale accumulato nel tempo).

## 18. Repository — pulizia

Verificato (Fase 10V, invariato): nessun secret in repo, nessun materiale originale RAI, nessuna cartella `_materiali-fase4b`, nessun `.env` committato. Aggiunta in questa fase l'esclusione di `/Supabase/` (file di lavoro personale non pertinente, mai stato tracciato, ora esplicitamente ignorato).

## 19. Backup materiali

Nessuna cancellazione di sorgenti video RAI eseguita in questa fase — verificato che non è stata rimossa alcuna fonte originale.

## 20. Build / lint / tsc finali

Verificato tramite build log Vercel del deploy `dpl_3eo8raBBZrZUPVbjopA63wTqYVau`: completato in 11s, nessun errore (solo un warning npm irrilevante su `allow-scripts`). Non rieseguito localmente in sandbox in questa fase (font Google bloccati di rete, limite già noto e documentato dalla Fase 9) — il build reale su Vercel è la fonte di verità ed è pulito.

## 21. Commit / push / deploy finali

Push eseguito dall'utente (commit `c4ceb27`), deploy Vercel automatico completato con successo, confermato READY/production. Nessun commit aggiuntivo necessario in questa fase (nessuna modifica di codice oltre quanto già in `c4ceb27`).

## 22. Smoke test produzione finale

Eseguito sulle route indicate al punto 2: tutte 200, H1 presenti, dati legali reali confermati su `/privacy`/`/cookie`, nessun cookie/localStorage non dichiarato, font self-hosted correttamente (nessuna chiamata a Google Fonts nel markup servito).

## 23. Checklist go-live (PASS / BLOCKED / N/A)

| # | Voce | Stato |
|---|---|---|
| 1 | Funzionamento congelato, nessuna nuova feature | PASS |
| 2 | Audit pre-go-live tutte le route | PASS |
| 3 | Deploy production allineato al codice più recente | PASS (dopo push) |
| 4 | Dominio definitivo collegato | BLOCKED (non deciso/acquistato) |
| 5 | QA dominio definitivo | N/A (dipende da #4) |
| 6 | Brevo — dominio email autenticato (DKIM/SPF) | BLOCKED (mittente Gmail non autenticato) |
| 7 | Testi legali Privacy/Cookie validati da consulente | BLOCKED (dati reali ma non validati legalmente) |
| 8 | Cookie audit reale (DevTools) | PASS |
| 9 | Mobile QA sui 5 breakpoint richiesti | BLOCKED (limite tecnico ambiente, solo 606px verificabile) |
| 10 | Real device test documentato | N/A (nessun device reale disponibile in questo ambiente) |
| 11 | Newsletter test finale su dominio reale | N/A (dipende da #4) |
| 12 | Public API — nessuna regressione | PASS |
| 13 | RAI — nessun contenuto a diritti non confermati | PASS |
| 14 | Immagini — nessuno stock/AI/minori | PASS |
| 15 | Performance/accessibility/link/SEO pass qualitativi | PASS |
| 16 | Search Console configurata realmente | N/A (dipende da #4) |
| 17 | Vercel Analytics attivo | PASS |
| 18 | Repository pulito (no secrets/materiali) | PASS |
| 19 | Backup materiali RAI non compromesso | PASS |
| 20 | Build/lint/tsc puliti (Vercel) | PASS |
| 21 | Commit/push/deploy finali completati | PASS |
| 22 | Smoke test produzione finale | PASS |

## 24. Sintesi problemi bloccanti (HIGH / GO-LIVE BLOCKER)

1. **Dominio definitivo non collegato** — il sito resta su un sottodominio Vercel.
2. **Mittente email Brevo non autenticato su dominio proprio** — usa un Gmail personale, deliverability non professionale, DKIM/SPF assenti.
3. **Testi legali Privacy/Cookie non validati da un consulente** — contengono dati reali ma non un testo legale definitivo (base giuridica, conservazione, trasferimento extra-UE, diritti dell'interessato restano `[DA VALIDARE]`).
4. **Mobile QA sui breakpoint richiesti non completabile in questo ambiente** — limite tecnico dello strumento di automazione browser disponibile, non del codice del sito. Richiede un test manuale reale (dispositivo fisico o DevTools locali del cliente) prima di dichiarare il sito pronto su mobile con certezza sui breakpoint esatti.

## 25. Azioni manuali necessarie prima di un futuro go-live

1. Decidere e acquistare il dominio definitivo, collegarlo su Vercel, aggiornare `NEXT_PUBLIC_SITE_URL`.
2. Autenticare il dominio email in Brevo (DKIM/SPF) e cambiare il mittente del template dal Gmail personale a un indirizzo sul dominio proprio.
3. Far validare i testi di `/privacy` e `/cookie` da un consulente legale/privacy, sostituendo i placeholder `[DA VALIDARE]` residui.
4. Eseguire una vera mobile QA sui 5 breakpoint richiesti — su un dispositivo reale o con DevTools locali del cliente (questo ambiente sandbox non lo consente in modo affidabile).
5. Dopo il dominio: eseguire la checklist Google Search Console già documentata in Fase 9 (punto 23 di quel report).
6. Eseguire un test newsletter reale sul dominio definitivo con un indirizzo email controllato.

## 26. Verdetto

**NARÈ WEBSITE — GO-LIVE BLOCKED**

Motivazione, secondo la regola esplicita di questa fase: APPROVED non può essere dichiarato mentre privacy/cookie hanno ancora contenuti legali non validati, il dominio non è configurato, il mittente Brevo resta Gmail/non autenticato, o la mobile QA non è stata completata. Tutte e quattro queste condizioni sono vere oggi. Il codice e il deploy sono tecnicamente sani (build pulito, nessuna regressione, dati reali dove disponibili, nessun contenuto inventato), ma le condizioni di business/legali/infrastrutturali per il lancio pubblico non sono ancora soddisfatte.

NON iniziare alcuna nuova feature.
