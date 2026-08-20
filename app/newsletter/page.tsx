import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { NewsletterFormShell } from "@/components/NewsletterFormShell";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Iscriviti alla newsletter di MeLoProduco.",
};

export default function NewsletterPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Newsletter" title="Una mail utile, non rumore." />
      <div className="mt-8 max-w-md">
        <NewsletterFormShell />
      </div>
    </Container>
  );
}
