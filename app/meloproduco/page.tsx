import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { LinkButton } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { EditorialCard } from "@/components/EditorialCard";
import { listPublicRecipes, resolvePublicImageUrl, type PublicRecipePayload } from "@/lib/aidady-api";

/**
 * Landing /meloproduco definitiva — Fase 3, Step 3C.
 *
 * MeLoProduco è il verticale editoriale e pratico di Narè, non il brand
 * ombrello: la pagina lo spiega e chiude sempre riportando a Narè (Step
 * 3C.6). La sezione "Ultime ricette" fa fetch reale (Step 3C.3) con lo
 * stesso pattern di fallback già usato in Home (mai un errore tecnico in
 * pagina, mai un 500).
 */

// Canonical/OG url da NEXT_PUBLIC_SITE_URL (Fase 9B/9G) — mancavano del
// tutto (nessun alternates.canonical, nessun openGraph proprio).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const CANONICAL_URL = `${siteUrl}/meloproduco`;
const description =
  "MeLoProduco è il verticale editoriale e pratico di Narè: autoproduzione, casa, preparazioni, botanica ed economia domestica, con un metodo pubblico e trasparente.";

export const metadata: Metadata = {
  title: "MeLoProduco",
  description,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "MeLoProduco",
    description,
    url: CANONICAL_URL,
    type: "website",
  },
};

export default async function MeLoProducoPage() {
  const recipes = await safeListRecentRecipes();

  return (
    <>
      <Hero />
      <CosaTrovi />
      <UltimeRicette recipes={recipes} />
      <Metodo />
      <Guide />
      <CtaNare />
    </>
  );
}

async function safeListRecentRecipes(): Promise<PublicRecipePayload[] | null> {
  try {
    const res = await listPublicRecipes({ limit: 6 });
    return res.items;
  } catch {
    return null; // null = API irraggiungibile/malformata, distinto da [] = nessuna ricetta pubblicata
  }
}

/* ---------------------------------------------------------------------- */
/* HERO                                                                    */
/* ---------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container className="py-16 sm:py-20">
        <Eyebrow>MeLoProduco · un progetto Narè</Eyebrow>
        <h1 className="text-hero-display mt-4 max-w-2xl text-[var(--color-foreground)]">
          Fare in casa, con più conoscenza e meno improvvisazione.
        </h1>
        <p className="text-lead mt-5 max-w-xl text-[var(--color-foreground-muted)]">
          Autoproduzione, economia domestica, casa, preparazioni e botanica: pratiche quotidiane studiate con criterio,
          non ricette raccolte a caso.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/ricette">Esplora le ricette</LinkButton>
          <LinkButton href="#metodo" variant="secondary">
            Scopri il metodo
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* COSA TROVI QUI — blocchi editoriali, NON una taxonomy DB (Step 3C.2)    */
/* ---------------------------------------------------------------------- */

