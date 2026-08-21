# NARÈ WEBSITE — FASE 9 COMPLETATA
## SEO finale + Analytics + Privacy/Cookie + Go-Live Readiness

Data: 21 agosto 2026
Commit di riferimento: `2320994`

---

## 1. SEO audit

Audit completo di tutte le route pubbliche (title, description, canonical, Open Graph, H1, indexability). Problemi trovati e classificazione PRIMA dei fix:

**HIGH**
- 9 pagine con canonical/OG hardcodati su `https://nare-website.vercel.app` invece di derivare da `NEXT_PUBLIC_SITE_URL` (guide, incontri, ritiri, famiglie, in-viaggio, cristina, cristina-in-rai, newsletter, più il `thumbnailUrl` nel JSON-LD di cristina-in-rai). Un cambio dominio avrebbe lasciato 9 pagine con URL sbagliati. → **Risolto**.
- Home, `/meloproduco`, `/ricette` senza alcun canonical/Open Graph proprio. → **Risolto**.
- `/privacy`, `/cookie` senza description/canonical. → **Risolto**.

**MEDIUM**
- Nessuna pagina ha metadata `twitter:*`. Non implementato: Open Graph è sufficiente per la maggior parte dei client di sharing (incluso X/Twitter, che fa fallback su OG in assenza di Twitter Card); aggiungerlo ora senza un'immagine social dedicata avrebbe richiesto inventare asset non forniti.
- `/ricette` e `/incontri` (liste) non hanno un `<h1>` diretto — usano `SectionHeader`, il cui markup interno non è stato verificato in questa fase. Da controllare se rende effettivamente un `<h1>` semanticamente corretto.

**LOW**
- `/newsletter/conferma` senza canonical/OG proprio — pagina ormai orfana (nessun traffico reale col flusso single opt-in attivo), lasciata come da task Fase 8, non impattante.
- Nessun `rel="next"/"prev"` sulla paginazione di `/ricette`.

## 2. Canonical (Step 9B)

Nessun canonical punta a `localhost` o a URL di preview/deployment hash in nessuna pagina verificata. Tutti i canonical (13 pagine + Home) ora derivano da `process.env.NEXT_PUBLIC_SITE_URL` (con fallback `http://localhost:3000` solo se la env manca — comportamento voluto per non rompere build locali). Il passaggio al dominio definitivo richiede solo di cambiare quella env var su Vercel: nessun altro file da toccare.

## 3. Sitemap

