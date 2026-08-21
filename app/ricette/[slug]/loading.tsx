import { Container } from "@/components/Container";

/** Loading state minimale per /ricette/[slug] (Step 3Q). */
export default function LoadingRecipeDetail() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="animate-pulse">
        <div className="h-4 w-56 rounded-full bg-[var(--color-surface-subtle)]" />
        <div className="mt-6 h-10 w-96 max-w-full rounded-full bg-[var(--color-surface-subtle)]" />
      </div>
    </Container>
  );
}
