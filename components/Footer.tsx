import Link from "next/link";
import { Container } from "./Container";
import { PRIMARY_NAV, FOOTER_LEGAL_NAV, FUTURE_NAV } from "@/lib/nav";

/**
 * Footer (Step 1H, riallineato in Fase 1B, rifinito in Fase 2G). Brand
 * ombrello Narè. Blocchi: NARÈ (brand statement) / ESPLORA (MeLoProduco,
 * Incontri, Cristina, In RAI + Ritiri/Famiglie/In Viaggio, Fase 6 Step 6S)
 * / COMMUNITY (Newsletter, social solo se reali) / LEGAL. Nessun logo RAI.
 * Nessun link social inventato.
 *
 * Ritiri/Famiglie/In Viaggio compaiono qui (Fase 6) ora che le rispettive
 * pagine hanno contenuto editoriale reale, ma restano fuori dall'header
 * (nav primaria MVP, vedi Header.tsx) per non appesantire la navigazione
 * principale — 7 voci testuali in una colonna footer restano ordinate,
 * mentre 7 voci in una nav orizzontale non lo sarebbero.
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
            {FUTURE_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                  Narè {item.label}
                </Link>
              </li>
            ))}
            {/* Fase 11, Step 11W/11X: nuovi accessi discovery — Percorsi e
                "Cosa hai in casa" raggiungibili dal footer, senza affollare
                l'header principale (stesso criterio già usato per
                Ritiri/Famiglie/In Viaggio, vedi nota Fase 6 sopra). */}
            <li>
              <Link href="/meloproduco/percorsi" className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                Percorsi
              </Link>
            </li>
            <li>
              <Link href="/meloproduco/cosa-hai-in-casa" className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                Cosa hai in casa
              </Link>
            </li>
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
            {/* Fase 12, Step 12X: CTA lead gen discreta, stesso stile testuale
                delle altre voci — non deve competere visivamente con
                Newsletter, quindi nessun bottone/badge, solo un link in più
                nella stessa lista. */}
            <li>
              <Link href="/occasioni-speciali" className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                Occasioni speciali
              </Link>
            </li>
            <li>
              <Link href="/porta-nare-da-te" className="text-small text-[var(--color-foreground-muted)] hover:text-[var(--color-accent-text)]">
                Porta Narè da te
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
