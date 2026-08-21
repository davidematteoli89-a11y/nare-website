"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";
import type { AvailableFilters, PublicRecipePayload } from "@/lib/aidady-api";
import { DIFFICULTY_LABELS, TIME_RANGE_LABELS, matchesTimeRange, type TimeRange } from "@/lib/discovery";

/**
 * /meloproduco/esplora — Step 11S.
 *
 * Discovery a step progressivi e leggeri (NON un wizard modale): ogni
 * selezione è opzionale, aggiorna l'URL (condivisibile) e i risultati si
 * aggiornano subito, senza dover completare tutti gli step.
 *
 * Filtri server-applicabili (need/environment/context/difficulty) sono già
 * stati applicati dal Server Component genitore chiamando l'API con quei
 * query param (vedi page.tsx) — questo componente riceve `recipes` già
 * filtrate lato server e applica QUI SOLO il filtro tempo (range), che
 * l'API pubblica non supporta nativamente (solo il valore esatto è nel
 * payload, non un filtro "range" — vedi lib/discovery.ts).
 */
export function ExploraClient({ recipes, filters }: { recipes: PublicRecipePayload[]; filters: AvailableFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const need = searchParams.get("need");
  const environment = searchParams.get("environment");
  const difficulty = searchParams.get("difficulty");
  const timeRange = searchParams.get("time") as TimeRange | null;

  const results = useMemo(() => recipes.filter((r) => matchesTimeRange(r.discovery.time_minutes, timeRange)), [recipes, timeRange]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/meloproduco/esplora${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  const anySelectionMade = Boolean(need || environment || difficulty || timeRange);

  return (
    <div>
      <div className="space-y-8">
        <StepChoice
          title="Cosa vuoi fare oggi?"
          options={filters.needs.map((n) => ({ value: n.slug, label: n.name }))}
          value={need}
          onChange={(v) => setParam("need", v)}
        />
        <StepChoice
          title="Dove?"
          options={filters.environments.map((e) => ({ value: e.slug, label: e.name }))}
          value={environment}
          onChange={(v) => setParam("environment", v)}
        />
        <StepChoice
          title="Quanto tempo hai?"
          options={(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((r) => ({ value: r, label: TIME_RANGE_LABELS[r] }))}
          value={timeRange}
          onChange={(v) => setParam("time", v)}
        />
        <StepChoice
          title="Quanto tempo vuoi dedicarci in termini di difficoltà?"
          options={filters.difficulties.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] }))}
          value={difficulty}
          onChange={(v) => setParam("difficulty", v)}
        />
      </div>

      <div className="mt-12 border-t border-[var(--color-border)] pt-10">
        {results.length === 0 ? (
          <EmptyState
            title="Non abbiamo ancora trovato qualcosa che corrisponda esattamente."
            description="Prova a rimuovere un filtro, oppure esplora tutte le preparazioni MeLoProduco."
          />
        ) : (
          <>
            <p className="text-small mb-4 text-[var(--color-foreground-muted)]">
              {results.length} {results.length === 1 ? "preparazione trovata" : "preparazioni trovate"}
              {anySelectionMade ? "." : " in totale."}
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
        <div className="mt-8">
          <LinkButton href="/ricette" variant="ghost" size="sm">
            Esplora tutte le preparazioni
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

function StepChoice({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  if (options.length === 0) return null;

  return (
    <fieldset>
      <legend className="text-h3 text-[var(--color-foreground)]">{title}</legend>
      <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label={title}>
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(isSelected ? null : opt.value)}
              className={
                "text-small min-h-[44px] rounded-[var(--radius-full)] border px-4 py-2 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] " +
                (isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]"
                  : "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
