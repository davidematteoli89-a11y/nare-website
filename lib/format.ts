/**
 * Formattazione data in italiano, condivisa da Narè Incontri (Fase 5) e da
 * eventuali usi futuri. Nessuna dipendenza esterna: usa Intl nativo.
 *
 * `dateOnly` per date-only ISO ("2026-08-21") evita lo shift di fuso orario
 * che si otterrebbe interpretando la stringa come UTC midnight e poi
 * formattandola nel fuso locale del browser/server.
 */
export function formatDateIt(iso: string, options: { withTime?: boolean } = {}): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const datePart = date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  });

  if (!options.withTime) return datePart;

  const timePart = date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });

  return `${datePart}, ore ${timePart}`;
}

export function formatPriceEur(amount: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount);
}
