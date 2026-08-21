"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";
import type { PublicRecipePayload } from "@/lib/aidady-api";
import { matchRecipesByMaterials, DIFFICULTY_LABELS } from "@/lib/discovery";

/**
 * "Cosa hai in casa?" — Step 11Q/11R.
 *
 * Client Component: la selezione dei materiali e il matching avvengono
 * interamente nel browser, su un dataset già caricato una volta dal Server
 * Component genitore (Step 11AA — niente fetch ripetuti). Matching
 * deterministico (lib/discovery.ts), NESSUNA AI/LLM.
 */
export function MaterialPicker({
  recipes,
  materials,
}: {
  recipes: PublicRecipePayload[];
  materials: { slug: string; name: string }[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const results = useMemo(() => {
    if (selected.size === 0) return [];
    return matchRecipesByMaterials(recipes, Array.from(selected));
  }, [recipes, selected]);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <div>
      <fieldset>
        <legend className="text-h3 text-[var(--color-foreground)]">Cosa hai a disposizione?</legend>
        <div className="mt-4 flex flex-wrap gap-2.5" role="group" aria-label="Materiali disponibili">
          {materials.map((material) => {
            const isSelected = selected.has(material.slug);
            return (
              <button
                key={material.slug}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(material.slug)}
                className={
                  "text-small min-h-[44px] rounded-[var(--radius-full)] border px-4 py-2 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] " +
                  (isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]"
                    : "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]")
                }
              >
                {material.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-10" aria-live="polite">
        {selected.size === 0 ? (
          <p className="text-body text-[var(--color-foreground-muted)]">
            Seleziona uno o più materiali qui sopra per scoprire cosa puoi realizzare.
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            title="Non abbiamo ancora trovato qualcosa che corrisponda esattamente."
            description="Prova a selezionare un altro materiale, oppure esplora tutte le preparazioni."
          />
        ) : (
          <>
            <p className="text-small mb-4 text-[var(--color-foreground-muted)]">
              {results.length} {results.length === 1 ? "risultato" : "risultati"}, dal più realizzabile.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ recipe, missing, ready }) => (
                <li key={recipe.slug}>
                  <Link
                    href={`/ricette/${recipe.slug}`}
                    className="group block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow hover:shadow-[var(--shadow-md)]"
                  >
                    {ready && (
                      <span className="text-meta mb-2 inline-block font-semibold uppercase tracking-[0.08em] text-[var(--color-success)]">
                        Già pronta
                      </span>
                    )}
                    <h3 className="text-h3 text-[var(--color-foreground)] group-hover:text-[var(--color-accent-text)]">{recipe.title}</h3>
                    {recipe.excerpt && <p className="text-small mt-2 line-clamp-2 text-[var(--color-foreground-muted)]">{recipe.excerpt}</p>}
                    <div className="text-meta mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[var(--color-foreground-muted)]">
                      {recipe.discovery.difficulty && <span>{DIFFICULTY_LABELS[recipe.discovery.difficulty]}</span>}
                      {recipe.discovery.time_minutes != null && <span>{recipe.discovery.time_minutes} min</span>}
                    </div>
                    {missing.length > 0 && (
                      <p className="text-meta mt-3 text-[var(--color-accent-text)]">
                        Ti manca: {missing.map((slug) => materials.find((m) => m.slug === slug)?.name ?? slug).join(", ")}
                      </p>
                    )}
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
