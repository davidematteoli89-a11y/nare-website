import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkButton } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { EditorialCard } from "@/components/EditorialCard";
import { NewsletterFormShell } from "@/components/NewsletterFormShell";
import { VideoCard } from "@/components/VideoCard";
import { FUTURE_NAV } from "@/lib/nav";
import { listPublicRecipes } from "@/lib/aidady-api";
import { raiAppearances } from "@/lib/rai-appearances";

/**
 * Homepage definitiva — Fase 2 (Step 2H-2R).
 *
 * Ordine sezioni secondo spec: Hero → I mondi Narè → MeLoProduco →
 * Narè Incontri → Cristina → Cristina in RAI → Metodo → Newsletter.
 * Ritiri/Famiglie/In Viaggio non hanno sezioni proprie: compaiono solo
 * dentro "I mondi Narè", in modo leggero (Step 2Q) — nessun contenuto
 * fake, nessuna data/evento/servizio inventato.
 *
 * Metodo, Server Component: la sezione MeLoProduco fa fetch reale via
 * listPublicRecipes() (Step 2L) con fallback elegante se l'API non
 * risponde (Step 2X) — mai un 500, mai stack trace in pagina.
 */
export default async function HomePage() {
  const recipes = await safeListRecipes();

  return (
    <>
      <Hero />
      <MondiNare />
      <MeLoProducoSection recipes={recipes} />
      <IncontriSection />
      <CristinaSection />
      <CristinaInRaiSection />
      <MetodoSection />
      <NewsletterSection />
    </>
  );
}

/** Step 2X: mai propagare l'errore alla pagina — la sezione dinamica si nasconde/fa fallback. */
async function safeListRecipes() {
  try {
    const res = await listPublicRecipes({ limit: 3 });
    return res.items;
  } catch {
    return null; // null = API irraggiungibile, distinto da [] = nessuna ricetta pubblicata
  }
}

/* ---------------------------------------------------------------------- */
/* HERO — Step 2H                                                          */
/* ---------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Narè, con Cristina di Narè</Eyebrow>
          <h1 className="text-hero-display mt-4 text-[var(--color-foreground)]">
            Imparare facendo, vivere con più consapevolezza.
          </h1>
          <p className="text-lead mt-5 max-w-md text-[var(--color-foreground-muted)]">
            Narè unisce esperienza, educazione e manualità: autoproduzione, incontri dal vivo e pratiche quotidiane, con
            Cristina di Narè come filo conduttore.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/cristina">Scopri Narè</LinkButton>
            <LinkButton href="/meloproduco" variant="secondary">
              Esplora MeLoProduco
            </LinkButton>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
          <Image
            src="/images/cristina/cristina-hero.jpg"
            alt="Cristina Nigrelli, di Narè, ritratto all'aperto"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* I MONDI NARÈ — Step 2I                                                  */
/* ---------------------------------------------------------------------- */

