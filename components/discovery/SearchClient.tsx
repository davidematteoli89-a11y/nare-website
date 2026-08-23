"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/Input";
import { LinkButton } from "@/components/Button";
import { EditorialCard } from "@/components/EditorialCard";
import type { PublicGuidePayload, PublicRecipePayload } from "@/lib/aidady-api";
import { resolvePublicImageUrl } from "@/lib/public-image";
import { searchRecipes } from "@/lib/discovery";

/**
 * "Cerca in MeLoProduco" — Step 11U.
 *
 * MVP volutamente semplice: filtro client-side case-insensitive
 * (.includes(), nessun LLM/ricerca semantica — vietato in questa fase) su
 * title/excerpt/category/tags/materials. Il dataset (tutte le ricette
 * pubblicate) viene passato già caricato dal Server Component genitore.
 */
export function SearchClient({ recipes, guides }: { recipes: PublicRecipePayload[]; guides: PublicGuidePayload[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => (query.trim() ? searchRecipes(recipes, query) : []), [recipes, query]);
  const guideResults = useMemo(() => { const q=query.trim().toLocaleLowerCase("it"); return q ? guides.filter(g=>[g.title,g.excerpt??"",g.area?.name??"",g.topic?.name??"",...g.tags].join(" ").toLocaleLowerCase("it").includes(q)) : []; }, [guides,query]);
  const total=results.length+guideResults.length;

  return (
    <div>
      <form className="max-w-lg" role="search" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Cerca in MeLoProduco"
          name="q"
          placeholder="Es. aceto, pulizia, candele…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </form>

      <div className="mt-10" aria-live="polite">
        {query.trim() === "" ? (
          <p className="text-body text-[var(--color-foreground-muted)]">
            Cerca per ingrediente, materiale, categoria o bisogno — es. &quot;aceto&quot; o &quot;pulire&quot;.
          </p>
        ) : total === 0 ? (
          <EmptyState
            title="Non abbiamo ancora trovato qualcosa che corrisponda esattamente."
            description="Prova un altro termine, oppure esplora tutte le preparazioni MeLoProduco."
          />
        ) : (
          <>
            <p className="text-small mb-4 text-[var(--color-foreground-muted)]">
              {total} {total === 1 ? "risultato" : "risultati"} per &quot;{query.trim()}&quot;
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((recipe) => (
                <li key={recipe.slug}>
                  <EditorialCard href={`/ricette/${recipe.slug}`} title={recipe.title} excerpt={recipe.excerpt ?? undefined} imageSrc={recipe.cover_image?.url ?? resolvePublicImageUrl(recipe.og_image_path) ?? "/images/placeholders/editorial-generic.png"} imageAlt={recipe.cover_image?.alt_text || recipe.title} />
                </li>
              ))}
              {guideResults.map((guide) => <li key={`guide-${guide.slug}`}><EditorialCard href={`/guide/${guide.slug}`} title={guide.title} excerpt={guide.excerpt ?? undefined} category={guide.topic?.name ?? guide.area?.name ?? "MeLoProduco"} imageSrc={guide.cover_image?.url ?? resolvePublicImageUrl(guide.og_image_path) ?? "/images/placeholders/editorial-generic.png"} imageAlt={guide.cover_image?.alt_text || guide.title} /></li>)}
            </ul>
          </>
        )}
      </div>

      <div className="mt-10 border-t border-[var(--color-border)] pt-6">
        <LinkButton href="/ricette" variant="ghost" size="sm">
          Esplora tutte le preparazioni
        </LinkButton>
      </div>
    </div>
  );
}
