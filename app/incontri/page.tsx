import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/Badge";
import { listPublicWorkshops, resolvePublicImageUrl, type PublicWorkshopPayload } from "@/lib/aidady-api";
import { formatDateIt, formatPriceEur } from "@/lib/format";

const CANONICAL_URL = "https://nare-website.vercel.app/incontri";

export const metadata: Metadata = {
  title: "Narè Incontri",
  description: "Laboratori e giornate dal vivo per imparare facendo, insieme a Cristina di Narè.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Narè Incontri",
    description: "Laboratori e giornate dal vivo per imparare facendo, insieme a Cristina di Narè.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const PAGE_SIZE = 6;

/**
 * /incontri — Narè Incontri, landing definitiva (Fase 5, Step 5C-5G).
 *
 * Rebrand di sola presentazione (vedi Step 1B): consuma l'entità "workshop"
 * di aiDady tramite lib/aidady-api.ts (listPublicWorkshops), aiDady non
 * viene toccato. Segue esattamente il pattern già validato per /ricette
 * (Fase 3): stessa distinzione tra "API irraggiungibile" (EmptyState
 * generico, mai un errore tecnico esposto) e "0 pubblicati" (EmptyState
 * editoriale dedicato).
 *
 * Niente paginazione "successive/precedenti" come /ricette: lo spec Fase 5
 * chiede al massimo 6 incontri in landing (Step 5D), coerente con l'idea di
 * landing curata più che archivio esaustivo.
 *
 * Campi NON mostrati perché non esistono nel DTO pubblico Workshop
 * (verificato Step 5A contro lib/services/public-dto.ts in aiDady):
 * location/luogo, posti disponibili, stato sold-out, categoria/tag, URL di
 * iscrizione. Vengono mostrati solo: titolo, excerpt, prima sessione futura
 * (data + prezzo) se presente, immagine se presente (fallback a un
 * placeholder editoriale generico, mai un'immagine finta).
 */
export default async function IncontriPage() {
  const result = await safeListWorkshops();

  return (
    <>
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Dal vivo"
          title="Narè Incontri"
          description="Laboratori e giornate dal vivo per imparare facendo, insieme a Cristina: stessa cura e stesso metodo di tutto Narè, applicati all'esperienza dal vivo."
        />

        <div className="mt-10">
          {result === null ? (
            <EmptyState
              title="Gli incontri non sono disponibili in questo momento."
              description="Riprova tra qualche minuto, oppure torna alla home di Narè."
            />
          ) : result.items.length === 0 ? (
            <EmptyState
              title="I primi Narè Incontri stanno arrivando."
              description="Questa pagina si popolerà non appena i prossimi laboratori saranno pubblicati."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((workshop) => (
                <WorkshopCard key={workshop.slug} workshop={workshop} />
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* COSA SONO GLI INCONTRI — Step 5E, testo editoriale statico: non
          dipende dal payload API, descrive il formato in generale. */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader eyebrow="Il formato" title="Cosa sono gli Incontri" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-h3 text-[var(--color-foreground)]">Dal vivo</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">
                Incontri in presenza, pensati per imparare facendo insieme a Cristina, non solo per ascoltare.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-h3 text-[var(--color-foreground)]">Stesso metodo</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">
                Gli stessi criteri editoriali di Narè: pratiche testate, spiegate con chiarezza, senza scorciatoie.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-h3 text-[var(--color-foreground)]">Gruppi piccoli</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">
                Pensati per lo scambio diretto, non per grandi platee: i dettagli di ogni incontro sono nella sua pagina.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

async function safeListWorkshops() {
  try {
    return await listPublicWorkshops({ limit: PAGE_SIZE, offset: 0 });
  } catch {
    return null; // null = API irraggiungibile/malformata
  }
}

function WorkshopCard({ workshop }: { workshop: PublicWorkshopPayload }) {
  const imageUrl = resolvePublicImageUrl(workshop.og_image_path);
  const nextSession = workshop.upcoming_sessions[0];

  return (
    <Link
      href={`/incontri/${workshop.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow duration-200 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
        <Image
          src={imageUrl ?? "/images/placeholders/editorial-generic.png"}
          alt={workshop.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        {nextSession?.start_at && <Badge className="mb-2 block">{formatDateIt(nextSession.start_at)}</Badge>}
        <h3 className="text-h3 text-[var(--color-foreground)] group-hover:text-[var(--color-accent-text)]">{workshop.title}</h3>
        {workshop.excerpt && <p className="text-small mt-2 line-clamp-2 text-[var(--color-foreground-muted)]">{workshop.excerpt}</p>}
        {nextSession?.price_per_person != null && (
          <p className="text-small mt-3 font-medium text-[var(--color-foreground)]">{formatPriceEur(nextSession.price_per_person)}</p>
        )}
      </div>
    </Link>
  );
}
