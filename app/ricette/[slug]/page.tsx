import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicRecipe } from "@/lib/aidady-api";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/**
 * Dettaglio Recipe — Step 1B/1L: skeleton di route che dimostra la
 * foundation API funzionante (getPublicRecipe), con layout minimo.
 * Il design editoriale completo (hero, related content, ecc. — vedi Fase 0
 * punto 10) è demandato alla Fase 2/3.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getPublicRecipe(slug);
  if (!recipe) return {};

  return {
    title: recipe.seo_title || recipe.title,
    description: recipe.seo_description || recipe.excerpt || undefined,
    alternates: recipe.canonical_url ? { canonical: recipe.canonical_url } : undefined,
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getPublicRecipe(slug);
  if (!recipe) notFound();

  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Ricette", href: "/ricette" }, { label: recipe.title }]} />

      <h1 className="mt-4 font-[family-name:var(--font-serif)] text-3xl text-[var(--color-foreground)] sm:text-4xl">{recipe.title}</h1>
      {recipe.excerpt && <p className="mt-3 max-w-2xl text-[var(--color-foreground-muted)]">{recipe.excerpt}</p>}

      {recipe.ingredients.length > 0 && (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-serif)] text-xl text-[var(--color-foreground)]">Ingredienti</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-foreground-muted)]">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.name}
                {ing.quantity ? ` — ${ing.quantity}${ing.unit ? ` ${ing.unit}` : ""}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps.length > 0 && (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-serif)] text-xl text-[var(--color-foreground)]">Procedimento</h2>
          <ol className="mt-3 space-y-3 text-sm text-[var(--color-foreground-muted)]">
            {recipe.steps.map((step) => (
              <li key={step.step_number}>
                <span className="font-medium text-[var(--color-foreground)]">{step.step_number}.</span> {step.instruction}
              </li>
            ))}
          </ol>
        </section>
      )}
    </Container>
  );
}
