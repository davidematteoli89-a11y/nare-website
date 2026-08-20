import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = { title: "Cookie" };

/** Pagina legale — Step 1B: skeleton. Testo reale da redigere con consulenza legale prima del go-live. */
export default function CookiePage() {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-foreground)]">Cookie</h1>
      <p className="mt-6 text-sm text-[var(--color-foreground-muted)]">
        Testo dell&apos;informativa cookie in preparazione. Il contenuto definitivo sarà redatto prima del go-live, con
        consulenza legale.
      </p>
    </Container>
  );
}
