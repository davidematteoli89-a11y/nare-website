import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { LinkButton } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { raiAppearances } from "@/lib/rai-appearances";

const CANONICAL_URL = "https://nare-website.vercel.app/cristina";

export const metadata: Metadata = {
  title: "Cristina di Narè",
  description:
    "Cristina di Narè: esperta di economia domestica e naturopata, filo conduttore di Narè tra autoproduzione, divulgazione pratica ed esperienza televisiva.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Cristina di Narè",
    description:
      "Esperta di economia domestica e naturopata, Cristina di Narè unisce divulgazione pratica ed esperienza televisiva a un lavoro concreto di autoproduzione e formazione.",
    url: CANONICAL_URL,
    type: "profile",
  },
};

/**
 * /cristina — Fase 4 (Step 4B).
 *
 * Nessuna foto reale di Cristina è ancora presente nel repository
 * (public/images/cristina/ è vuota — audit Step 4A): l'immagine hero usa lo
 * stesso placeholder neutro già in uso in Home, chiaramente marcato come
 * tale via alt text. La bio è scritta a partire dal posizionamento editoriale
 * già stabilito e stabile nelle fasi precedenti (Home, metadata, nav:
 * economia domestica, naturopatia, divulgazione pratica, esperienza
 * televisiva) — nessun fatto biografico specifico (date, programmi, aneddoti)
 * viene inventato qui; quei dettagli richiedono contenuti reali forniti dal
 * cliente.
 */
export default function CristinaPage() {
  const preview = raiAppearances.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "Cristina" }]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Cristina di Narè</Eyebrow>
            <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">
              Economia domestica, naturopatia, divulgazione pratica.
            </h1>
            <p className="text-lead mt-5 max-w-lg text-[var(--color-foreground-muted)]">
              Cristina è il filo conduttore di Narè: unisce da anni la formazione in economia domestica e naturopatia a
              un&apos;esperienza di divulgazione pratica, anche televisiva, sempre con un approccio prudente e concreto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/meloproduco">Esplora MeLoProduco</LinkButton>
              <LinkButton href="/cristina-in-rai" variant="secondary">
                Cristina in RAI
              </LinkButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            <Image
              src="/images/placeholders/hero-cristina.png"
              alt="Ritratto di Cristina di Narè — immagine segnaposto in attesa di una foto reale"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* BIO NARRATIVA */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader eyebrow="Il percorso" title="Chi è Cristina" />
          <div className="text-body mt-6 max-w-2xl space-y-4 text-[var(--color-foreground-muted)]">
            <p>
              La formazione di Cristina unisce due mondi che raramente si incontrano con la stessa serietà: l&apos;economia
              domestica, intesa come gestione consapevole della casa e delle risorse quotidiane, e la naturopatia, come
              attenzione al benessere naturale della persona. Da questa combinazione nasce l&apos;approccio che oggi guida
              tutto Narè.
            </p>
            <p>
              Negli anni, questo lavoro si è tradotto anche in divulgazione pratica rivolta a un pubblico ampio, incluse
              apparizioni televisive su Rai (raccolte nella sezione{" "}
              <a href="/cristina-in-rai" className="text-[var(--color-accent-text)] underline underline-offset-4">
                Cristina in RAI
              </a>
              ) dedicate a temi di autoproduzione e vita quotidiana.
            </p>
            <p>
              Narè nasce per raccogliere e sistematizzare questo lavoro: non ricette o consigli isolati, ma un metodo —
              osservare, scegliere con criterio, fare esperienza diretta e condividere solo ciò che è stato davvero
              testato.
            </p>
          </div>
        </Container>
      </div>

      {/* IL SUO APPROCCIO */}
      <Container className="py-16 sm:py-20">
        <SectionHeader eyebrow="Metodo" title="Il suo approccio" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Osservare", description: "Partire da fonti solide e dall'ascolto di ciò che le persone vivono e cercano davvero." },
            { title: "Comprendere", description: "Valutare con prudenza e competenza cosa ha davvero valore prima di parlarne." },
            { title: "Fare", description: "Provare in prima persona ogni pratica, ricetta o metodo prima di proporlo ad altri." },
            { title: "Condividere", description: "Portare a Narè solo ciò che è stato testato, spiegato con chiarezza e onestà." },
          ].map((step, i) => (
            <div key={step.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-eyebrow text-[var(--color-accent-text)]">{String(i + 1).padStart(2, "0")}</p>
              <p className="text-h3 mt-2 text-[var(--color-foreground)]">{step.title}</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* NARÈ: FILO CONDUTTORE */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader
            eyebrow="Narè"
            title="Un filo conduttore, non un progetto isolato"
            description="Cristina è la figura che tiene insieme le diverse aree di Narè, oggi e nel tempo."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-h3 text-[var(--color-foreground)]">MeLoProduco</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">
                Il cuore editoriale: autoproduzione, casa e pratiche quotidiane, testate prima di essere condivise.
              </p>
              <div className="mt-4">
                <LinkButton href="/meloproduco" variant="link" size="sm">
                  Esplora →
                </LinkButton>
              </div>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-h3 text-[var(--color-foreground)]">Narè Incontri</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">
                Laboratori e giornate dal vivo per imparare facendo, insieme a Cristina.
              </p>
              <div className="mt-4">
                <LinkButton href="/incontri" variant="link" size="sm">
                  Scopri →
                </LinkButton>
              </div>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 opacity-80">
              <p className="text-h3 text-[var(--color-foreground)]">Ritiri, Famiglie, In Viaggio</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">
                Aree future di Narè, ancora in preparazione: cresceranno nel tempo con lo stesso metodo.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* RAI PREVIEW */}
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Media"
          title="Cristina in RAI"
          description="Gli interventi televisivi di Cristina, a sostegno dell'autorevolezza di tutto Narè."
          action={
            <LinkButton href="/cristina-in-rai" variant="secondary" size="sm">
              Vai all&apos;archivio
            </LinkButton>
          }
        />
        <div className="mt-8">
          {preview.length === 0 ? (
            <EmptyState
              title="Nessun intervento ancora pubblicato in questa fase."
              description="Gli interventi RAI saranno collegati qui dopo la verifica dei diritti d'uso di ciascun video."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((appearance) => (
                <VideoPlaceholder
                  key={appearance.id}
                  title={appearance.title}
                  programme={appearance.programme}
                  date={appearance.date}
                  posterSrc={appearance.poster ?? "/images/placeholders/video-poster.png"}
                />
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* CTA FINALE */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center sm:p-12">
            <SectionHeader
              eyebrow="Continua"
              title="Scopri il resto di Narè"
              className="items-center justify-center text-center [&>div]:mx-auto"
            />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <LinkButton href="/meloproduco">Esplora MeLoProduco</LinkButton>
              <LinkButton href="/incontri" variant="secondary">
                Narè Incontri
              </LinkButton>
              <LinkButton href="/#newsletter" variant="ghost">
                Iscriviti alla newsletter
              </LinkButton>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
