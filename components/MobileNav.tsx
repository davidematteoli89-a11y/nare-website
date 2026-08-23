"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { PRIMARY_NAV } from "@/lib/nav";
import { NewsletterFormShell } from "./NewsletterFormShell";

/** Menu mobile compatto: hamburger + drawer leggero, senza dipendenze esterne (Step 1C, 1G). */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          {open ? "✕" : "☰"}
        </span>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Chiudi menu"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col gap-6 overflow-y-auto overscroll-contain bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Link href="/" aria-label="Narè — torna alla homepage" onClick={() => setOpen(false)}>
                <Image src="/images/branding/logo-nare.png" alt="Narè" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
              </Link>
              <button
                type="button"
                aria-label="Chiudi menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-subtle)]"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <nav aria-label="Navigazione principale">
              <ul className="flex flex-col gap-1">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-body block rounded-[var(--radius-md)] px-2 py-2.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/cerca"
                    onClick={() => setOpen(false)}
                    className="text-body block rounded-[var(--radius-md)] px-2 py-2.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
                  >
                    Cerca
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="mt-auto border-t border-[var(--color-border)] pt-6">
              <p className="text-small mb-3 font-medium text-[var(--color-foreground)]">Un po&apos; di Narè, via mail.</p>
              <NewsletterFormShell />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
