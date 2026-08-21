"use client";

import { useState } from "react";
import { VideoPlaceholder } from "./VideoPlaceholder";
import { VideoModal } from "./VideoModal";

/**
 * Estrae l'ID video da un URL YouTube standard o "youtu.be" abbreviato.
 * Ritorna null se l'URL non è riconosciuto — in quel caso il video non
 * viene reso cliccabile (fail-safe, mai un player rotto).
 */
function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) return embedMatch[1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Wrapper interattivo attorno a VideoPlaceholder (Fase 4D). Se l'intervento
 * ha videoType "youtube" e un videoUrl valido, il click apre un VideoModal
 * (player YouTube in overlay sopra la pagina, mai un redirect). Altrimenti
 * il poster resta statico/non cliccabile, esattamente come prima —
 * comportamento invariato per tutti gli interventi senza video pubblicato.
 */
export function VideoCard({
  title,
  programme,
  date,
  posterSrc,
  videoType,
  videoUrl,
}: {
  title: string;
  programme: string;
  date?: string;
  posterSrc: string;
  videoType?: string;
  videoUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const youtubeId = videoType === "youtube" && videoUrl ? extractYoutubeId(videoUrl) : null;

  if (!youtubeId) {
    return <VideoPlaceholder title={title} programme={programme} date={date} posterSrc={posterSrc} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full text-left"
        aria-haspopup="dialog"
      >
        <VideoPlaceholder title={title} programme={programme} date={date} posterSrc={posterSrc} />
      </button>
      {isOpen && <VideoModal title={title} youtubeId={youtubeId} onClose={() => setIsOpen(false)} />}
    </>
  );
}
