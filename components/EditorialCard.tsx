import Link from "next/link";
import Image from "next/image";
import { Badge } from "./Badge";

/**
 * Card editoriale riutilizzabile per Ricette, Guide, e in futuro Workshop.
 * Solo presentazione: chi la usa passa i dati già pronti (nessuna logica
 * di fetch qui dentro).
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
      className="group block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5">
        {category && <Badge className="mb-3">{category}</Badge>}
        <h3 className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-foreground)]">{title}</h3>
        {excerpt && <p className="mt-2 line-clamp-2 text-sm text-[var(--color-foreground-muted)]">{excerpt}</p>}
      </div>
    </Link>
  );
}