function MondiNare() {
  return (
    <div className="bg-[var(--color-surface-subtle)]">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="I progetti"
          title="I mondi Narè"
          description="MeLoProduco è oggi il cuore editoriale di Narè; le altre aree crescono nel tempo."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* MeLoProduco — area più importante, card più grande/prominente */}
          <Link
            href="/meloproduco"
            className="group flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-[var(--shadow-md)] sm:p-8"
          >
            <div>
              <p className="text-eyebrow text-[var(--color-accent-text)]">Il cuore editoriale</p>
              <h3 className="text-h2 mt-2 text-[var(--color-foreground)]">MeLoProduco</h3>
              <p className="text-body mt-3 max-w-md text-[var(--color-foreground-muted)]">
                Autoproduzione, casa e ricette e pratiche quotidiane, studiate e provate prima di essere condivise.
              </p>
            </div>
            <span className="text-small mt-6 font-medium text-[var(--color-accent-text)] group-hover:underline">
              Esplora MeLoProduco →
            </span>
          </Link>

          {/* Narè Incontri — seconda area concreta */}
          <Link
            href="/incontri"
            className="group flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-[var(--shadow-md)] sm:p-8"
          >
            <div>
              <p className="text-eyebrow text-[var(--color-accent-text)]">Dal vivo</p>
              <h3 className="text-h2 mt-2 text-[var(--color-foreground)]">Narè Incontri</h3>
              <p className="text-body mt-3 max-w-md text-[var(--color-foreground-muted)]">
                Laboratori, workshop e giornate tematiche per fare esperienza insieme.
              </p>
            </div>
            <span className="text-small mt-6 font-medium text-[var(--color-accent-text)] group-hover:underline">
              Scopri Narè Incontri →
            </span>
          </Link>
        </div>

        {/* Ritiri, Famiglie, In Viaggio — presentate in modo più leggero, nessun contenuto reale ancora */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {FUTURE_NAV.map((area) => {
            const descriptions: Record<string, string> = {
              "/ritiri": "Esperienze più immersive, quando saranno attive.",
              "/famiglie": "Attività educative per famiglie, scuole e bambini.",
              "/in-viaggio": "Narè fuori sede, nei territori e nelle collaborazioni.",
            };
            return (
              <div
                key={area.href}
                className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 opacity-80"
              >
                <p className="text-small font-semibold text-[var(--color-foreground)]">Narè {area.label}</p>
                <p className="text-meta mt-1.5 text-[var(--color-foreground-muted)]">{descriptions[area.href]}</p>
                <p className="text-meta mt-2 italic text-[var(--color-foreground-muted)]">In preparazione</p>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* MELOPRODUCO — Step 2L                                                   */
/* ---------------------------------------------------------------------- */

function MeLoProducoSection({ recipes }: { recipes: Awaited<ReturnType<typeof safeListRecipes>> }) {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        eyebrow="MeLoProduco"
        title="Autoproduzione, casa, ricette"
        description="Il cuore editoriale e pratico di Narè: pratiche quotidiane studiate con criterio e testate prima di essere condivise."
        action={
          <LinkButton href="/meloproduco" variant="secondary" size="sm">
            Esplora MeLoProduco
          </LinkButton>
        }
      />

      <div className="mt-8">
        {recipes === null ? (
          // Step 2X: API irraggiungibile — fallback editoriale, mai un errore tecnico in pagina.
          <EmptyState
            title="Le ultime pubblicazioni non sono disponibili in questo momento."
            description="Nel frattempo, puoi esplorare MeLoProduco dalla pagina dedicata."
          />
        ) : recipes.length === 0 ? (
          <EmptyState title="Le prime ricette arriveranno presto." description="MeLoProduco è in costruzione: qui troverai presto le pubblicazioni." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <EditorialCard
                key={recipe.slug}
                href={`/ricette/${recipe.slug}`}
                title={recipe.title}
                excerpt={recipe.excerpt ?? undefined}
                imageSrc="/images/placeholders/editorial-generic.png"
                imageAlt={recipe.title}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

/* ---------------------------------------------------------------------- */
/* NARÈ INCONTRI — Step 2M                                                 */
/* ---------------------------------------------------------------------- */

function IncontriSection() {
  // Nota: aiDady non espone ancora un endpoint pubblico "list" per i
  // Workshop consumabile da questo client (solo il dettaglio per slug è
  // predisposto lato aiDady, e comunque oggi 0 workshop sono pubblicati).
  // Per non inventare eventi, questa sezione resta un'introduzione
  // istituzionale, non un archivio con dati reali.
  return (
    <div className="bg-[var(--color-surface-subtle)]">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Narè Incontri"
          title="Laboratori ed esperienze dal vivo"
          description="Workshop e giornate tematiche pensate per imparare facendo, insieme."
          action={
            <LinkButton href="/incontri" variant="secondary" size="sm">
              Scopri Narè Incontri
            </LinkButton>
          }
        />
        <div className="mt-8">
          <EmptyState
            title="Nessun incontro pubblicato al momento."
            description="I prossimi appuntamenti saranno annunciati qui e sulla pagina Narè Incontri."
          />
        </div>
      </Container>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* CRISTINA — Step 2N                                                      */
/* ---------------------------------------------------------------------- */

function CristinaSection() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Chi c&apos;è dietro Narè</Eyebrow>
          <h2 className="text-h2 mt-3 text-[var(--color-foreground)]">Dietro Narè c&apos;è Cristina.</h2>
          <p className="text-body mt-4 max-w-lg text-[var(--color-foreground-muted)]">
            Esperta di economia domestica e naturopata, Cristina Nigrelli unisce da anni divulgazione pratica ed
            esperienza televisiva — è tra i volti di Uno Mattina e Uno Mattina Estate su Rai1 — a un lavoro concreto
            fatto di autoproduzione, workshop e attività educative, sempre con un approccio pratico e prudente.
          </p>
          <div className="mt-6">
            <LinkButton href="/cristina" variant="secondary">
              Conosci Cristina
            </LinkButton>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] lg:order-first">
          <Image
            src="/images/cristina/cristina-editorial.jpg"
            alt="Cristina Nigrelli, di Narè"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Container>
  );
}

/* ---------------------------------------------------------------------- */
/* CRISTINA IN RAI — Step 2O, aggiornata in Fase 4 (Step 4L)               */
/* ---------------------------------------------------------------------- */

/**
 * Legge da lib/rai-appearances.ts, la stessa fonte dati di /cristina-in-rai
 * (Fase 4, Step 4D/4L) — nessuna duplicazione manuale. Mostra al massimo 3
 * interventi, con lo stesso empty state elegante finché l'array è vuoto.
 */
function CristinaInRaiSection() {
  const preview = raiAppearances.slice(0, 3);

  return (
    <div className="bg-[var(--color-surface-subtle)]">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Media"
          title="Cristina in RAI"
          description="Gli interventi televisivi di Cristina, a sostegno dell'autorevolezza di tutto Narè."
          action={
            <LinkButton href="/cristina-in-rai" variant="secondary" size="sm">
              Guarda gli interventi
            </LinkButton>
          }
        />

        <div className="mt-8">
          {preview.length === 0 ? (
            <EmptyState
              title="Nessun intervento ancora pubblicato in questa fase."
              description="Gli interventi RAI saranno collegati dopo la verifica dei diritti d'uso di ciascun video."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((appearance) => (
                <VideoCard
                  key={appearance.id}
                  title={appearance.title}
                  programme={appearance.programme}
                  date={appearance.date}
                  posterSrc={appearance.poster ?? "/images/placeholders/video-poster.png"}
                  videoType={appearance.videoType}
                  videoUrl={appearance.videoUrl}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-meta mt-6 max-w-2xl text-[var(--color-foreground-muted)]">
          Le apparizioni televisive non implicano una partnership o una sponsorizzazione da parte di RAI.
        </p>
      </Container>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* METODO NARÈ — Step 2P                                                   */
/* ---------------------------------------------------------------------- */

function MetodoSection() {
  const steps = [
    { title: "Studiamo e osserviamo", description: "Partiamo da fonti solide e dall'ascolto di ciò che le persone cercano davvero." },
    { title: "Scegliamo con criterio", description: "Valutiamo con prudenza cosa vale la pena approfondire e condividere." },
    { title: "Facciamo esperienza", description: "Proviamo, testiamo e verifichiamo prima di proporre qualsiasi contenuto o attività." },
    { title: "Condividiamo ciò che ha valore", description: "Solo ciò che è davvero pronto arriva ai contenuti, alle guide e agli incontri." },
  ];

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader eyebrow="Metodo" title="Il metodo Narè" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-eyebrow text-[var(--color-accent-text)]">{String(i + 1).padStart(2, "0")}</p>
            <p className="text-h3 mt-2 text-[var(--color-foreground)]">{step.title}</p>
            <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{step.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ---------------------------------------------------------------------- */
/* NEWSLETTER — Step 2R                                                    */
/* ---------------------------------------------------------------------- */

function NewsletterSection() {
  return (
    <div id="newsletter" className="bg-[var(--color-surface-subtle)]">
      <Container className="py-16 sm:py-20">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-12">
          <SectionHeader eyebrow="Newsletter" title="Un po' di Narè, direttamente nella tua casella." />
          <div className="mt-6 max-w-md">
            <NewsletterFormShell compact />
          </div>
        </div>
      </Container>
    </div>
  );
}
