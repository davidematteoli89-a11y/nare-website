"use client";

import { useState } from "react";
import type { PublicGuideMedia } from "@/lib/aidady-api";

export function MediaGallerySlider({ images, title = "Galleria" }: { images: PublicGuideMedia[]; title?: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;
  const active = images[Math.min(index, images.length - 1)];
  const showControls = images.length > 1;
  const move = (delta: number) => setIndex((current) => (current + delta + images.length) % images.length);

  return (
    <section className="mt-10" aria-labelledby="media-gallery-title">
      <div className="flex items-end justify-between gap-4">
        <h2 id="media-gallery-title" className="text-h2 text-[var(--color-foreground)]">{title}</h2>
        {showControls && <p className="text-meta text-[var(--color-foreground-muted)]">{index + 1} / {images.length}</p>}
      </div>
      <div className="relative mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.url} alt={active.alt_text || ""} className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]" />
          {active.caption && <figcaption className="bg-[var(--color-surface)] p-3 text-small text-[var(--color-foreground-muted)]">{active.caption}</figcaption>}
        </figure>
        {showControls && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Immagine precedente" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-black/45 text-xl text-white backdrop-blur-sm hover:bg-black/60">←</button>
            <button type="button" onClick={() => move(1)} aria-label="Immagine successiva" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-black/45 text-xl text-white backdrop-blur-sm hover:bg-black/60">→</button>
          </>
        )}
      </div>
      {showControls && (
        <div className="mt-3 flex justify-center gap-2" role="group" aria-label="Scegli immagine">
          {images.map((image, dotIndex) => <button key={`${image.url}-${dotIndex}`} type="button" onClick={() => setIndex(dotIndex)} aria-label={`Vai all’immagine ${dotIndex + 1}`} aria-current={dotIndex === index ? "true" : undefined} className={`size-2.5 rounded-full border border-[var(--color-accent-text)] ${dotIndex === index ? "bg-[var(--color-accent-text)]" : "bg-transparent"}`} />)}
        </div>
      )}
    </section>
  );
}
