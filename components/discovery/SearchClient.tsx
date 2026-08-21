"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/Input";
import { LinkButton } from "@/components/Button";
import type { PublicRecipePayload } from "@/lib/aidady-api";
import { searchRecipes } from "@/lib/discovery";

/**
 * "Cerca in MeLoProduco" — Step 11U.
 *
 * MVP volutamente semplice: filtro client-side case-insensitive
 * (.includes(), nessun LLM/ricerca semantica — vietato in questa fase) su
 * title/excerpt/category/tags/materials. Il dataset (tutte le ricette
 * pubblicate) viene passato già caricato dal Server Component genitore.
 */
export function SearchClient({ recipes }: { recipes: PublicRecipePayload[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => (query.trim() ? searchRecipes(recipes, query) : []), [recipes, query]);

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
        ) : results.length === 0 ? (
          <EmptyState
            title="Non abbiamo ancora trovato qualcosa che corrisponda esattamente."
            description="Prova un altro termine, oppure esplora tutte le preparazioni MeLoProduco."
          />
        ) : (
          <>
            <p className="text-small mb-4 text-[var(--color-foreground-muted)]">
              {results.length} {results.length === 1 ? "risultato" : "risultati"} per &quot;{query.trim()}&quot;
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((recipe) => (
                <li key={recipe.slug}>
                  <Link
                    href={`/ricette/${recipe.slug}`}
                    className="group block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow hover:shadow-[var(--shadow-md)]"
                  >
                    <h3 className="text-h3 text-[var(--color-foreground)] group-hover:text-[var(--color-accent-text)]">{recipe.title}</h3>
                    {recipe.excerpt && <p className="text-small mt-2 line-clamp-2 text-[var(--color-foreground-muted)]">{recipe.excerpt}</p>}
                  </Link>
                </li>
              ))}
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
