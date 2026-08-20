import { notFound } from "next/navigation";

/**
 * Dettaglio Narè Incontri — skeleton di route (Fase 1B, sostituisce
 * /workshop/[slug]). L'endpoint pubblico aiDady
 * GET /api/public/[orgSlug]/workshops/[slug] esiste già, ma il
 * collegamento reale è demandato a una fase successiva, quando esisteranno
 * Incontri pubblici pubblicati (oggi: 0 workshop in aiDady).
 */
export default function IncontriDetailPage() {
  notFound();
}
