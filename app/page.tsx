import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkButton } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { NewsletterFormShell } from "@/components/NewsletterFormShell";

/**
 * Homepage — Step 1I: shell minima di verifica layout/typography/spacing/
 * responsive. NON è la Home definitiva (Fase 2+): i blocchi sotto sono
 * placeholder espliciti, senza copy finale né dati reali da aiDady.
 */
export default function HomePage() {
  return (
    <>
      {/* Hero placeholder */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>MeLoProduco</Eyebrow>
            <h1 className="mt-4 font-[family-name:var(--font-serif)] text-4xl leading-tight text-[var(--color-foreground)] sm:text-5xl">
              Conoscere, scegliere, produrre.
            </h1>
            <p className="mt-4 max-w-md text-[var(--color-foreground-muted)]">
              Placeholder Hero — copy definitivo e foto di Cristina in Fase 2. Questa sezione verifica solo gerarchia
              tipografica e spaziatura.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/cristina">Scopri MeLoProduco</LinkButton>
              <LinkButton href="/ricette" variant="secondary">
                Esplora le ricette
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

      {/* Cristina in RAI — placeholder */}
      <div className="bg-[var(--color-surface-subtle)]">
        <Container className="py-16">
          <SectionHeader eyebrow="Media" title="Cristina in RAI" description="Placeholder — interventi selezionati in arrivo." />
          <div className="mt-8">
            <EmptyState
              title="Nessun intervento ancora pubblicato in questa fase."
              description="Gli interventi RAI saranno collegati dopo la verifica dei diritti d'uso (vedi Fase 0, punto 8)."
            />
          </div>
        </Container>
      </div>

      {/* Ultime ricette — placeholder */}
      <Container className="py-16">
        <SectionHeader
          eyebrow="Dal Recipe Lab"
          title="Ultime ricette e autoproduzioni"
          description="Placeholder — alimentato in futuro da aiDady Publishing."
        />
        <div className="mt-8">
          <EmptyState title="Archivio ricette non ancora collegato." description="Fondamenta tecniche in corso (Fase 1)." />
        </div>
      </Container>

      {/* Metodo MeLoProduco — placeholder */}
      <div className="bg-[var(--color-surface-subtle)]">
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
      </div>

      {/* Newsletter */}
      <Container className="py-16">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-12">
          <SectionHeader eyebrow="Newsletter" title="Una mail utile, non rumore." />
          <div className="mt-6 max-w-md">
            <NewsletterFormShell compact />
          </div>
        </div>
      </Container>
    </>
  );
}
