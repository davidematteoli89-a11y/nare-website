import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeader } from "@/components/SectionHeader";
import { LinkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "Cristina",
  description: "Cristina di Narè: economia domestica, naturopatia e divulgazione pratica dell'autoproduzione.",
};

export default function CristinaPage() {
  return (
    <Container className="py-16">
      <Eyebrow>Cristina di Narè</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl text-[var(--color-foreground)]">
        Economia domestica, naturopatia, divulgazione pratica.
      </h1>

      <div className="mt-10 aspect-[16/9] w-full max-w-3xl rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)]" />

      <p className="mt-10 max-w-2xl text-[var(--color-foreground-muted)]">
        Placeholder bio — il racconto del percorso di Cristina (economia domestica, naturopatia, esperienza televisiva) sarà
        scritto in Fase 2/3, con contenuti reali.
      </p>

      <div className="mt-16">
        <SectionHeader eyebrow="Media" title="Cristina in RAI" />
        <div className="mt-6">
          <LinkButton href="/cristina-in-rai" variant="secondary">
            Vai all&apos;archivio interventi
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
