import { Container } from "@/components/Container";

/**
 * Loading state minimale per /ricette (Step 3Q). Nessuno skeleton "da SaaS"
 * con box grigi animati: solo un placeholder editoriale leggero, coerente
 * col resto del sito.
 */
export default function LoadingRicette() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded-full bg-[var(--color-surface-subtle)]" />
        <div className="mt-3 h-9 w-72 rounded-full bg-[var(--color-surface-subtle)]" />
      </div>
    </Container>
  );
}