`/sitemap.xml` include tutte le route statiche pubbliche corrette, più ricette e incontri pubblicati dinamicamente (limite 50 ciascuno, coincide col limite reale dell'API). Wrappato in try/catch: se l'API aiDady è down, quella sezione ritorna `[]` invece di far fallire l'intera sitemap — verificato nel codice, comportamento corretto. `/guide/[slug]` e `/ritiri/[slug]` correttamente esclusi (nessun contenuto reale dietro). Nessuna modifica necessaria in questa fase.

## 4. Robots

`/robots.txt` corretto: `allow: /`, `disallow: /cerca` (coerente col noindex esplicito di quella pagina), sitemap referenziata correttamente via `NEXT_PUBLIC_SITE_URL`. Nessun riferimento a localhost. Nessuna modifica necessaria.

## 5. Structured data

- **Recipe** (`/ricette/[slug]`): già presente, solo campi reali dal DTO pubblico (nessun prepTime/nutrition/rating inventato) — invariato, corretto.
- **Event** (`/incontri/[slug]`): già presente, emesso solo con sessione futura reale, niente location/organizer inventati — invariato, corretto.
- **VideoObject** (`/cristina-in-rai`): già presente ma dormiente (tutti gli interventi hanno `videoType: "none"` oggi) — thumbnailUrl ora usa `NEXT_PUBLIC_SITE_URL` invece di hardcode.
- **WebSite** (Home/root layout): **aggiunto** in questa fase, senza SearchAction (nessuna ricerca reale dietro `/cerca`).
- **Person** (Cristina): non aggiunto — richiederebbe dati verificati aggiuntivi (sameAs, pagina ufficiale) non forniti. Decisione di non inventare campi.
- **Article** (Guide): non applicabile, nessun contenuto reale esiste ancora.

## 6. Open Graph

`openGraph.title/description/url/type` ora presenti su tutte le pagine con contenuto reale, `siteName: "Narè"` e `locale: "it_IT"` ereditati dal root layout. Nessun `twitter:*` aggiunto (vedi punto 1, MEDIUM). Nessuna immagine OG generica di fallback creata: le pagine senza immagine reale (la maggior parte) restano senza `og:image` piuttosto che mostrare una foto non editoriale — coerente con l'istruzione esplicita di non inventare foto.

## 7. Favicon / brand assets

`app/favicon.ico` esistente (convenzione Next.js) invariato. Aggiunto `metadata.icons` (icon + apple-touch-icon) puntando al logo Narè reale già fornito (`public/images/branding/logo-nare.png`, 250×250px) — file originale non alterato, solo referenziato. Nessun manifest.json creato (il sito non è una PWA, non necessario per questa fase).

## 8. Analytics — scelta

**Vercel Web Analytics**, non GA4. Motivazione: nessun cookie, nessun identificatore persistente lato client, nessuna richiesta di consenso cookie preventivo in UE (a differenza di GA4), nessun ID da gestire via env, integrazione ufficiale nativa Next.js. Per un MVP che non ha ancora bisogno di funnel/segmentazione avanzata, sufficiente.

## 9. Analytics — implementazione

Installato `@vercel/analytics`, componente `<Analytics />` aggiunto nel root layout (`app/layout.tsx`). Nessun ID hardcodato: si attiva automaticamente sul progetto collegato a Vercel, sia in produzione che in preview. Nessun caricamento condizionato a consenso necessario per questo strumento specifico (non traccia con cookie/identificatori persistenti).

## 10. Cookie audit

Verificato sul codice sorgente reale (non assunto): nessun `document.cookie`, nessun `localStorage`/`sessionStorage` in tutto `app/`/`lib/`/`components/`. Nessuno script di tracciamento di terze parti (no GA/gtag/Meta pixel/Hotjar/Clarity). Brevo (newsletter) è interamente server-side — nessuno script Brevo nel browser, nessun cookie Brevo. Unico iframe esterno: YouTube in modalità privacy-enhanced (`youtube-nocookie.com`), montato solo su click esplicito dell'utente, oggi dormiente (nessun intervento RAI ha ancora `videoType: "youtube"`). Con l'aggiunta di Vercel Web Analytics (punto 9): nessun cookie introdotto.

## 11. Cookie consent behavior

**Nessun banner di consenso cookie implementato**, per scelta motivata: il sito non installa cookie non tecnici né di profilazione al caricamento. Se in futuro verranno introdotti strumenti che li richiedono (es. un tool di marketing, un embed diverso), la pagina `/cookie` e la necessità di un banner andranno rivalutate PRIMA di attivarli — questo vincolo è documentato esplicitamente nel commento del file `/cookie`.

## 12. `/cookie`

Riscritta con le categorie tecniche realmente presenti (cookie tecnici: nessuno; analytics: Vercel Web Analytics; newsletter: Brevo server-side; video: YouTube privacy-enhanced). Placeholder `[DA VALIDARE]` su due punti che richiedono conferma legale: qualificazione di Vercel Web Analytics come non-profilante, e necessità di consenso preventivo per l'embed YouTube. Placeholder `[DA INSERIRE]` per titolare/email di contatto. Nessun testo legale inventato spacciato per definitivo.

## 13. `/privacy`

Riscritta con struttura pronta a ricevere i dati legali reali. Sezione dedicata al trattamento dati newsletter (email, nome opzionale, consenso, trasferimento a Brevo, conferma semplice, diritto di cancellazione via link in ogni email). Sezione analytics. Placeholder `[DA INSERIRE: titolare del trattamento / indirizzo / email privacy]` e `[DA VALIDARE: base giuridica dettagliata, periodo di conservazione, trasferimento extra-UE verso Brevo e garanzie contrattuali, elenco diritti dell'interessato]`. Non è un testo legale definitivo — dichiarato esplicitamente in pagina e nel commento del file.

## 14. Newsletter consent audit

Verificato conforme, nessuna modifica al flusso: checkbox di consenso mai preselezionata, link a `/privacy` presente, copy del consenso chiaro e non ambiguo (un solo scopo dichiarato), email obbligatoria, nome facoltativo, flusso single opt-in + email di conferma semplice coerente con quanto documentato in `lib/brevo.ts` (Fase 8). Solo la docstring del componente è stata aggiornata (era rimasta riferita al vecchio double opt-in).

## 15. Brevo sender readiness

**Debito HIGH per il go-live definitivo**: il mittente delle email Brevo (template "Conferma iscrizione Narè") usa oggi un indirizzo Gmail personale (`davide.matteoli89@gmail.com`), non un dominio Narè autenticato. Prima del go-live definitivo serve: un dominio Narè attivo, un mittente su quel dominio (es. `newsletter@` o `ciao@dominio-nare.it`), autenticazione DKIM/SPF configurata lato DNS secondo le istruzioni Brevo. Non configurabile ora: non esiste ancora un dominio definitivo (vedi punto 16). Nessuna azione DNS eseguita in questa fase, come da vincolo esplicito.

## 16. Dominio readiness

Nessun dominio acquistato o configurato in questa fase (come da vincolo). Il sito è predisposto affinché il passaggio richieda solo:
1. Aggiungere il dominio custom su Vercel (Project → Settings → Domains).
2. Configurare i record DNS richiesti da Vercel presso il registrar del dominio.
3. Aggiornare `NEXT_PUBLIC_SITE_URL` su Vercel con il nuovo dominio.
4. Redeploy (anche solo "Redeploy" dall'ultimo commit, non serve un nuovo push).
5. Verificare canonical/sitemap/robots/Open Graph sul dominio nuovo (tutti derivano dalla env, quindi si aggiornano automaticamente — verificato in questa fase che non ci sono più hardcode residui).
6. Configurare il dominio email Brevo sul nuovo dominio (vedi punto 15) — DKIM/SPF, poi aggiornare il mittente del template.
7. Sottomettere la sitemap aggiornata su Google Search Console (vedi punto 23).

## 17. Security headers

Aggiunti in `next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Nessuna CSP: richiede un audit approfondito di ogni script/embed/font esterno (incluso l'iframe YouTube oggi dormiente) per non rischiare di rompere il sito con una configurazione errata — deliberatamente rimandata a quando ci sarà modo di testarla con calma. Nessuna regressione: gli header aggiunti sono "sicuri per default" e non richiedono whitelisting di risorse specifiche.

## 18. External links

Un solo link `target="_blank"` in tutto il sito (`/cristina-in-rai`, "Fonte ufficiale"), già con `rel="noopener noreferrer"` corretto. Nessun link Mega pubblico, nessun link a video con diritti non confermati (i video RAI restano non pubblicati finché `videoType` è `"none"`). Nessuna modifica necessaria.

## 19. Performance

Nessuna azione invasiva in questa fase. Osservazioni: le immagini remote da aiDady (`resolvePublicImageUrl`) ritornano sempre `null` oggi (nessuna immagine remota realmente servita), quindi nessun rischio di `next/image` che tenti di ottimizzare URL non whitelisted in `next.config.ts` — quando aiDady inizierà a fornire URL immagine reali, andrà aggiunto `images.remotePatterns` di conseguenza. Nessuna dipendenza pesante aggiunta oltre `@vercel/analytics` (libreria minima, script asincrono). Non è stato eseguito un audit Lighthouse dedicato in questa fase (richiederebbe l'ambiente di produzione reale, non riproducibile in sandbox).

## 20. Font

Riattivato `next/font/google` (Fraunces + Inter) in `lib/fonts.ts`, sostituendo lo stack di font di sistema usato come fallback dalla Fase 1V. Il layout è stato adattato di conseguenza (le custom property CSS dei font ora arrivano da `.variable`, applicate come className sull'`<html>`, non più come style inline). **Il build con questi font non è verificabile in questo ambiente sandbox** (stesso blocco di rete verso `fonts.googleapis.com` documentato dalla Fase 1V) — tsc è pulito, e l'intero resto del sito è stato validato con un build completo isolando temporaneamente il problema font. **Il build reale su Vercel va verificato dopo il deploy**: se dovesse fallire per qualunque motivo diverso dalla rete, serve un rollback rapido di `lib/fonts.ts` e `app/layout.tsx` al commit precedente.

## 21. 404 / errors

Verificato: 404 globale brandizzata Narè (`app/not-found.tsx`) coerente col design system. `/ricette/[slug]` e `/incontri/[slug]` distinguono correttamente "contenuto non trovato" (→ 404 reale) da "API non disponibile" (→ empty state editoriale, mai un errore tecnico visibile). `/guide/[slug]` e `/ritiri/[slug]` sono skeleton che ritornano sempre 404 (corretto, nessun contenuto reale dietro). Nessuna pagina di errore Next.js di default visibile. Nessuna modifica necessaria.

## 22. Indexation readiness

Decisione ragionata (non noindex automatico): `/guide` resta indicizzabile nonostante non abbia contenuti reali oggi, perché comunica onestamente lo stato "in preparazione" con CTA verso contenuti reali (MeLoProduco, Ricette) — ha valore di navigazione, non è una pagina vuota ingannevole. `/cerca` resta noindex (già così, corretto: nessuna funzionalità di ricerca reale dietro). Nessun'altra pagina scarna identificata.

## 23. Google Search Console — checklist futura

Da eseguire quando il dominio definitivo sarà attivo (nessun account configurato in questa fase, come da vincolo):
1. Aggiungere la proprietà per il dominio definitivo in Search Console.
2. Verificare la proprietà tramite record DNS (TXT) presso il registrar.
3. Sottomettere `https://[dominio-definitivo]/sitemap.xml`.
4. Usare "Controllo URL" (Inspect URL) sulle pagine principali per forzare la scansione iniziale.
5. Monitorare il rapporto "Copertura" per errori di indicizzazione nelle settimane successive al go-live.
6. Ripetere la sottomissione sitemap se il dominio cambia di nuovo in futuro.

## 24. File modificati

`app/layout.tsx`, `app/cookie/page.tsx`, `app/privacy/page.tsx`, `app/guide/page.tsx`, `app/famiglie/page.tsx`, `app/cristina/page.tsx`, `app/in-viaggio/page.tsx`, `app/incontri/page.tsx`, `app/ritiri/page.tsx`, `app/newsletter/page.tsx`, `app/cristina-in-rai/page.tsx`, `app/meloproduco/page.tsx`, `app/ricette/page.tsx`, `components/NewsletterFormShell.tsx`, `lib/fonts.ts`, `next.config.ts`, `package.json`, `package-lock.json` (dipendenza `@vercel/analytics`). Più questo report e `docs/fase8-newsletter-report-finale.md` (creato a chiusura della fase precedente).

## 25. Build / lint / typecheck

- `npx tsc --noEmit`: pulito, 0 errori.
- `npm run lint`: pulito, 0 errori, 0 warning.
- `npm run build`: validato completo (tutte le 20 route, static + dynamic) con una versione temporanea di `lib/fonts.ts` a font di sistema, per isolare e confermare che TUTTO il resto del codice di questa fase (headers, analytics, JSON-LD, canonical, icons, pagine legali) compila senza errori. Il file reale con `next/font/google` è stato ripristinato subito dopo per il commit — il suo build va confermato su Vercel (vedi punto 20 e azioni manuali).

## 26. Commit

`2320994` — "Fase 9: SEO finale, analytics, privacy/cookie readiness, go-live prep" (19 file, 431 inserzioni, 86 rimozioni).

## 27. Push GitHub

**Non eseguito da questo ambiente** — il sandbox non ha credenziali GitHub configurate (limite noto, invariato dalla Fase 8). Il commit è locale. **Azione manuale richiesta**: `git push origin main` dalla tua macchina.

## 28. Deploy Vercel

**Non ancora avvenuto** — dipende dal push (punto 27). Una volta pushato, il deploy automatico da GitHub partirà come nelle fasi precedenti.

## 29. QA production

**Non ancora eseguibile** — richiede il deploy (punto 28) completato. Da fare dopo il deploy, sulle route indicate nello spec: `/`, `/meloproduco`, `/ricette`, `/ricette/brioche-al-burro`, `/guide`, `/incontri`, `/ritiri`, `/famiglie`, `/in-viaggio`, `/cristina`, `/cristina-in-rai`, `/newsletter`, `/privacy`, `/cookie`, `/robots.txt`, `/sitemap.xml`. In particolare verificare: i font Fraunces/Inter si vedono correttamente (non fallback di sistema), Vercel Analytics inizia a registrare eventi, `/cookie` e `/privacy` mostrano il nuovo contenuto, gli header di sicurezza sono presenti (verificabile con dev tools → Network → Headers su qualunque richiesta).

## 30. Problemi residui

**HIGH**
- Mittente Brevo non autenticato su dominio proprio (punto 15) — blocca la deliverability professionale delle email, va risolto prima del go-live definitivo.
- Build con `next/font/google` non verificato in questo ambiente — rischio reale, seppur basso (tsc pulito, sintassi corretta), va confermato su Vercel prima di considerare il cambio font definitivamente chiuso.
- `/privacy` e `/cookie` contengono placeholder legali espliciti, non sono testi legali definitivi — vanno completati con consulenza legale prima del go-live.

**MEDIUM**
- Nessun metadata `twitter:*` su nessuna pagina (Open Graph copre comunque la maggior parte dei casi).
- Nessuna immagine OG generica di fallback per le pagine senza foto reale — la maggior parte delle condivisioni social non mostrerà un'anteprima immagine.
- `SectionHeader` (usato da `/ricette`, `/incontri`, `/cristina-in-rai`) non verificato per la presenza di un `<h1>` semantico corretto.

**LOW**
- Nessun `rel="next"/"prev"` sulla paginazione di `/ricette`.
- `/newsletter/conferma` senza canonical/OG proprio (pagina orfana, impatto trascurabile).
- Nessun audit Lighthouse/performance quantitativo eseguito (richiede ambiente di produzione reale).

## 31. AZIONI MANUALI obbligatorie prima del go-live

1. `git push origin main` e verifica che il deploy Vercel completi con successo — **in particolare controllare che il build con Fraunces/Inter non fallisca** (punto 20/30). Se fallisce, serve rollback rapido di `lib/fonts.ts`/`app/layout.tsx`.
2. QA visivo reale in produzione sulle route elencate al punto 29.
3. Verificare che Vercel Web Analytics inizi a raccogliere dati (Vercel Dashboard → progetto → tab Analytics).
4. Completare `/privacy` e `/cookie` con consulenza legale reale, sostituendo tutti i placeholder `[DA INSERIRE]`/`[DA VALIDARE]`.
5. Prima del go-live definitivo: acquisire/collegare il dominio Narè definitivo, aggiornare `NEXT_PUBLIC_SITE_URL`, autenticare il dominio email in Brevo (DKIM/SPF) e cambiare il mittente del template newsletter dal Gmail personale a un indirizzo sul dominio proprio.
6. Dopo il collegamento del dominio definitivo: seguire la checklist Google Search Console (punto 23).

## 32. Verdetto

**READY FOR PHASE 10 — FINAL QA / GO-LIVE**, con le azioni manuali del punto 31 come condizioni sospensive esplicite prima del go-live effettivo (in particolare: verifica build font su Vercel, completamento testi legali, autenticazione dominio email Brevo). Il codice di questa fase è coerente, verificato dove possibile in questo ambiente, e non introduce regressioni sulle funzionalità già consolidate nelle Fasi 1-8.

NON è stata iniziata la Fase 10.
