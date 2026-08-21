import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { raiAppearances } from "@/lib/rai-appearances";

const CANONICAL_URL = "https://nare-website.vercel.app/cristina-in-rai";

export const metadata: Metadata = {
  title: "Cristina in RAI",
  description:
    "Gli interventi di Cristina Nigrelli a Uno Mattina e Uno Mattina Estate su Rai1: economia domestica, pulizia e organizzazione della casa.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Cristina in RAI",
    description: "Gli interventi di Cristina Nigrelli a Uno Mattina e Uno Mattina Estate, Rai1.",
    url: CANONICAL_URL,
    type: "website",
  },
};

/**
 * /cristina-in-rai — Fase 4B (contenuti reali).
 *
 * Legge da lib/rai-appearances.ts, la stessa fonte dati usata dalla sezione
 * Home e dalla preview su /cristina — nessuna duplicazione manuale.
 *
 * 14 interventi reali (Uno Mattina / Uno Mattina Estate, Rai1, 2023-2026)
 * forniti dal cliente in Fase 4B. Tutti con videoType "none": i file sorgente
 * esistono (vedi lib/rai-appearances.ts, _internalRightsStatus) ma sono
 * video lunghi non ancora tagliati/ospitati per la pubblicazione web — ogni
 * card mostra quindi solo poster/titolo/programma/data/tema, mai un player.
 *
 * VideoObject JSON-LD: emesso SOLO per interventi con videoType diverso da
 * "none" e videoUrl presente (Step 4N) — oggi nessuno, quindi nessuno schema
 * VideoObject viene emesso, corretto perché nessun video è pubblicamente
 * accessibile.
 *
 * Person JSON-LD: non emesso in questa fase — richiederebbe dati verificati
 * aggiuntivi (sameAs, pagina ufficiale) non ancora forniti.
 */
export default function CristinaInRaiPage() {
  const videoJsonLd = raiAppearances
    .filter((a) => a.videoType !== "none" && a.videoUrl)
    .map((a) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: a.title,
      description: a.description ?? `${a.title} — ${a.programme}`,
      uploadDate: a.date,
      thumbnailUrl: a.poster ? `https://nare-website.vercel.app${a.poster}` : undefined,
      contentUrl: a.videoUrl,
    }));

  return (
    <>
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "Cristina", href: "/cristina" }, { label: "In RAI" }]} />

        <div className="mt-6">
          <SectionHeader
            eyebrow="Media"
            title="Cristina in RAI"
            description="Gli interventi di Cristina a Uno Mattina e Uno Mattina Estate, su Rai1."
          />
        </div>

        <p className="text-small mt-6 max-w-2xl text-[var(--color-foreground-muted)]">
          Questa sezione non sponsorizza né rappresenta un rapporto ufficiale con Rai. I video sono in fase di
          preparazione per la pubblicazione: verranno resi disponibili qui non appena pronti.
        </p>

        <div className="mt-10">
          {raiAppearances.length === 0 ? (
            <EmptyState
              title="Nessun intervento ancora pubblicato in questa fase."
              description="Gli interventi RAI di Cristina saranno raccolti qui non appena verificati i diritti d'uso di ciascun video."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {raiAppearances.map((appearance) => (
                <div key={appearance.id}>
                  <VideoPlaceholder
                    title={appearance.title}
                    programme={appearance.programme}
                    date={appearance.date}
                    posterSrc={appearance.poster ?? "/images/placeholders/video-poster.png"}
                  />
                  {(appearance.topic || appearance.description) && (
                    <p className="text-small mt-3 text-[var(--color-foreground-muted)]">
                      {appearance.description ?? appearance.topic}
                    </p>
                  )}
                  {appearance.relatedLinks && appearance.relatedLinks.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {appearance.relatedLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className="text-small text-[var(--color-accent-text)] underline underline-offset-4"
                          >
                            {link.label} →
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {appearance.officialUrl && (
                    <a
                      href={appearance.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-meta mt-2 block text-[var(--color-foreground-muted)] underline underline-offset-4"
                    >
                      Fonte ufficiale ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {videoJsonLd.length > 0 &&
        videoJsonLd.map((jsonLd, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ))}
    </>
  );
}
