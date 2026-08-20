import { notFound } from "next/navigation";

/**
 * Dettaglio Guida — skeleton di route (Step 1B). Non esiste ancora un
 * endpoint pubblico aiDady per le Guide (il Content Hub non ha ancora un
 * DTO pubblico dedicato verificato): per questo la pagina non fa fetch, e
 * restituisce 404 finché non verrà collegata a un endpoint reale.
 */
export default function GuideDetailPage() {
  notFound();
}
