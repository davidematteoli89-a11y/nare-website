import Link from "next/link";
import Image from "next/image";
import { Badge } from "./Badge";

/**
 * Card editoriale riutilizzabile per Ricette, Guide, Incontri, e in futuro
 * altre aree Narè. Solo presentazione: chi la usa passa i dati già pronti
 * (nessuna logica di fetch qui dentro).
 *
 * Component polish (Fase 2E): immagine protagonista (aspect ratio più
 * ampio, 4:3), titolo forte in serif, metadata discreto (Badge testuale,
 * non pillola), hover minimo — solo un cambio di ombra, niente scale
 * transform da e-commerce.
 */
export function EditorialCard({
  href,
  title,
  excerpt,
  category,
  imageSrc,
  imageAlt,
}: {
  href: string;
  title: string;
  excerpt?: string;
  category?: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow duration-200 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        {category && <Badge className="mb-2 block">{category}</Badge>}
        <h3 className="text-h3 text-[var(--color-foreground)] group-hover:text-[var(--color-accent-text)]">{title}</h3>
        {excerpt && <p className="text-small mt-2 line-clamp-2 text-[var(--color-foreground-muted)]">{excerpt}</p>}
      </div>
    </Link>
  );
}