function CosaTrovi() {
  const aree = [
    { title: "Casa", description: "Pulizia, ordine, piccola manutenzione domestica fatta con criterio." },
    { title: "Autoproduzione", description: "Preparazioni che si possono davvero rifare a casa, senza scorciatoie." },
    { title: "Preparazioni", description: "Ricette e processi testati, spiegati passo per passo." },
    { title: "Botanica", description: "Piante, erbe e materie prime naturali, con un approccio pratico e prudente." },
    { title: "Economia domestica", description: "Gestire la casa con metodo, senza sprechi né complicazioni inutili." },
    { title: "Pratiche quotidiane", description: "Piccole abitudini utili, pensate per la vita reale, non per la teoria." },
  ];

  return (
    <div className="bg-[var(--color-surface-subtle)]">
      <Container className="py-16 sm:py-20">
        <SectionHeader eyebrow="Cosa trovi qui" title="Le aree di MeLoProduco" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aree.map((area) => (
            <div key={area.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-h3 text-[var(--color-foreground)]">{area.title}</p>
              <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{area.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* ULTIME RICETTE — dati reali, mai fake (Step 3C.3)                       */
/* ---------------------------------------------------------------------- */

function UltimeRicette({ recipes }: { recipes: PublicRecipePayload[] | null }) {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        eyebrow="Ultime pubblicazioni"
        title="Ultime ricette"
        action={
          <LinkButton href="/ricette" variant="secondary" size="sm">
            Vedi tutte le ricette
          </LinkButton>
        }
      />

      <div className="mt-8">
        {recipes === null ? (
          <EmptyState
            title="Le ultime pubblicazioni non sono disponibili in questo momento."
            description="Nel frattempo, puoi esplorare l'archivio ricette dalla pagina dedicata."
          />
        ) : recipes.length === 0 ? (
          <EmptyState
            title="Le prime ricette MeLoProduco stanno arrivando."
            description="Questo spazio si popolerà con le prossime pubblicazioni."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 6).map((recipe) => (
              <EditorialCard
                key={recipe.slug}
                href={`/ricette/${recipe.slug}`}
                title={recipe.title}
                excerpt={recipe.excerpt ?? undefined}
                imageSrc={resolvePublicImageUrl(recipe.og_image_path) ?? "/images/placeholders/editorial-generic.png"}
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
/* METODO MELOPRODUCO — pubblico, senza gergo tecnico aiDady (Step 3C.4)   */
/* ---------------------------------------------------------------------- */

function Metodo() {
  const steps = [
    { title: "Studiamo", description: "Partiamo da fonti solide, non da mode o sentito dire." },
    { title: "Valutiamo", description: "Scegliamo con prudenza cosa vale davvero la pena condividere." },
    { title: "Proviamo", description: "Ogni preparazione viene testata prima di essere pubblicata." },
    { title: "Condividiamo", description: "Solo ciò che ha superato la prova arriva qui, spiegato passo per passo." },
  ];

  return (
    <div id="metodo" className="scroll-mt-24 bg-[var(--color-surface-subtle)]">
      <Container className="py-16 sm:py-20">
        <SectionHeader eyebrow="Metodo" title="Il metodo MeLoProduco" description="Più concreto del metodo generale di Narè: qui vale per ogni ricetta e preparazione." />
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
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* GUIDE — Fase 7, Step 7M: 0 Guide reali pubblicate oggi (nessun endpoint */
/* pubblico ancora esposto da aiDady, vedi app/guide/page.tsx), quindi il  */
/* blocco resta un rimando editoriale leggero — ma ora punta alla pagina   */
/* /guide reale, che esiste da questa fase (Step 3C.5 → Step 7M).          */
/* ---------------------------------------------------------------------- */

function Guide() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-8 text-center sm:p-10">
        <p className="text-h3 text-[var(--color-foreground)]">Guide e approfondimenti arriveranno qui.</p>
        <p className="text-small mx-auto mt-2 max-w-md text-[var(--color-foreground-muted)]">
          Accanto alle ricette, MeLoProduco ospiterà in futuro guide più ampie su casa, autoproduzione e botanica.
        </p>
        <div className="mt-5">
          <LinkButton href="/guide" variant="secondary" size="sm">
            Vai alle Guide
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}

/* ---------------------------------------------------------------------- */
/* CTA NARÈ — chiude ricordando che MeLoProduco è parte di Narè (Step 3C.6) */
/* ---------------------------------------------------------------------- */

function CtaNare() {
  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container className="flex flex-col items-start gap-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
        <div>
          <Eyebrow>Parte di Narè</Eyebrow>
          <p className="text-h2 mt-2 text-[var(--color-foreground)]">MeLoProduco è uno dei mondi Narè.</p>
        </div>
        <Link href="/" className="text-small font-medium text-[var(--color-accent-text)] hover:underline">
          Scopri gli altri mondi Narè →
        </Link>
      </Container>
    </div>
  );
}
