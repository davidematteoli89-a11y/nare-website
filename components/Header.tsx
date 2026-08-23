import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { PRIMARY_NAV } from "@/lib/nav";

/**
 * Header editoriale pulito e sticky (Step 1G, riallineato in Fase 1B).
 * Logo/wordmark ora è il brand ombrello "Narè", non più "MeLoProduco".
 * Il descrittore "con Cristina di Narè" è predisposto come sr-only: nessun
 * mega-menu, nessuna dipendenza pesante.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Narè — torna alla homepage" className="shrink-0">
          <Image
            src="/images/branding/logo-nare.png"
            alt="Narè"
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-full object-cover"
          />
        </Link>

        <nav aria-label="Navigazione principale" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-small font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent-text)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/cerca"
            aria-label="Cerca"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
          >
            <span aria-hidden="true">🔍</span>
          </Link>
          <Link
            href="/newsletter"
            className="text-small rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-3.5 py-2 font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]"
          >
            Newsletter
          </Link>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
