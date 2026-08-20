import Image from "next/image";

/**
 * Pattern placeholder per un futuro video (Step 1P).
 * NON integra Cloudflare Stream/RaiPlay/YouTube in questa fase: mostra solo
 * poster + titolo + programma + data opzionale + icona play statica,
 * pensato per essere sostituito 1:1 da un vero player in una fase futura
 * senza cambiare l'interfaccia del componente che lo consuma.
 * Nessun autoplay, nessun video reale caricato qui.
 */
export function VideoPlaceholder({
  title,
  programme,
  date,
  posterSrc,
}: {
  title: string;
  programme: string;
  date?: string;
  posterSrc: string;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="relative aspect-video w-full bg-[var(--color-surface-subtle)]">
        <Image src={posterSrc} alt={`${title} — ${programme}`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-foreground)]/10">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--color-accent)] shadow-[var(--shadow-md)]"
          >
            ▶
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-meta font-semibold uppercase tracking-[0.08em] text-[var(--color-accent-text)]">
          {programme}
          {date ? ` · ${date}` : ""}
        </p>
        <h3 className="text-h3 mt-1 text-[var(--color-foreground)]">{title}</h3>
      </div>
    </div>
  );
}
