import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Immagine di una Recipe con fallback editoriale (Fase 3, Step 3H/3I).
 *
 * `src` deve già essere un URL assoluto validato (vedi
 * `resolvePublicImageUrl` in lib/aidady-api.ts) o `null`. Oggi
 * `og_image_path` è sempre `null` per ogni Recipe pubblicata (verificato in
 * Fase 3, Step 3A — nessuna UI editoriale lo valorizza ancora), quindi il
 * fallback qui sotto è il caso comune, non un'eccezione rara.
 *
 * Il fallback NON deve sembrare "immagine mancante": niente icona rotta,
 * niente sfondo grigio piatto. Usa una superficie calda coerente col
 * design system, un piccolo wordmark "MeLoProduco" e una texture CSS
 * leggerissima (nessuna immagine generata, nessuno stock).
 */
export function RecipeImage({
  src,
  alt,
  className,
  priority,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-[var(--color-surface-subtle)]", className)}>
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[var(--color-accent-subtle)]",
        className
      )}
      role="img"
      aria-label={alt}
    >
      {/* Texture CSS minima: pochi puntini diagonali, nessuna immagine esterna */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="relative text-eyebrow text-[var(--color-accent-text)]">MeLoProduco</span>
    </div>
  );
}
