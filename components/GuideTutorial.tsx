"use client";

import { useState } from "react";
import type { PublicGuideMedia } from "@/lib/aidady-api";

function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname === "youtu.be" ? parsed.pathname.split("/").filter(Boolean)[0] : parsed.searchParams.get("v");
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function GuideTutorial({ media, guideTitle }: { media: PublicGuideMedia; guideTitle: string }) {
  const title = media.title || `Tutorial: ${guideTitle}`;
  const [youtubeStarted, setYoutubeStarted] = useState(false);

  if (media.type === "youtube") {
    const id = youtubeId(media.url);
    if (!id) return null;
    return (
      <section className="mt-10" aria-labelledby="guide-tutorial-title">
        <h2 id="guide-tutorial-title" className="text-h2 text-[var(--color-foreground)]">Video / Tutorial</h2>
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
          {youtubeStarted ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
              title={title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setYoutubeStarted(true)}
              className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-[var(--color-foreground)] hover:bg-[var(--color-accent-subtle)]"
            >
              <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl text-white">▶</span>
              <span className="font-medium">Guarda il tutorial</span>
              <span className="text-small text-[var(--color-foreground-muted)]">Il player YouTube si carica solo dopo il tuo clic.</span>
            </button>
          )}
        </div>
        {media.caption && <p className="text-small mt-3 text-[var(--color-foreground-muted)]">{media.caption}</p>}
      </section>
    );
  }

  if (media.type === "video_upload") {
    return (
      <section className="mt-10" aria-labelledby="guide-tutorial-title">
        <h2 id="guide-tutorial-title" className="text-h2 text-[var(--color-foreground)]">Video / Tutorial</h2>
        <video className="mt-4 aspect-video w-full rounded-[var(--radius-lg)] bg-black" controls preload="metadata" poster={media.thumbnail_url ?? undefined}>
          <source src={media.url} />
          Il tuo browser non supporta la riproduzione video.
        </video>
        {media.caption && <p className="text-small mt-3 text-[var(--color-foreground-muted)]">{media.caption}</p>}
      </section>
    );
  }

  const instagram = media.type === "instagram_reel";
  return (
    <section className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-6" aria-labelledby="guide-tutorial-title">
      <h2 id="guide-tutorial-title" className="text-h3 text-[var(--color-foreground)]">{title}</h2>
      {media.caption && <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{media.caption}</p>}
      <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-small mt-4 inline-block font-medium text-[var(--color-accent-text)] underline underline-offset-4">
        {instagram ? "Guarda il Reel su Instagram" : "Guarda il video"} ↗
      </a>
    </section>
  );
}
