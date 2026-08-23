import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkButton } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const canonicalUrl = `${siteUrl}/occasioni-speciali`;

export const metadata: Metadata = {
  title: "Occasioni speciali",
  description:
    "Esperienze Narè da condividere in un'occasione speciale: laboratori creativi e attività di autoproduzione costruiti intorno al gruppo.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Occasioni speciali | Narè",
    description:
      "Un laboratorio, un'esperienza da fare insieme, qualcosa da creare con le proprie mani e portare con sé.",
    url: canonicalUrl,
    type: "website",
  },
};

const occasions = [
  "Addio al nubilato",
  "Compleanno",
  "Giornata tra amiche",
  "Baby shower",
  "Festa privata",
  "Ricorrenza",
  "Team o piccolo evento aziendale",
  "Gruppo privato",
  "Altro",
];

const experiences = [
  {
    title: "Autoproduzione",
    text: "Preparazioni e gesti da imparare insieme, con un risultato concreto da portare con sé.",
  },
  {
    title: "Candele e manualità",
    text: "Esperienze creative guidate, pensate per lasciare spazio al fare e allo stare insieme.",
  },
  {
    title: "Botanica e stagionalità",
    text: "Attività ispirate alla natura e al momento dell'anno, quando sono adatte al gruppo e al contesto.",
  },
  {
    title: "Cucina e preparazioni",
    text: "Un'esperienza pratica attorno a ingredienti, saperi domestici e autoproduzione.",
  },
];

const otherOccasions = [
  ["Compleanni", "Un modo semplice e condiviso per celebrare facendo qualcosa insieme."],
  ["Giornate tra amiche", "Tempo da dedicarsi, mani impegnate e conversazioni che nascono con naturalezza."],
  ["Eventi privati", "Un'attività Narè può entrare in una ricorrenza o in un incontro di gruppo."],
  ["Aziende e team", "Un'esperienza pratica per piccoli gruppi, da valutare in base al contesto."],
  ["Gruppi", "Un punto di partenza da costruire intorno alle persone e ai loro interessi."],
];

export default function OccasioniSpecialiPage() {
  return (
    <>
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "Occasioni speciali" }]} />
        <div className="mt-8 max-w-3xl">
          <Eyebrow>Occasioni speciali</Eyebrow>
          <h1 className="text-hero-display mt-3 text-[var(--color-foreground)]">
            Un&apos;occasione da vivere insieme
          </h1>
          <p className="text-lead mt-5 max-w-2xl text-[var(--color-foreground-muted)]">
            Narè può diventare parte di un momento speciale: un laboratorio, un&apos;esperienza da fare insieme,
            qualcosa da creare con le proprie mani e portare con sé. L&apos;occasione è il punto di partenza;
            l&apos;esperienza si costruisce intorno al gruppo.
          </p>
          <div className="mt-8">
            <LinkButton href="/porta-nare-da-te?tipo=evento-privato&occasione=evento-privato">
              Raccontaci cosa immagini
            </LinkButton>
          </div>
        </div>
      </Container>

      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <SectionHeader
            eyebrow="Il contesto"
            title="Da quale occasione partiamo?"
            description="Ogni occasione può diventare il punto di partenza per costruire un'esperienza Narè, senza formule rigide o pacchetti già confezionati."
          />
          <ul className="mt-8 flex max-w-4xl flex-wrap gap-2" aria-label="Occasioni possibili">
            {occasions.map((occasion) => (
              <li
                key={occasion}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-foreground-muted)]"
              >
                {occasion}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="L'esperienza"
          title="Imparare, creare, stare insieme"
          description="Le attività si scelgono in base al gruppo, al luogo e al momento: da un laboratorio essenziale a un'esperienza costruita intorno alle persone."
        />
        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {experiences.map((experience) => (
            <article key={experience.title} className="border-t border-[var(--color-border)] pt-5">
              <h2 className="text-h3 text-[var(--color-foreground)]">{experience.title}</h2>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{experience.text}</p>
            </article>
          ))}
        </div>
      </Container>

      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Un momento da ricordare</Eyebrow>
            <h2 className="text-h1 mt-3 text-[var(--color-foreground)]">Un addio al nubilato diverso dal solito</h2>
            <p className="text-lead mt-4 text-[var(--color-foreground-muted)]">
              Un momento da vivere insieme, creare qualcosa con le proprie mani e portarsi a casa un ricordo
              dell&apos;esperienza. Il contenuto prende forma ascoltando il gruppo, senza rituali obbligati o formule
              già decise.
            </p>
            <div className="mt-7">
              <LinkButton href="/porta-nare-da-te?tipo=evento-privato&occasione=addio-al-nubilato">
                Raccontaci cosa immagini
              </LinkButton>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <SectionHeader eyebrow="Altri momenti" title="Un'esperienza, occasioni diverse" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {otherOccasions.map(([title, text]) => (
            <article key={title}>
              <h2 className="text-h3 text-[var(--color-foreground)]">{title}</h2>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-14 border-t border-[var(--color-border)] pt-10 text-center">
          <p className="text-h2 text-[var(--color-foreground)]">Da cosa vorresti partire?</p>
          <p className="text-small mx-auto mt-3 max-w-xl text-[var(--color-foreground-muted)]">
            Raccontaci l&apos;occasione, dove siete e che tipo di esperienza immagini. Valuteremo insieme cosa può
            avere senso costruire.
          </p>
          <div className="mt-6">
            <LinkButton href="/porta-nare-da-te?tipo=evento-privato&occasione=evento-privato">
              Invia una richiesta
            </LinkButton>
          </div>
        </div>
      </Container>
    </>
  );
}
