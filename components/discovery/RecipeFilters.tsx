"use client";

import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AvailableFilters } from "@/lib/aidady-api";
import { DIFFICULTY_LABELS, COST_LABELS, SEASON_LABELS } from "@/lib/discovery";

/**
 * Filtri /ricette — Step 11T.
 *
 * Sincronizzati con i query param URL (condivisibile), aggiornati con
 * `router.push(..., { scroll: false })` per non far saltare la pagina in
 * cima ad ogni cambio filtro. Desktop: barra filtri sobria sempre visibile.
 * Mobile: stesso pattern "drawer" già usato da MobileNav (bottone che apre
 * un pannello full-height con overlay, aria-expanded/aria-modal), per
 * restare coerenti con un pattern già esistente nel sito invece di
 * inventarne uno nuovo.
 */
const FILTER_KEYS = ["category", "need", "environment", "context", "material", "difficulty", "cost", "season"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export function RecipeFilters({ filters }: { filters: AvailableFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerId = useId();

  const active: Partial<Record<FilterKey, string>> = {};
  for (const key of FILTER_KEYS) {
    const v = searchParams.get(key);
    if (v) active[key] = v;
  }
  const activeCount = Object.keys(active).length;

  function setParam(key: FilterKey, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    // Reset pagination quando si cambia filtro: pagine oltre 1 potrebbero
    // non avere senso con il nuovo set di risultati.
    params.delete("pagina");
    router.push(`/ricette${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  function clearAll() {
    router.push("/ricette", { scroll: false });
    setMobileOpen(false);
  }

  const groups = buildGroups(filters);
  if (groups.every((g) => g.options.length === 0)) return null;

  return (
    <div className="mb-8">
      {/* Mobile: bottone che apre drawer, stesso pattern di MobileNav */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={drawerId}
          onClick={() => setMobileOpen(true)}
          className="text-small min-h-[44px] rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-medium text-[var(--color-foreground)]"
        >
          Filtri{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="text-small font-medium text-[var(--color-accent-text)] hover:underline">
            Azzera filtri
          </button>
        )}
      </div>

      {/* Desktop: barra filtri sobria sempre visibile */}
      <div className="hidden sm:block">
        <FilterBar groups={groups} active={active} onChange={setParam} onClear={activeCount > 0 ? clearAll : undefined} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <button type="button" aria-label="Chiudi filtri" className="flex-1 bg-[var(--color-foreground)]/30" onClick={() => setMobileOpen(false)} />
          <div
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Filtri ricette"
            className="flex h-full w-80 max-w-[90vw] flex-col gap-6 overflow-y-auto bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-h3 text-[var(--color-foreground)]">Filtri</span>
              <button
                type="button"
                aria-label="Chiudi filtri"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-subtle)]"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <FilterBar groups={groups} active={active} onChange={setParam} onClear={undefined} stacked />
            <div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border)] pt-6">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-small min-h-[44px] rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-4 font-medium text-[var(--color-foreground)]"
                >
                  Azzera filtri
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-small min-h-[44px] rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 font-medium text-white"
              >
                Mostra risultati
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterGroup {
  key: FilterKey;
  label: string;
  options: { value: string; label: string }[];
}

function buildGroups(filters: AvailableFilters): FilterGroup[] {
  return [
    { key: "category", label: "Categoria", options: filters.categories.map((c) => ({ value: c.slug, label: c.name })) },
    { key: "need", label: "Bisogno", options: filters.needs.map((n) => ({ value: n.slug, label: n.name })) },
    { key: "environment", label: "Ambiente", options: filters.environments.map((e) => ({ value: e.slug, label: e.name })) },
    { key: "context", label: "Contesto", options: filters.contexts.map((c) => ({ value: c.slug, label: c.name })) },
    { key: "material", label: "Materiale", options: filters.materials.map((m) => ({ value: m.slug, label: m.name })) },
    { key: "difficulty", label: "Difficoltà", options: filters.difficulties.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] })) },
    { key: "cost", label: "Costo", options: filters.costLevels.map((c) => ({ value: c, label: COST_LABELS[c] })) },
    { key: "season", label: "Stagione", options: filters.seasons.map((s) => ({ value: s, label: SEASON_LABELS[s] })) },
  ];
}

function FilterBar({
  groups,
  active,
  onChange,
  onClear,
  stacked,
}: {
  groups: FilterGroup[];
  active: Partial<Record<FilterKey, string>>;
  onChange: (key: FilterKey, value: string | null) => void;
  onClear?: () => void;
  stacked?: boolean;
}) {
  const visibleGroups = groups.filter((g) => g.options.length > 0);
  if (visibleGroups.length === 0) return null;

  return (
    <div className={stacked ? "flex flex-col gap-6" : "flex flex-wrap items-end gap-4"}>
      {visibleGroups.map((group) => (
        <FilterSelect key={group.key} group={group} value={active[group.key] ?? ""} onChange={(v) => onChange(group.key, v || null)} />
      ))}
      {onClear && (
        <button type="button" onClick={onClear} className="text-small mb-0.5 font-medium text-[var(--color-accent-text)] hover:underline">
          Azzera filtri
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  group,
  value,
  onChange,
}: {
  group: FilterGroup;
  value: string;
  onChange: (value: string) => void;
}) {
  const selectId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-foreground)]">
        {group.label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 min-w-[160px] rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
      >
        <option value="">Tutte</option>
        {group.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
