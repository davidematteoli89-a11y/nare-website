import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkButton } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { NewsletterFormShell } from "@/components/NewsletterFormShell";
import { FUTURE_NAV } from "@/lib/nav";

/**
 * Homepage — Step 1I, riallineata in Fase 1B: shell minima di verifica
 * layout/typography/spacing/responsive per il brand ombrello Narè. NON è
 * la Home definitiva (Fase 2+): i blocchi sotto sono placeholder
 * espliciti, senza copy finale né dati reali da aiDady.
 *
 * Riallineamento concettuale (Fase 1B, punti 8-9): l'Hero non parla più
 * solo di autoproduzione, ma introduce Narè come ombrello (fare, imparare,
 * condividere, esperienze) con Cristina al centro. Un blocco "Mondi Narè"
 * introduce i progetti: MeLoProduco (unico con contenuto reale oggi) è in
 * evidenza, le aree senza contenuto reale (Ritiri, Famiglie, In Viaggio)
 * sono mostrate solo come anteprima di architettura, non come sezioni
 * finite — verranno rimosse o sviluppate quando avranno contenuto reale.
 */
export default function HomePage() {
  return (
    <>
      {/* Hero placeholder */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Narè</Eyebrow>
            <h1 className="mt-4 font-[family-name:var(--font-serif)] text-4xl leading-tight text-[var(--color-foreground)] sm:text-5xl">
              Fare, imparare, condividere.
            </h1>
            <p className="mt-4 max-w-md text-[var(--color-foreground-muted)]">
              Placeholder Hero — copy definitivo e foto di Cristina in Fase 2. Questa sezione verifica solo gerarchia
              tipografica e spaziatura; lo slogan non è ancora definitivo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/cristina">Scopri Narè</LinkButton>
              <LinkButton href="/meloproduco" variant="secondary">
                Esplora MeLoProduco
              </LinkButton>
            </div>
          </div>
          <div className="aspect-[4/3] w-full rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)]" />
        </Container>
      </section>

      {/* Chi è Cristina — placeholder */}
      <Container className="py-16">
        <SectionHeader eyebrow="Chi è Cristina" title="Economia domestica, naturopatia, divulgazione pratica" />
        <p className="mt-6 max-w-2xl text-[var(--color-foreground-muted)]">
          Placeholder — bio breve in arrivo in Fase 2, con contenuti reali dalla pagina{" "}
          <span className="font-medium text-[var(--color-foreground)]">/cristina</span>.
        </p>
      </Container>

      {/* Mondi Narè — placeholder, brand architecture */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16">
          <SectionHeader eyebrow="I progetti" title="I mondi di Narè" description="MeLoProduco è oggi il progetto con più contenuti; le altre aree sono in costruzione." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/meloproduco"
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]"
            >
              <p className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-foreground)]">MeLoProduco</p>
              <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">Autoproduzione, casa, ricette e guide.</p>
            </Link>
            <Link
              href="/incontri"
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]"
            >
              <p className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-foreground)]">Narè Incontri</p>
              <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">Workshop e laboratori dal vivo.</p>
            </Link>
            {FUTURE_NAV.map((area) => (
              <div key={area.href} className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 opacity-70">
                <p className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-foreground)]">Narè {area.label}</p>
                <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">In preparazione.</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Cristina in RAI — placeholder */}
      <Container className="py-16">
        <SectionHeader eyebrow="Media" title="Cristina in RAI" description="Placeholder — interventi selezionati in arrivo." />
        <div className="mt-8">
          <EmptyState
            title="Nessun intervento ancora pubblicato in questa fase."
            description="Gli interventi RAI saranno collegati dopo la verifica dei diritti d'uso (vedi Fase 0, punto 8)."
          />
        </div>
      </Container>

      {/* Ultime ricette — placeholder */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16">
          <SectionHeader
            eyebrow="Da MeLoProduco"
            title="Ultime ricette e autoproduzioni"
            description="Placeholder — alimentato in futuro da aiDady Publishing."
          />
          <div className="mt-8">
            <EmptyState title="Archivio ricette non ancora collegato." description="Fondamenta tecniche in corso (Fase 1)." />
          </div>
        </Container>
      </div>

      {/* Metodo — placeholder */}
      <Container className="py-16">
        <SectionHeader eyebrow="Metodo" title="Ricerca, verifica, prova, condivisione" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Studiamo le fonti", "Valutiamo con prudenza", "Testiamo prima di condividere", "Pubblichiamo solo ciò che è pronto"].map(
            (step) => (
              <div key={step} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <p className="text-sm text-[var(--color-foreground)]">{step}</p>
              </div>
            )
          )}
        </div>
      </Container>

      {/* Newsletter */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-12">
            <SectionHeader eyebrow="Newsletter" title="Una mail utile, non rumore." />
            <div className="mt-6 max-w-md">
              <NewsletterFormShell compact />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
