import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { EditorialCard } from "@/components/EditorialCard";
import { listPublicRecipes, resolvePublicImageUrl, type PublicRecipePayload } from "@/lib/aidady-api";

/**
 * Archivio /ricette definitivo — Fase 3, Step 3D/3E.
 *
 * Niente filtri per categoria (Step 3E): il DTO pubblico di Recipe non
 * espone alcuna taxonomy strutturata (verificato in Step 3A leggendo
 * lib/services/public-dto.ts — nessun campo category/tag). Aggiungerli
 * richiederebbe prima un lavoro in aiDady (campo pubblico dedicato), fuori
 * scope qui: NON modificato aiDady in questa fase.
 *
 * Pagination (Step 3D): l'endpoint list non restituisce un totale
 * (`{ items, limit, offset }` soltanto — verificato in Step 3A), quindi non
 * si può calcolare un numero di pagine reale. Si usa "Precedenti/Successive"
 * con un'euristica onesta: "Successive" compare solo se sono arrivati
 * esattamente `limit` elementi (segno che potrebbero essercene altri).
 */

export const metadata: Metadata = {
  title: "Ricette & Autoproduzione",
  description: "L'archivio delle ricette e autoproduzioni MeLoProduco: casa, preparazioni, botanica, testate prima di essere condivise.",
};

const PAGE_SIZE = 12;

export default async function RicettePage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);
  const offset = (pageNumber - 1) * PAGE_SIZE;

  const result = await safeListRecipes(offset);

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        eyebrow="MeLoProduco"
        title="Ricette & Autoproduzione"
        description="L'archivio delle ricette e preparazioni MeLoProduco: pratiche quotidiane studiate con criterio e testate prima di essere condivise."
      />

      <div className="mt-10">
        {result === null ? (
          <EmptyState
            title="L'archivio non è disponibile in questo momento."
            description="Riprova tra qualche minuto, oppure torna a MeLoProduco."
          />
        ) : result.items.length === 0 && pageNumber === 1 ? (
          <EmptyState
            title="Le prime ricette MeLoProduco stanno arrivando."
            description="Questo archivio si popolerà con le prossime pubblicazioni."
          />
        ) : result.items.length === 0 ? (
          <EmptyState title="Non ci sono altre ricette da mostrare." description="Torna alla pagina precedente per continuare a esplorare l'archivio." />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>

            <Pagination pageNumber={pageNumber} hasNext={result.items.length === PAGE_SIZE} />
          </>
        )}
      </div>
    </Container>
  );
}

async function safeListRecipes(offset: number) {
  try {
    return await listPublicRecipes({ limit: PAGE_SIZE, offset });
  } catch {
    return null; // null = API irraggiungibile/malformata
  }
}

function RecipeCard({ recipe }: { recipe: PublicRecipePayload }) {
  return (
    <EditorialCard
      href={`/ricette/${recipe.slug}`}
      title={recipe.title}
      excerpt={recipe.excerpt ?? undefined}
      imageSrc={resolvePublicImageUrl(recipe.og_image_path) ?? "/images/placeholders/editorial-generic.png"}
      imageAlt={recipe.title}
    />
  );
}

function Pagination({ pageNumber, hasNext }: { pageNumber: number; hasNext: boolean }) {
  const hasPrev = pageNumber > 1;
  if (!hasPrev && !hasNext) return null;

  return (
    <nav aria-label="Navigazione archivio ricette" className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
      {hasPrev ? (
        <Link
          href={pageNumber === 2 ? "/ricette" : `/ricette?pagina=${pageNumber - 1}`}
          className="text-small font-medium text-[var(--color-accent-text)] hover:underline"
        >
          ← Precedenti
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {hasNext ? (
        <Link href={`/ricette?pagina=${pageNumber + 1}`} className="text-small font-medium text-[var(--color-accent-text)] hover:underline">
          Successive →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
