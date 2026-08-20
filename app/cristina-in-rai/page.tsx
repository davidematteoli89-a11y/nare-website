import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

export const metadata: Metadata = {
  title: "Cristina in RAI",
  description: "Gli interventi televisivi di Cristina di Narè.",
};

/**
 * Archivio interventi RAI — Step 1B/1P. Nessun video reale integrato
 * (Cloudflare Stream/RaiPlay/embed ufficiale sono fuori scope Fase 1, e
 * comunque richiedono prima la verifica dei diritti d'uso, vedi Fase 0
 * punto 8). Il singolo VideoPlaceholder qui sotto usa dati palesemente di
 * esempio (nessun intervento reale inventato) solo per verificare il
 * pattern visivo in questa fase.
 */
export default function CristinaInRaiPage() {
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Media" title="Cristina in RAI" description="Archivio degli interventi televisivi — in costruzione." />

      <p className="mt-6 max-w-2xl text-sm text-[var(--color-foreground-muted)]">
        Questa sezione non sponsorizza né rappresenta un rapporto ufficiale con RAI. Prima della pubblicazione dei video
        reali verranno verificati i diritti d&apos;uso di ciascun intervento (vedi Fase 0, punto 8).
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <VideoPlaceholder
          title="Esempio segnaposto — nessun intervento reale"
          programme="Programma da definire"
          posterSrc="/images/placeholders/video-poster.png"
        />
      </div>
    </Container>
  );
}
