import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";

const CANONICAL_URL = "https://nare-website.vercel.app/guide";

export const metadata: Metadata = {
  title: "Guide & Approfondimenti",
  description: "Guide & Approfondimenti MeLoProduco: contenuti per capire meglio casa, autoproduzione, ingredienti, pratiche e vita quotidiana.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Guide & Approfondimenti",
    description: "Contenuti per capire meglio casa, autoproduzione, ingredienti, pratiche e vita quotidiana.",
    url: CANONICAL_URL,
    type: "website",
  },
};

/**
 * /guide — Guide & Approfondimenti, archivio definitivo (Fase 7, Step
 * 7A-7E).
 *
 * GAP BACKEND DOCUMENTATO (Step 7A/7B, verificato leggendo il codice
 * sorgente reale di aiDady, non assunto):
 * - Il Public DTO per le Guide esiste già: `PublicContentPayload` in
 *   lib/services/public-dto.ts (aiDady) — { slug, title, excerpt, body,
 *   seo_title, seo_description, canonical_url, og_image_path,
 *   published_at }. Nessun topic/category pubblico.
 * - Il flusso di publish per entity_type "content_item" è già cablato in
 *   lib/services/publications.ts, incluso il constraint DB e la RLS anon
 *   (supabase/migrations/20260815124103_publishing_layer.sql,
 *   20260817140000_publications_anon_select.sql).
 * - MANCA SOLO l'endpoint REST pubblico: nessuna route
 *   app/api/public/[orgSlug]/content/route.ts (list) né .../content/
 *   [slug]/route.ts (detail), né in aiDady né nel mirror
 *   aidady-public-api. Nessun content_item è oggi raggiungibile
 *   pubblicamente.
 * - Decisione Fase 7 (Step 7B, confermata dal cliente): NON modificare
 *   aiDady in questa fase. Questa pagina resta quindi un archivio
 *   editoriale con empty state onesto, SENZA alcun client API scritto
 *   qui — verrà aggiunto in lib/aidady-api.ts (stesso pattern di
 *   listPublicRecipes/listPublicWorkshops) solo quando l'endpoint reale
 *   esisterà lato aiDady. Nessun CMS locale secondo creato (vincolo
 *   esplicito Step 7B).
 */
export default function GuidePage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>MeLoProduco</Eyebrow>
      <h1 className="text-hero-display mt-3 max-w-2xl text-[var(--color-foreground)]">Guide & Approfondimenti</h1>
      <p className="text-lead mt-5 max-w-xl text-[var(--color-foreground-muted)]">
        Contenuti per capire meglio casa, autoproduzione, ingredienti, pratiche e vita quotidiana — lo stesso metodo di
        MeLoProduco, applicato agli approfondimenti.
      </p>

      <div className="mt-12 text-center">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="Le Guide MeLoProduco stanno prendendo forma."
            description="Qui troveranno spazio approfondimenti e contenuti per comprendere meglio ciò che facciamo."
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/meloproduco" variant="secondary">
            Scopri MeLoProduco
          </LinkButton>
          <LinkButton href="/ricette" variant="ghost">
            Esplora le ricette
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
