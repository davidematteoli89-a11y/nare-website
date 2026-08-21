import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { editorialSerif, uiSans } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// SEO foundation (Step 1N, riallineata in Fase 1B, estesa in Fase 2Y):
// metadataBase, title template, description base, Open Graph foundation.
// Il brand ombrello è Narè: la description root non si limita più a
// MeLoProduco/autoproduzione, ma racconta Cristina, esperienze,
// autoproduzione, educazione e incontri. Nessuno structured data
// schema.org ancora (rimandato a una fase successiva).
const rootDescription =
  "Narè è il progetto di Cristina di Narè: economia domestica, naturopatia e divulgazione pratica, tra autoproduzione con MeLoProduco, incontri dal vivo e attività educative.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Narè — con Cristina di Narè",
    template: "%s · Narè",
  },
  description: rootDescription,
  // Canonical/OG url di default per la Home (Fase 9B/9G): la Home non ha
  // un metadata proprio (app/page.tsx), quindi eredita interamente da qui.
  // Le pagine con metadata proprio sovrascrivono questi valori.
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Narè",
    title: "Narè — con Cristina di Narè",
    description: rootDescription,
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Brand icons (Fase 9H): app/favicon.ico copre già la favicon di base
  // (convenzione automatica Next.js App Router). Qui aggiungiamo icon e
  // apple-touch-icon usando il logo Narè reale già fornito dal cliente
  // (public/images/branding/logo-nare.png, 250×250px) — file originale non
  // alterato, solo referenziato. Nessun manifest.json: il sito non è una
  // PWA e non ne ha bisogno per gli scopi di questa fase.
  icons: {
    icon: "/images/branding/logo-nare.png",
    apple: "/images/branding/logo-nare.png",
  },
};

// WebSite JSON-LD (Fase 9F): NESSUNA SearchAction — /cerca esiste solo come
// interfaccia placeholder (nessuna ricerca funzionante dietro), quindi
// dichiarare una SearchAction sarebbe falso. Solo i campi base, tutti reali.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Narè",
  url: siteUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // next/font/google espone le custom properties CSS (--font-editorial-serif,
  // --font-ui-sans) tramite le classi `.variable`, non tramite uno style
  // object — vanno applicate come className sull'<html>, non come style
  // inline (Fase 9V, adattato dal precedente stack di font di sistema).
  return (
    <html
      lang="it"
      className={`h-full antialiased ${editorialSerif.variable} ${uiSans.variable}`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Analytics (Fase 9I/9L): Vercel Web Analytics, non GA4. Scelta
            motivata da semplicità e privacy — nessun cookie, nessun
            identificatore persistente lato client, nessuna richiesta di
            consenso cookie necessaria (a differenza di GA4, che in UE
            richiederebbe un banner di consenso prima del caricamento).
            Nessun ID da configurare via env: l'integrazione ufficiale
            @vercel/analytics si attiva automaticamente sul progetto
            collegato a Vercel, sia in produzione che in preview. */}
        <Analytics />
      </body>
    </html>
  );
}
