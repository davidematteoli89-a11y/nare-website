import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";
import {
  getPublicWorkshop,
  resolvePublicImageUrl,
  ApiUnavailableError,
  MalformedResponseError,
  type PublicWorkshopPayload,
} from "@/lib/aidady-api";
import { formatDateIt, formatPriceEur } from "@/lib/format";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// BUG FIX #2 (Fase 11, audit end-to-end unpublish): vedi commento esteso
// in lib/aidady-api.ts — la freschezza è garantita da `cache: "no-store"`
// sui fetch, non da `revalidate` a livello di pagina.

/**
 * Dettaglio Narè Incontri definitivo — Fase 5, Step 5H-5L.
 *
 * Stessa distinzione già validata per /ricette/[slug] (Fase 3, Step 3O/3P):
 * - Workshop non trovato/non pubblicato → 404 reale dall'API → notFound()
 *   Next, finisce sulla 404 brandizzata Narè.
 * - API irraggiungibile o risposta malformata → NON un 404: messaggio
 *   editoriale "contenuto non disponibile ora" con CTA, mai un errore
 *   tecnico esposto.
 *
 * Blocchi info mostrati SOLO se il dato è realmente presente nel payload
 * (Step 5A/5I): niente location/luogo (non esiste nel DTO pubblico),
 * niente "posti disponibili"/sold-out (non esiste), niente CTA di
 * iscrizione a un URL esterno (non esiste alcun registration_url/
 * external_url/contact_url — verificato contro lib/services/public-dto.ts
 * in aiDady). La CTA finale (Step 5K) è quindi un interesse editoriale
 * generico verso la newsletter/contatto, non una prenotazione reale — in
 * linea col vincolo esplicito "CTA semplice di interesse/iscrizione, non
 * booking reale" della Fase 5.
 */
type WorkshopLoadResult =
  | { status: "ok"; workshop: PublicWorkshopPayload }
  | { status: "not-found" }
  | { status: "unavailable" };

async function loadWorkshop(slug: string): Promise<WorkshopLoadResult> {
  try {
    const workshop = await getPublicWorkshop(slug);
    if (!workshop) return { status: "not-found" };
    return { status: "ok", workshop };
  } catch (err) {
    if (err instanceof ApiUnavailableError || err instanceof MalformedResponseError) {
      return { status: "unavailable" };
    }
    return { status: "unavailable" };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadWorkshop(slug);
  if (result.status !== "ok") return {};

  const { workshop } = result;
  const title = workshop.seo_title || workshop.title;
  const description = workshop.seo_description || workshop.excerpt || undefined;
  const imageUrl = resolvePublicImageUrl(workshop.og_image_path);

  return {
    title,
    description,
    alternates: workshop.canonical_url ? { canonical: workshop.canonical_url } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: workshop.published_at ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function IncontriDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadWorkshop(slug);

  if (result.status === "not-found") notFound();

  if (result.status === "unavailable") {
    return (
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "Incontri", href: "/incontri" }, { label: "Incontro" }]} />
        <div className="mt-8">
          <EmptyState
            title="Questo contenuto non è disponibile in questo momento."
            description="Riprova tra qualche minuto, oppure esplora gli altri incontri."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/incontri" variant="secondary">
              Altri incontri
            </LinkButton>
            <LinkButton href="/" variant="ghost">
              Torna a Narè
            </LinkButton>
          </div>
        </div>
      </Container>
    );
  }

  const { workshop } = result;
  const imageUrl = resolvePublicImageUrl(workshop.og_image_path);
  const nextSession = workshop.upcoming_sessions[0];
  const jsonLd = buildWorkshopJsonLd(workshop, imageUrl);

  return (
    <Container className="py-12 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Narè", href: "/" },
          { label: "Incontri", href: "/incontri" },
          { label: workshop.title },
        ]}
      />

      {/* HERO */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Narè Incontri</Eyebrow>
          <h1 className="text-h1 mt-3 text-[var(--color-foreground)]">{workshop.title}</h1>
          {workshop.excerpt && <p className="text-lead mt-4 max-w-xl text-[var(--color-foreground-muted)]">{workshop.excerpt}</p>}
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
          <Image
            src={imageUrl ?? "/images/placeholders/editorial-generic.png"}
            alt={workshop.title}
            fill
            priority
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* PROSSIME SESSIONI — solo dati reali (data/ora, prezzo), mai
          location/posti perché non esistono nel DTO pubblico (Step 5I) */}
      {workshop.upcoming_sessions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-h3 text-[var(--color-foreground)]">Prossime date</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {workshop.upcoming_sessions.map((session, i) => (
              <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
                {session.start_at && (
                  <p className="text-body font-medium text-[var(--color-foreground)]">
                    {formatDateIt(session.start_at, { withTime: true })}
                  </p>
                )}
                {session.price_per_person != null && (
                  <p className="text-small mt-1.5 text-[var(--color-foreground-muted)]">{formatPriceEur(session.price_per_person)} a persona</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESCRIZIONE */}
      <section className="mt-12 max-w-2xl">
        <h2 className="text-h3 text-[var(--color-foreground)]">Di cosa si tratta</h2>
        <p className="text-body mt-4 whitespace-pre-line text-[var(--color-foreground-muted)]">{workshop.description}</p>
      </section>

      {/* CTA — interesse editoriale, non booking reale (nessun
          registration_url nel DTO pubblico, Step 5K) */}
      <div className="mt-16 border-t border-[var(--color-border)] pt-8">
        <p className="text-small text-[var(--color-foreground-muted)]">
          {nextSession ? "Interessata o interessato a questo incontro?" : "Un incontro Narè."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <LinkButton href="/#newsletter" variant="secondary" size="sm">
            Iscriviti alla newsletter per gli aggiornamenti
          </LinkButton>
          <LinkButton href="/incontri" variant="ghost" size="sm">
            Altri incontri
          </LinkButton>
        </div>
      </div>

      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </Container>
  );
}

/**
 * Structured data Event (Step 5N) — emesso SOLO se esiste almeno una
 * sessione futura con `start_at` reale: senza una data non ha senso
 * pubblicare un Event. NON inventa offers/price/availability quando price
 * manca, NON inventa location (assente dal DTO pubblico, Step 5A: un
 * Event schema.org valido richiederebbe `location`, che non possiamo
 * fornire con dati reali — per questo `location` viene omesso e Google
 * potrebbe non idoneizzare il rich result; preferibile a inventare un
 * indirizzo). NON inventa organizer/performer.
 */
function buildWorkshopJsonLd(workshop: PublicWorkshopPayload, imageUrl: string | null): string | null {
  const session = workshop.upcoming_sessions.find((s) => s.start_at);
  if (!session || !session.start_at) return null;

  const canonical = workshop.canonical_url || `${siteUrl}/incontri/${workshop.slug}`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: workshop.title,
    startDate: session.start_at,
    url: canonical,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };

  if (session.end_at) data.endDate = session.end_at;
  if (workshop.excerpt) data.description = workshop.excerpt;
  if (imageUrl) data.image = [imageUrl];

  if (session.price_per_person != null) {
    data.offers = {
      "@type": "Offer",
      price: session.price_per_person,
      priceCurrency: "EUR",
      url: canonical,
    };
  }

  return JSON.stringify(data).replace(/</g, "\\u003c");
}
