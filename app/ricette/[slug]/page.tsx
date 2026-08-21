import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Eyebrow } from "@/components/Eyebrow";
import { RecipeImage } from "@/components/RecipeImage";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";
import {
  getPublicRecipe,
  resolvePublicImageUrl,
  ApiUnavailableError,
  MalformedResponseError,
  type PublicRecipePayload,
} from "@/lib/aidady-api";

/**
 * Dettaglio Recipe definitivo — Fase 3, Step 3F-3M.
 *
 * Distinzione esplicita (Step 3O/3P) tra:
 * - Recipe non trovata/non pubblicata → 404 reale dall'API → `notFound()`
 *   Next, che finisce sulla 404 brandizzata Narè (Step 3N).
 * - API irraggiungibile o risposta malformata → NON un 404: si mostra un
 *   messaggio editoriale "contenuto non disponibile ora" con CTA, senza mai
 *   esporre l'errore tecnico. Un errore infrastrutturale non deve
 *   trasformarsi falsamente in "questa pagina non esiste".
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type RecipeLoadResult = { status: "ok"; recipe: PublicRecipePayload } | { status: "not-found" } | { status: "unavailable" };

async function loadRecipe(slug: string): Promise<RecipeLoadResult> {
  try {
    const recipe = await getPublicRecipe(slug);
    if (!recipe) return { status: "not-found" };
    return { status: "ok", recipe };
  } catch (err) {
    if (err instanceof ApiUnavailableError || err instanceof MalformedResponseError) {
      return { status: "unavailable" };
    }
    return { status: "unavailable" };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadRecipe(slug);
  if (result.status !== "ok") return {};

  const { recipe } = result;
  const title = recipe.seo_title || recipe.title;
  const description = recipe.seo_description || recipe.excerpt || undefined;
  const imageUrl = resolvePublicImageUrl(recipe.og_image_path);

  return {
    title,
    description,
    alternates: recipe.canonical_url ? { canonical: recipe.canonical_url } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: recipe.published_at ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadRecipe(slug);

  if (result.status === "not-found") notFound();

  if (result.status === "unavailable") {
    return (
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "MeLoProduco", href: "/meloproduco" }, { label: "Ricette", href: "/ricette" }, { label: "Ricetta" }]} />
        <div className="mt-8">
          <EmptyState
            title="Questo contenuto non è disponibile in questo momento."
            description="Riprova tra qualche minuto, oppure esplora altre ricette."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/ricette" variant="secondary">
              Altre ricette
            </LinkButton>
            <LinkButton href="/" variant="ghost">
              Torna a Narè
            </LinkButton>
          </div>
        </div>
      </Container>
    );
  }

  const { recipe } = result;
  const imageUrl = resolvePublicImageUrl(recipe.og_image_path);
  const jsonLd = buildRecipeJsonLd(recipe, imageUrl);

  return (
    <Container className="py-12 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Narè", href: "/" },
          { label: "MeLoProduco", href: "/meloproduco" },
          { label: "Ricette", href: "/ricette" },
          { label: recipe.title },
        ]}
      />

      {/* HERO — Step 3F.2 */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <Eyebrow>MeLoProduco</Eyebrow>
          <h1 className="text-h1 mt-3 text-[var(--color-foreground)]">{recipe.title}</h1>
          {recipe.excerpt && <p className="text-lead mt-4 max-w-xl text-[var(--color-foreground-muted)]">{recipe.excerpt}</p>}
        </div>
        <RecipeImage src={imageUrl} alt={recipe.title} priority className="aspect-[4/3] w-full rounded-[var(--radius-lg)] border border-[var(--color-border)]" />
      </div>

      {/* INFORMAZIONI — solo se presenti, mai card vuote (Step 3F.3) */}
      {(recipe.objective || recipe.yield_text) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {recipe.objective && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
              <p className="text-eyebrow text-[var(--color-accent-text)]">Obiettivo</p>
              <p className="text-body mt-1.5 text-[var(--color-foreground)]">{recipe.objective}</p>
            </div>
          )}
          {recipe.yield_text && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
              <p className="text-eyebrow text-[var(--color-accent-text)]">Resa</p>
              <p className="text-body mt-1.5 text-[var(--color-foreground)]">{recipe.yield_text}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        {/* INGREDIENTI — Step 3F.4 */}
        {recipe.ingredients.length > 0 && (
          <section aria-labelledby="ingredienti-heading">
            <h2 id="ingredienti-heading" className="text-h3 text-[var(--color-foreground)]">
              Ingredienti
            </h2>
            <ul className="mt-4 space-y-2.5">
              {recipe.ingredients
                .slice()
                .sort((a, b) => a.order_index - b.order_index)
                .map((ing, i) => (
                  <li key={i} className="text-body flex justify-between gap-4 border-b border-[var(--color-border)] pb-2.5 text-[var(--color-foreground)]">
                    <span>
                      {ing.name}
                      {ing.preparation_note ? <span className="text-small text-[var(--color-foreground-muted)]"> — {ing.preparation_note}</span> : null}
                    </span>
                    {ing.quantity != null && (
                      <span className="text-small shrink-0 whitespace-nowrap text-[var(--color-foreground-muted)]">
                        {ing.quantity}
                        {ing.unit ? ` ${ing.unit}` : ""}
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* PROCEDIMENTO — Step 3F.5 */}
        {recipe.steps.length > 0 && (
          <section aria-labelledby="procedimento-heading">
            <h2 id="procedimento-heading" className="text-h3 text-[var(--color-foreground)]">
              Procedimento
            </h2>
            <ol className="mt-4 space-y-5">
              {recipe.steps
                .slice()
                .sort((a, b) => a.step_number - b.step_number)
                .map((step) => (
                  <li key={step.step_number} className="flex gap-4">
                    <span className="text-eyebrow shrink-0 text-[var(--color-accent-text)]">{String(step.step_number).padStart(2, "0")}</span>
                    <div>
                      {step.title && <p className="text-body font-medium text-[var(--color-foreground)]">{step.title}</p>}
                      <p className="text-body text-[var(--color-foreground-muted)]">{step.instruction}</p>
                      {step.duration_minutes != null && (
                        <p className="text-meta mt-1 text-[var(--color-foreground-muted)]">{step.duration_minutes} min</p>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </section>
        )}
      </div>

      {/* USO — Step 3F.6, solo se presente. Nota Step 3G: questo è testo
          editoriale pubblico già presente nel payload, non un disclaimer
          generato autonomamente per la ricetta. */}
      {recipe.usage_instructions && (
        <section className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6">
          <h2 className="text-h3 text-[var(--color-foreground)]">Uso</h2>
          <p className="text-body mt-3 text-[var(--color-foreground-muted)]">{recipe.usage_instructions}</p>
        </section>
      )}

      {/* FOOTER EDITORIALE — Step 3F.7 */}
      <div className="mt-16 border-t border-[var(--color-border)] pt-8">
        <p className="text-small text-[var(--color-foreground-muted)]">Una ricetta MeLoProduco.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <LinkButton href="/ricette" variant="secondary" size="sm">
            Altre ricette
          </LinkButton>
          <LinkButton href="/meloproduco" variant="ghost" size="sm">
            Scopri MeLoProduco
          </LinkButton>
        </div>
      </div>

      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </Container>
  );
}

/**
 * Structured data Recipe (Step 3M) — solo con dati reali del payload
 * pubblico. NON inventa prepTime/cookTime/totalTime/nutrition/rating/author:
 * nessuno di questi campi esiste nel DTO pubblico (verificato in Step 3A),
 * quindi non compaiono nello schema. `recipeYield` viene popolato solo se
 * `yield_text` è presente e testuale (Step 3M).
 */
function buildRecipeJsonLd(recipe: PublicRecipePayload, imageUrl: string | null): string | null {
  if (recipe.ingredients.length === 0 && recipe.steps.length === 0) return null;

  const canonical = recipe.canonical_url || `${siteUrl}/ricette/${recipe.slug}`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    url: canonical,
  };

  if (recipe.excerpt) data.description = recipe.excerpt;
  if (imageUrl) data.image = [imageUrl];
  if (recipe.published_at) data.datePublished = recipe.published_at;
  if (recipe.yield_text) data.recipeYield = recipe.yield_text;

  if (recipe.ingredients.length > 0) {
    data.recipeIngredient = recipe.ingredients
      .slice()
      .sort((a, b) => a.order_index - b.order_index)
      .map((ing) => [ing.name, ing.quantity != null ? `${ing.quantity}${ing.unit ? ` ${ing.unit}` : ""}` : null].filter(Boolean).join(" — "));
  }

  if (recipe.steps.length > 0) {
    data.recipeInstructions = recipe.steps
      .slice()
      .sort((a, b) => a.step_number - b.step_number)
      .map((step) => ({
        "@type": "HowToStep",
        position: step.step_number,
        text: step.instruction,
        ...(step.title ? { name: step.title } : {}),
      }));
  }

  // Serializzazione sicura: JSON.stringify + escape di "<" per evitare che
  // una stringa contenente "</script>" chiuda prematuramente il tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
