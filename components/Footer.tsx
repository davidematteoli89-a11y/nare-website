import Link from "next/link";
import { Container } from "./Container";
import { PRIMARY_NAV, FOOTER_LEGAL_NAV } from "@/lib/nav";

/**
 * Footer (Step 1H, riallineato in Fase 1B, rifinito in Fase 2G). Brand
 * ombrello Narè. Blocchi: NARÈ (brand statement) / ESPLORA (MeLoProduco,
 * Incontri, Cristina, In RAI) / COMMUNITY (Newsletter, social solo se
 * reali) / LEGAL. Nessun logo RAI. Nessun link social inventato. Le aree
 * future (Ritiri, Famiglie, In Viaggio) non compaiono finché sono vuote.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-h3 text-[var(--color-foreground)]">Narè</p>
          <p className="text-small mt-3 max-w-xs text-[var(--color-foreground-muted)]">
            Il progetto di Cristina di Narè: economia domestica, naturopatia e divulgazione pratica, tra autoproduzione,
            incontri ed esperienze dal vivo.
          </p>
        </div>

        <div>
          <p className="text-small font-semibold text-[var(--color-foreground)]">Esplora</p>
          <ul className="mt-3 flex flex-col gap-2">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-small font-semibold text-[var(--color-foreground)]">Community</p>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link href="/newsletter" className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                Newsletter
              </Link>
            </li>
            {/* Instagram/social: nessun URL placeholder inventato (vincolo Fase 1H/2G).
                Va aggiunto qui solo quando esisterà un link reale confermato. */}
          </ul>
        </div>

        <div>
          <p className="text-small font-semibold text-[var(--color-foreground)]">Legale</p>
          <ul className="mt-3 flex flex-col gap-2">
            {FOOTER_LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-[var(--color-border)] py-6">
        <Container>
          <p className="text-meta text-[var(--color-foreground-muted)]">© {new Date().getFullYear()} Narè — Cristina di Narè.</p>
        </Container>
      </div>
    </footer>
  );
}
