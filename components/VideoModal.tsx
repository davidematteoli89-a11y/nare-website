"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Modale video (Fase 4D) — apre un player YouTube embeddato SOPRA la pagina
 * corrente, senza mai far lasciare il sito all'utente (niente redirect a
 * youtube.com, niente nuova scheda). L'iframe viene montato solo quando il
 * modale è aperto (mai in background): nessun autoplay al caricamento della
 * pagina, il video parte solo dopo un'azione esplicita dell'utente (aprire
 * il modale), coerente con il requisito "no autoplay" delle fasi precedenti.
 *
 * Chiusura: bottone X, tasto Esc, o click sull'overlay. Focus trap minimale
 * (focus sul bottone di chiusura all'apertura) per accessibilità da tastiera.
 */
export function VideoModal({
  title,
  youtubeId,
  onClose,
}: {
  title: string;
  youtubeId: string;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    // Blocca lo scroll della pagina sottostante finché il modale è aperto.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4 pb-3">
          <h2 id={titleId} className="text-h3 text-white">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Chiudi video"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
