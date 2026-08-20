"use client";

import { useState } from "react";
import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/nav";
import { NewsletterFormShell } from "./NewsletterFormShell";

/** Menu mobile compatto: hamburger + drawer leggero, senza dipendenze esterne (Step 1C, 1G). */
export function MobileNav() {
  const [open, setOpen] = useState(false);

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

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Chiudi menu"
            className="flex-1 bg-[var(--color-foreground)]/30"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            className="flex h-full w-72 max-w-[85vw] flex-col gap-6 bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-foreground)]">Narè</span>
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
                      className="block rounded-[var(--radius-md)] px-2 py-2.5 text-base text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/cerca"
                    onClick={() => setOpen(false)}
                    className="block rounded-[var(--radius-md)] px-2 py-2.5 text-base text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
                  >
                    Cerca
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="mt-auto border-t border-[var(--color-border)] pt-6">
              <p className="mb-3 text-sm font-medium text-[var(--color-foreground)]">Una mail utile, non rumore.</p>
              <NewsletterFormShell />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
