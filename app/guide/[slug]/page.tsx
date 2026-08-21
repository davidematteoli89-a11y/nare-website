import { notFound } from "next/navigation";

/**
 * Dettaglio Guida — skeleton di route (Step 1B, riverificato in Fase 7
 * Step 7A/7F).
 *
 * Audit Fase 7 (verificato leggendo il codice sorgente reale di aiDady):
 * il Public DTO per le Guide esiste già (`PublicContentPayload` in
 * lib/services/public-dto.ts — slug/title/excerpt/body/SEO/og_image_path/
 * published_at) e il flusso di publish per "content_item" è già cablato,
 * ma MANCA l'endpoint REST pubblico list/detail (nessuna route
 * app/api/public/[orgSlug]/content/... né in aiDady né nel mirror
 * aidady-public-api). Nessun content_item è oggi raggiungibile
 * pubblicamente — per questo questa pagina resta uno skeleton 404, senza
 * fetch, coerente con /guide (vedi app/guide/page.tsx per il dettaglio
 * completo del gap). Andrà costruita come detail route reale (breadcrumb,
 * hero, body rendering sicuro, Article JSON-LD) solo quando l'endpoint
 * esisterà lato aiDady.
 */
export default function GuideDetailPage() {
  notFound();
}
