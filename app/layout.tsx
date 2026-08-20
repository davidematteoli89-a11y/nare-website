import type { Metadata } from "next";
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
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Narè",
    title: "Narè — con Cristina di Narè",
    description: rootDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = {
    [editorialSerif.variable]: editorialSerif.style.fontFamily,
    [uiSans.variable]: uiSans.style.fontFamily,
  } as React.CSSProperties;

  return (
    <html lang="it" className="h-full antialiased" style={fontVars}>
      <body className="flex min-h-full flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
